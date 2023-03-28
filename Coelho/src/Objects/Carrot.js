import Phaser from 'phaser';
export default class Carrot extends Phaser.Physics.Arcade.Sprite {
    
    //Construtor sempre tem que ter cena, x, y, textura e imagem
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        this.setScale(0.5);
    }
}