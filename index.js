const express = require('express');
const app = express();

const WSServer = require('express-ws')(app);
const aWss = WSServer.getWss()

const PORT = process.env.PORT || 5000;

app.ws('/',  (ws, req) => {
  ws.on('message', (answer) => {
    const message = JSON.parse(answer);
    switch (message.method) {
      case 'connection':
        connectionHandler(ws, message);
        break;

      case 'draw':
        connectionHandler(ws, message);
        break;
    }
  });
});

app.listen(PORT, () => console.log(`Server has started on PORT ${PORT}`));

const connectionHandler = (ws, message) => {
  ws.id = message.id;

  broadcastConnection(ws, message);
};

const broadcastConnection = (ws, message) => {
  aWss.clients.forEach(client => {
    if (client.id === message.id) {
      client.send(JSON.stringify(message));
    }
  });
};
