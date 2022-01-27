import Player from './Player.mjs';
import Collectible from './Collectible.mjs';
import dim from './dim.js';

const socket = io();
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');

const SPEED = 5;

let tick;
let playerEntity;
let foodEntity;
let mineEntity;
let players = [];

let avatarMe = new Image();
let avatarOther = new Image();
let avatarFood = new Image();
let avatarMine = new Image();

const init = () => {
  avatarMe.src = '/public/img/pMe.png'
  avatarOther.src = '/public/img/pOther.png'
  avatarFood.src = '/public/img/pFood.png'
  avatarMine.src = '/public/img/pMine.png'

  // Create user
  socket.on('init', ({id, players, foodItem, mineItem}) => {
    playerEntity = new Player(players.filter(x => x.id === id)[0]);
    mineEntity = new Player(mineItem);
    foodEntity = new Collectible(foodItem);
    console.log('Mine: ', mineEntity, '\n', 'Food: ', foodEntity);
    players = players;

    document.onkeydown = e => {
      console.log(e);
      var dir = null;
      switch(e.key) {
        case 'w':
        case 'W':
          dir = 'up';
          break;
        case 's':
        case 'S':
          dir = 'down';
          break;
        case 'a':
        case 'A':
          dir = 'left';
          break;
        case 'd':
        case 'D':
          dir = 'right';
          break;
      }

      if (dir) {
        playerEntity.movePlayer(dir, SPEED);
        socket.emit('update', playerEntity);
      }
    }

    socket.on('update', ({players: players, mine: mine, food: food, player: player}) => {
      console.log('game update')
      mineEntity = new Player(mine);
      foodEntity = new Collectible(food);
      players = players;
      if (player && player.id === playerEntity.id) {
        playerEntity = new Player(player)
      }
    });
  });

  window.requestAnimationFrame(update);
}

const update = () => {
  console.log('game update function')
  context.clearRect(0, 0, canvas.width, canvas.height)
  
  context.fillStyle = '#FFF';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = '#000';
  context.strokeRect(dim.minX, dim.minY, dim.gameAreaX, dim.gameAreaY);

  // Controls
  context.fillStyle = '#000';
  context.font = "13px 'Press Start 2P'";
  context.textAlign = 'center';
  context.fillText('Controls', 80, 20);
  context.textAlign = 'center';
  context.fillText('WASD', 80, 40);

  // Game title
  context.font = "20px 'Press Start 2P'";
  context.fillText('SquareIo', 330, 40);

  if (playerEntity) {
    playerEntity.draw(context, avatarMe);
    context.font = "16px 'Press Start 2P'";
    context.fillText(playerEntity.calculateRank(players), 560, 40);
    for (p of players) {
      if (p.id !== playerEntity.id) {
        let newP = new Player(p);
        newP.draw(context, avatarOther);
      }
    }

    if (foodEntity) {
      foodEntity.draw(context, avatarFood);
    }

    if (mineEntity) {
      mineEntity.draw(context, avatarMine);
    }
  }

  tick = requestAnimationFrame(update);
}

init();