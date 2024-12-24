'use strict';

module.exports = class Stepper {
  gpio = require('rpio');
  //Stepper Motor FAST
  STEP_FAST_PIN = 8;
  DIRECTION_FAST_PIN = 10;
  STEP_SLOW_PIN = 12;
  DIRECTION_SLOW_PIN = 16;

  SPEED_FAST = 10;
  SPEED_SLOW = 1000;
  SPEED_SLOW2 = 1000;

  currentWeight = 0;
  thresholdTarget = 0.2;
  targetWeight = 43.0;

  THRESHOLD_FAST = 10;
  THRESHOLD_SLOW = 5;
  THRESHOLD_SLOW2 = 1;

  constructor(targetWeight, thresholdTarget) {
    this.targetWeight = targetWeight;
    this.thresholdTarget = thresholdTarget;
    this.gpio.open(this.STEP_FAST_PIN, this.gpio.OUTPUT, this.gpio.LOW);
    this.gpio.open(this.DIRECTION_FAST_PIN, this.gpio.OUTPUT, this.gpio.LOW);

    //Stepper Motor SLOW
    this.gpio.open(this.STEP_SLOW_PIN, this.gpio.OUTPUT, this.gpio.LOW);
    this.gpio.open(this.DIRECTION_SLOW_PIN, this.gpio.OUTPUT, this.gpio.LOW);
  };

  moveSlow2() {
    this.gpio.write(this.STEP_SLOW_PIN, this.gpio.HIGH);
    this.gpio.msleep(this.SPEED_SLOW2);
    this.gpio.write(this.STEP_SLOW_PIN, gpio.LOW);
    this.gpio.msleep(this.SPEED_SLOW2);
    console.log("SLOW_2: "); 
    if(this.currentWeight <= (this.targetWeight)) {
      this.moveSlow2();
    } else {
      console.log("Target Weight Reached");
    }
  };
  
  moveSlow() {
    this.gpio.write(this.STEP_SLOW_PIN, this.gpio.HIGH);
    this.gpio.msleep(this.SPEED_SLOW);
    this.gpio.write(this.STEP_SLOW_PIN, this.gpio.LOW);
    this.gpio.msleep(this.SPEED_SLOW);
    console.log("SLOW: ");  
    if(this.currentWeight < (this.targetWeight - this.THRESHOLD_SLOW)) {
      this.moveSlow();
    } else {
      this.moveSlow2();
    }
  };
  
  moveFast() {
    this.gpio.write(this.STEP_FAST_PIN, this.gpio.HIGH);
    this.gpio.msleep(this.SPEED_FAST);
    this.gpio.write(this.STEP_FAST_PIN, this.gpio.LOW);
    this.gpio.msleep(this.SPEED_FAST);
    console.log("current: " + this.currentWeight + " target: " + this.targetWeight);
    console.log("diff: " + (this.targetWeight - this.THRESHOLD_FAST));

    if(this.currentWeight < (this.targetWeight - this.THRESHOLD_FAST)) {
      this.moveFast();
    } else {
      this.moveSlow();
    }
  };

  startTrickler() {
    this.gpio.write(this.DIRECTION_FAST_PIN, this.gpio.HIGH);
  
    if(this.currentWeight == 0 ) {
      console.log("StartTrickler Current Weight: " + this.currentWeight);
      this.moveFast();
    } else {
      console.log("not 0");
      this.gpio.sleep(1);
      this.startTrickler();
    }
  };

  updateTargetWeight(weight) {
    if(typeof(weight) !== 'number') {
      weight = parseFloat(weight);
      //console.log(weight);
    }
    this.targetWeight = weight;
  }

  updateCurrentWeight(weight) {
    if(typeof(weight) !== 'number') {
      weight = parseFloat(weight);
    }
    this.currentWeight = weight;
  }
}
