import Phaser from "phaser";
import { CONFIG } from "../config";

export default class Hud extends Phaser.GameObjects.Container {

  /** @type {Phaser.GameObjects.Container} */
  dialog;

  /** @type {Phaser.GameObjects.Text} */
  dialogText

  /** @type {Phaser.GameObjects.Sprite} */
  dialogNext

  dialogPositionShow;
  dialogPositionHide;
  
  isDialogBlock = false;

  constructor(scene, x, y) {
    super(scene, x, y);

    //Colocanod hud na tela
    scene.add.existing(this);

    this.createDialog();
  }

  createDialog() {
    //this.dialog = this.add.container(0, 0)
    //  .setDepth(10);

    this.dialog = this.add(new Phaser.GameObjects.Container(this.scene));
    this.dialog.setDepth(10);

    const tile = CONFIG.TILE_SIZE;
    const widthDialog = CONFIG.GAME_WIDTH - (2 * CONFIG.TILE_SIZE);
    const hightDialog = 4 * tile;

    //Usando as variaveis de dialog
    this.dialogPositionShow = CONFIG.GAME_HEIGHT - hightDialog - tile * 2;
    this.dialogPositionHide = CONFIG.GAME_HEIGHT + tile;
    this.dialog.add(
      [
        this.scene.add.image(0, 0, 'hud', 'dialog_topleft'),
        this.scene.add.image(16, 0, 'hud', 'dialog_top')
          .setDisplaySize(widthDialog, tile),

        this.scene.add.image(0, 16, 'hud', 'dialog_left')
          .setDisplaySize(16, hightDialog),

        this.scene.add.image(16, 16, 'hud', 'dialog_center')
          .setDisplaySize(widthDialog, hightDialog),
          
        this.scene.add.image(widthDialog, 16, 'hud', 'dialog_right')
          .setDisplaySize(16, hightDialog),

        this.scene.add.image(widthDialog + tile, 0, 'hud', 'dialog_topright'),
      ]
    );

    this.dialog.setPosition(0, this.dialogPositionHide);

    const style = {
      FontFamily: 'Verdana',
      fontSize: 14,
      color: '#6b5052',
      maxLines: 3,
      wordWrap: { width: widthDialog }
    }

    this.dialogText = this.scene.add.text(tile, tile, 'Meu texto', style);
    this.dialog.add(this.dialogText);
  }

  showDialog(text) {
    this.dialogText.text = '';

    //Verificando se está fora da tela
    if (this.dialog.y > this.dialogPositionShow) {
      console.log('fora da tela')
      this.isDialogBlock = true;

      this.scene.add.tween({
        targets: this.dialog,
        duration: 800,
        y: this.dialogPositionShow,
        //Animação da caixa do dialog
        ease: Phaser.Math.Easing.Bounce.Out,
        onComplete: () => {
          this.showText(text);
        }
      });
    } else {
      this.showText();
    }
  }

  showText(text) {
    //this.dialogText.text = text;
    //Fazer o dialog aparecer igual o dialog do megamam
    let i = 0;
    this.scene.time.addEvent({
      repeat: text.length - 2,
      delay: 20,
      callback: () => {
        this.dialogText.text += text[i++];
        if (this.dialogText.text.length == text.length) {
          this.isDialogBlock = false;
        }
      }
    })
  }

  hideDialog() {
    this.scene.add.tween({
      targets: this.dialog,
      duration: 800,
      y: this.dialogPositionShow,
      //Animação da caixa do dialog
      ease: Phaser.Math.Easing.Bounce.In
    })
  }
}