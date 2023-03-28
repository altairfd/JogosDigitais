//GameOver.js
import { Scene } from "phaser";

export default class GameOver extends Scene {
    constructor() {
        super('game-over');
    }

    create() {
        let width = this.scale.width;
        let height = this.scale.height;

        this.add.text(width/2, height/2, "FOI DE AMERICANAS", {
            fontSize: 48,
            color: '#fff'
        }).setOrigin(0.5);

        //Jogar de novo
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('level');
        });
    }
}