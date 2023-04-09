import { AUTO, Game, Physics } from 'phaser';
import Level from './src/scene/Level';
import GameOver from './src/scene/GameOver';


const config = {
  width: 480,
  height: 640, 
  type: AUTO,
  scene: [Level, GameOver],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 180
      },
      debug: false
    }
  }
}

new Game(config);
