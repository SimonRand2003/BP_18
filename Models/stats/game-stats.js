import { Subject } from "../../subject.js";
import { Money } from "../money.js";

class GameStats extends Subject {
  constructor(game) {
    super();
    this.game = game;
    this.capital = new Money(50000);
    this.totalTimeSpent = 0;
    this.partUsage = {}; // Object to track total parts used (partName: count)
    this.carCompletionTimes = []; // Array to store completion times of each car
    this.carsCompleted;
  }

  updateCarStats(cars) {
    let carsCompleted = 0;
    let totalIncome = 0;
    for (const car of cars.values()) {
      if (car.isComplete()) {
        carsCompleted++;
        totalIncome += car.fixedPrice;
      }
    }
    if (carsCompleted != this.carsCompleted) {
      this.carsCompleted = carsCompleted;
      this.totalIncome = totalIncome;
      this.notifyObservers(this);
    }
  }
  
}

export { GameStats };
