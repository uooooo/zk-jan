import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let players = [];
let choices = {};

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);
  players.push(socket.id);

  socket.on('choice', (choice) => {
    choices[socket.id] = choice;
    console.log('User choice:', choice);

    if (Object.keys(choices).length === players.length) {
      // All players have made their choices
      const results = determineResults(choices);
      io.emit('roundResults', results);
      choices = {}; // Reset choices for the next round
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
    players = players.filter(id => id !== socket.id);
    delete choices[socket.id];
  });
});

function determineResults(choices) {
  const choiceArray = Object.values(choices);
  const uniqueChoices = [...new Set(choiceArray)];

  if (uniqueChoices.length === 1) {
    return { isTie: true, winners: [] };
  }

  const winMap = {
    rock: 'scissors',
    paper: 'rock',
    scissors: 'paper',
  };

  const winners = [];
  for (const [player, choice] of Object.entries(choices)) {
    const opponents = choiceArray.filter(c => c !== choice);
    if (opponents.every(opponent => winMap[choice] === opponent)) {
      winners.push(player);
    }
  }

  return { isTie: winners.length === 0, winners };
}

server.listen(3000, () => {
  console.log('listening on *:3000');
});