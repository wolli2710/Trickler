'use strict';

module.exports = class Stepper {
  gpio = require('rpio');

  stepPin = null;
  directionPin = null;
  speed = 0;

  THRESHOLD_FAST = 10;
  THRESHOLD_SLOW = 5;
  THRESHOLD_SLOW2 = 1;

  constructor(_stepPin, _directionPin, _speed) {
    this.speed = _speed;
    this.stepPin = _stepPin;
    this.directionPin = _directionPin;
    this.gpio.open(this.stepPin, this.gpio.OUTPUT, this.gpio.LOW);
    this.gpio.open(this.directionPin, this.gpio.OUTPUT, this.gpio.LOW);
  };

  move(steps) {
    for (let i = 0; i < steps; i++) {
      this.gpio.write(this.stepPin, this.gpio.HIGH);
      this.gpio.msleep(this.speed);
      this.gpio.write(this.stepPin, this.gpio.LOW);
      this.gpio.msleep(this.speed);
    }
  };
  
  startTrickler() {
    this.gpio.write(this.directionPin, this.gpio.HIGH);
  };
}
