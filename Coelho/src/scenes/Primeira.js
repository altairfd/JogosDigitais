import { Scene } from "phaser";

export default class Primeira extends Scene {
  p2; //Inicia a variável/imagem

  constructor() {
    //Chamar o construtor da classe mãe
    //Passar o nome único desta cena  
    super('primeira');
  }

  //Carrega seus arquivos para uso
  preload() {
    this.load.image('plataforma', 'assets/ground_grass.png')
    //Pre carrega a imagem, noemia a mesma e o caminho para ela
  }

  //Inicializa os objetos gráficos na tela
  create() {
    const p = this.add.image(240, 320, 'plataforma') //Adiciona a imagem
    p.setScale(0.5); //Escalamento da imagem
    /* p.x = 100;
    p.y = 200;*/
    
    this.p2 = this.add.image(240, 320, 'plataforma')
      .setScale(0.5)
      .setAngle(15)
  }

  //Chama a cada atualização
  update(time, del) {
    this.p2.angle += 2;
    this.p2.x += 1;
    if (this.p2.x > 480) {
      this.p2.x = 0;
    } 
  }

}