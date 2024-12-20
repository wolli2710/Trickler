const { SerialPort } = require('serialport')

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const port = 3000
const { Server } = require("socket.io");
const io = new Server(server);

const serialPort = new SerialPort({ 
	path: '/dev/ttyUSB0', 
	baudRate: 9600,
	dataBits: 8,
        stopBits: 1,
        parity: 'none',
	timeout: 0.1 })

var getScaleDataGnG = function(){
  var esc = Buffer.alloc(1, 27);
  var pn = Buffer.from("pn");
  return Buffer.concat([esc, pn]);
}

serialPort.on('open', () => setInterval(() => serialPort.write(getScaleDataGnG()), 10));

serialPort.on('data', function (data) {
    const stringData = data.toString();

    if (stringData) {
        console.log(`data received: ${stringData}`);
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

  socket.on('startTrickler', (msg) => {
    io.emit('updateCurrentWeight', msg);
  });
});

server.listen(port, () => {
  console.log(`Trickler app listening on port ${port}`);
});
