var gpio = require("gpio");

var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var LED = new Gpio(4, 'out'); //use GPIO pin 4, and specify that it is output
var blinkInterval = setInterval(blinkLED, 250); //run the blinkLED function every 250ms

function blinkLED() { //function to start blinking
  if (LED.readSync() === 0) { //check the pin state, if the state is 0 (or off)
    LED.writeSync(1); //set pin state to 1 (turn LED on)
  } else {
    LED.writeSync(0); //set pin state to 0 (turn LED off)
  }
}

function endBlink() { //function to stop blinking
  clearInterval(blinkInterval); // Stop blink intervals
  LED.writeSync(0); // Turn LED off
  LED.unexport(); // Unexport GPIO to free resources
}

setTimeout(endBlink, 5000);

/*
stopMotors = false;

var pin1 = 8;
var pin2 = 10;

var gpio8 = gpio.export(pin1, {
   direction: gpio.DIRECTION.OUT,
   ready: function() {
     console.log("ready pin1")
   }
});

var gpio10 = gpio.export(pin2, {
   direction: gpio.DIRECTION.OUT,
   ready: function() {
     console.log("ready pin2")
   }
});

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}


// Runs motor in the set direction
function move() {
   gpio8.write(pin1, 1, function() {
        sleep(1000);  
         gpio8.write(pin1, 0, function() {
            sleep(1000);
            if(!stopMotors)move();
        });      
      });
}

move()
*/


/*
function stopMotor() {
  stopMotors = true;
}

// Changing direction of motor
function left() {
  stopMotors = false;
  gpio10.write(pin2, 1, function() {
      move();
  });  
}

// Changing direction of motor
function right() {
  stopMotors = false;
  gpio.write(pin2, 0, function() {
      move();
  });  
}
*/
