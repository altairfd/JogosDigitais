import { AUTO, Game, Physics } from 'phaser';
import Level from './src/scene/Level';


const config = {
  width: 480,
  height: 640, 
  type: AUTO,
  scene: [Level],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 180
      },
      debug: true
    }
  }
}

new Game(config);
