import { Car } from "./car.js";
import { Workstation } from "./workstation.js";
import { Stock } from "./Stock.js";
import { Round } from "./Round.js";
import { Bot } from "./occupant/bot.js";
import data from "../db/parts.json" assert { type: "json" };
import { GameStats } from "./stats/game-stats.js";
import { Money } from "./money.js";
import { RoundStats } from "./stats/round-stats.js";
import { JustInTime } from "../lean-methods/just-in-time.js";
import { CompositeLeanMethod } from "../lean-methods/composite-lean-method.js";
import { QualityControl } from "../lean-methods/quality-control.js";
import { TraditionalStock } from "./stock/traditional-stock.js";
class Game {
  constructor() {
    this.workstations = new Map();
    this.cost = 0;
    this.rounds = new Map();
    this.carId = 1;
    this.cars = new Map();
    this.parts = data.parts;

    for (let i = 0; i < this.parts.length / 4; i++) {
      const startIndex = i * 4; // Starting index for each workstation (multiples of 4)
      const partList = this.parts.slice(startIndex, startIndex + 4); // Slice the first 4 parts
      this.workstations.set(i + 1, new Workstation(i + 1, partList));
    }

    this.bots = [];
    for (let i = 1; i <= 5; i++) {
      this.bots.push(new Bot(`bot${i}`, i, this));
    }
    this.isOver = false;
    this.capital = new Money(50000);
    this.stock = new TraditionalStock(this.parts);
    //this.createLeanMethods();
  }

  newGame() {
    this.newCar();
    this.newRound();
    this.stats = new GameStats(this);
  }

  newRound() {
    const roundnumber = this.rounds.size + 1;
    const newRound = new Round(new RoundStats(roundnumber, this));
    this.rounds.set(roundnumber, newRound);
    this.currentRound = newRound;
    this.stock.newRound();
    this.bots.forEach((bot) => bot.startWorking());
  }

  endRound() {
    this.currentRound.endRound();
    this.bots.forEach((bot) => bot.stopAddingParts());
    this.capital.add(this.currentRound.stats.capital);
    if (this.rounds.size === 5) {
      this.endGame();
    }
  }

  newCar() {
    const car = new Car(this.carId, this.parts);
    this.cars.set(car.id, car);
    this.carId++;
  }

  getCarFromWorkstation(workstationid) {
    // Find the car with matching state
    const matchingCar = Array.from(this.cars.values()).find(
      (car) => car.state.workstationId === workstationid
    );

    return matchingCar; // Might return undefined if no car is found
  }

  moveWaitingcars() {
    for (const car of this.cars.values()) {
      car.state.moveWaitingCar(car, this.cars);
    }
    this.newCarAtWorkstation1();
  }

  newCarAtWorkstation1() {
    if (!this.getCarFromWorkstation(1)) {
      this.newCar();
    }
  }

  addPart(part, workstationId) {
    console.log(this.stock)
    const car = this.getCarFromWorkstation(workstationId);
    try{
      this.stock.requestPart(part);
      this.cars.get(car.id).addPart(part);

    }
    catch (error){
      console.error(error)
    }

    if (car.isComplete()) {
      this.carCompleted(car);
    }
  }

  carCompleted(car) {
    this.stats.updateOnCarCompletion(car);
    this.currentRound.stats.updateOnCarCompletion(car);
  }

  addPartOrMoveBot(workstationId) {
    const car = this.getCarFromWorkstation(workstationId);
    if (this.getCarFromWorkstation(workstationId)) {
      const workstation = Array.from(this.workstations.values()).find(
        (workstation) => workstation.id === workstationId
      );
      if (workstation.isComplete(car.parts)) {
        //if car is complete move to next station
        car.moveCar(this.cars);
        this.moveWaitingcars();
      } else if (workstation.getIncompletePart(car.parts)) {
        this.addPart(
          workstation.getIncompletePart(car.parts).name,
          workstationId
        );
      }
    }
  }
  endGame() {
    this.isOver = true;
  }

  createLeanMethods() {
    this.leanMethodMap = new Map();
    this.leanMethodMap.set('JIT', new JustInTime(this.stock));
    this.leanMethodMap.set('QC', new QualityControl());
    // Add more lean methods here following the same pattern

    this.leanMethodMap.get('JIT').enableJustInTime()
  }
  
}

export { Game };
