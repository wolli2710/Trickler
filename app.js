const { SerialPort } = require('serialport')
const Stepper = require('./stepper');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const port = 3000
const { Server } = require("socket.io");
const io = new Server(server);

var stepper1 = new Stepper(43.0, 0.2);

const serialPort = new SerialPort({ 
	path: '/dev/ttyUSB0',
	baudRate: 9600,
	dataBits: 8,
  stopBits: 1,
  parity: 'none',
	timeout: 0.1 });

var getScaleDataGnG = function(){
  var esc = Buffer.alloc(1, 27);
  var pn = Buffer.from("pn");
  return Buffer.concat([esc, pn]);
}

serialPort.on('open', () => setInterval(() => serialPort.write(getScaleDataGnG()), 10));

serialPort.on('data', function (data) {
  const stringData = data.toString();

  if (stringData) {
    stepper1.updateCurrentWeight(stringData);
    //console.log(`data received: ${stringData}`);
  }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  serialPort.on('data', function (data) {
    const stringData = data.toString();
    if (stringData) {
      io.emit('updateCurrentWeight', stringData);
      stepper1.updateCurrentWeight(stringData);
    }
  });

  socket.on('updateTargetWeight', (msg) => {
    if(stepper1 !== null){
      stepper1.updateTargetWeight(msg);
    }
  });

  socket.on('startTrickler', () => {
    console.log('startTrickler ........');
    stepper1.startTrickler();
    //io.emit('updateCurrentWeight', msg);
  });

  socket.on('stopTrickler', () => {
    console.log('stopTrickler ........'); 
    stepper1 = new Stepper(43.0, 0.2);
  });
});

server.listen(port, () => {
  console.log(`Trickler app listening on port ${port}`);
});
