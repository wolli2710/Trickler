var gpio = require('rpio');

//Stepper Motor FAST
const STEP_FAST_PIN = 8;
const DIRECTION_FAST_PIN = 10;
const STEP_SLOW_PIN = 12;
const DIRECTION_SLOW_PIN = 16;

gpio.open(STEP_FAST_PIN, gpio.OUTPUT, gpio.LOW);
gpio.open(DIRECTION_FAST_PIN, gpio.OUTPUT, gpio.LOW);

//Stepper Motor SLOW
gpio.open(STEP_SLOW_PIN, gpio.OUTPUT, gpio.LOW);
gpio.open(DIRECTION_SLOW_PIN, gpio.OUTPUT, gpio.LOW);

var SPEED_FAST = 10;
var SPEED_SLOW = 1000;
var SPEED_SLOW2 = 1000;

var currentWeight = 0;
var targetWeight = 43.0;

var THRESHOLD_FAST = 10;
var THRESHOLD_SLOW = 5;
var THRESHOLD_SLOW2 = 1;

function moveSlow2() {
  gpio.write(STEP_SLOW_PIN, gpio.HIGH);
  gpio.msleep(SPEED_SLOW2);
  gpio.write(STEP_SLOW_PIN, gpio.LOW);
  gpio.msleep(SPEED_SLOW2);

  if(currentWeight <= (targetWeight)) {
    moveSlow2();
  } else {
    console.log("Target Weight Reached");
  }
}

function moveSlow() {
  gpio.write(STEP_SLOW_PIN, gpio.HIGH);
  gpio.msleep(SPEED_SLOW);
  gpio.write(STEP_SLOW_PIN, gpio.LOW);
  gpio.msleep(SPEED_SLOW);

  if(currentWeight < (targetWeight - THRESHOLD_SLOW)) {
    moveSlow();
  } else {
    moveSlow2();
  }
};

function moveFast() {
  gpio.write(STEP_FAST_PIN, gpio.HIGH);
  gpio.msleep(SPEED_FAST);
  gpio.write(STEP_FAST_PIN, gpio.LOW);
  gpio.msleep(SPEED_FAST);

  if(currentWeight < (targetWeight - THRESHOLD_FAST)) {
    moveFast();
  } else {
    moveSlow();
  }
};

gpio.write(DIRECTION_FAST_PIN, gpio.HIGH);

for (var i = 0; i < 10000; i++) {
  moveFast();
}

function startTrickler() {
  gpio.write(DIRECTION_FAST_PIN, gpio.HIGH);

  if(currentWeight === 0 ) {
    moveFast();
  }
}
