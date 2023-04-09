import { AUTO, Scene } from "phaser";

export default class GameOver extends Scene {
    constructor() {
        super('game-over');
    }

    preload() {
        this.load.image('over', 'assets/gameover.jpg')
    }

    create() {
        this.add.image(240, 320, 'over')
            .setScrollFactor(0, 0)
            .setScale(0.66)

        let width = this.scale.width;
        let hight = this.scale.height;

        this.add.text(width/2, hight/2, 'PRESS SPACE FOR TRY AGAIN', {
            fontSize: 30,
            color: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5, 5);

        //New Game
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('level');
        });
    }
}