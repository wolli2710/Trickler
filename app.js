const { SerialPort } = require('serialport')
const Stepper = require('./stepper');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const port = 3000
const { Server } = require("socket.io");
const io = new Server(server);

var ctx = this;

var tricklerStarted = false;
var targetWeight = 43.0;
var currentWeight = 0;

var thresholdTarget = 0.2;
var thresholdSlow = 2;
var thresholdFast = 10;

//Fast Stepper with 8 = stepPin and 10 = directionPin
var stepper1 = new Stepper(8, 10, 10);
//Slow Stepper with 12 = stepPin and 16 = directionPin
var stepper2 = new Stepper(12, 16, 1000);

var handleStepper = function(data){
  if(tricklerStarted === true) {
    currentWeight = parseFloat(data);
    console.log('targetWeight :' + data + ' thresholdFast :' + currentWeight);

    if(currentWeight < (targetWeight - thresholdFast)) {
      console.log('targetWeight :' + targetWeight + ' thresholdFast :' + thresholdFast);
      stepper1.move(8);

 /*   } else if(this.currentWeight < (this.targetWeight - this.thresholdSlow)) {
      this.stepper2.move(3);
    } else if(this.currentWeight < (this.targetWeight - this.thresholdTarget)) {
      this.stepper2.move(1);
      */
    } else {
      tricklerStarted = false;
    }
  }
}

var updateTargetWeight = function(weight) {
  if(typeof(weight) !== 'number') {
    weight = parseFloat(weight);
  }
  ctx.targetWeight = weight;
}

var updateCurrentWeight = function(weight) {
  if(typeof(weight) !== 'number') {
    weight = parseFloat(weight);
  }
  ctx.currentWeight = weight;
}

var getScaleDataGnG = function(){
  var esc = Buffer.alloc(1, 27);
  var pn = Buffer.from("pn");
  return Buffer.concat([esc, pn]);
}

const serialPort = new SerialPort({ 
	path: '/dev/ttyUSB0',
	baudRate: 9600,
	dataBits: 8,
  stopBits: 1,
  parity: 'none',
	timeout: 0.1 });

serialPort.on('open', () => setInterval(() => serialPort.write(getScaleDataGnG()), 10));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  serialPort.on('data', function (data) {
    const stringData = data.toString();
    if (stringData && stepper1 !== null) {
      handleStepper(stringData);
      io.emit('updateCurrentWeight', stringData);
    }
  });

  socket.on('updateTargetWeight', (msg) => {
    ctx.updateTargetWeight(msg);
  });

  socket.on('startTrickler', () => {
    console.log('startTrickler ........');
    tricklerStarted = true;
    stepper1.startTrickler();
  });

  socket.on('stopTrickler', () => {
    console.log('stopTrickler **********'); 
    //this.stepper1 = new Stepper(43.0, 0.2);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// ############################################################
// ######################## WEBSERVER #########################
// ############################################################
server.listen(port, () => {
  console.log(`Trickler app listening on port ${port}`);
});
