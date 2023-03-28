import {AUTO, Game, Physics} from 'phaser';
import GameOver from './src/scenes/GameOver';
import Level from './src/scenes/Level';
import Primeira from './src/scenes/Primeira';

const config = {  
  width: 480,
  height: 640, //largura e altura do jogo
  type: AUTO,
  scene: [Level, GameOver],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 200
      },
      debug: false
    }
  }
} //configurações do jogo

new Game(config);