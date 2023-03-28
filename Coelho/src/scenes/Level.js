//Stages 
import { Math, Scene } from "phaser";
import Carrot from '../Objects/Carrot';

export default class Level extends Scene {
    //Atributos


    /** 
     * @type {Phaser.Physics.Arcade.Sprite}
     */
    player;

    /**
     * @type {Phaser.Physics.Arcade.StaticGroup}
     */
    plataforms;
    
    /**
     * @type {Phaser.Types.Input.Keyboard.CursorKeys}
     */
    cursors;

    /**@type {Phaser.Physics.Arcade.Group} */
    carrots;

    //Pontuação 
    points = 0;

    /**
     * @type {Phaser.GameObjects.Text}
     */
    pointsText;



    constructor() {
        super('level') // Sempre tem que ter super
    }

    preload() {
        this.load.image('background', 'assets/bg_layer1.png');
        this.load.image('platform', 'assets/ground_grass.png');
        this.load.image('bunny-stand', 'assets/bunny1_stand.png');
        this.load.image('bunny-jump', 'assets/bunny1_jump.png');
        this.load.image('carrot', "assets/carrot.png");
        this.load.audio("jump", 'assets/sfx/jump.ogg');
        this.load.audio('gameover', 'assets/sfx/gameover.ogg')
    }

    create() {
        this.add.image(240, 320, 'background')
            .setScrollFactor(0, 0);

        //Plataforma
        //const plataform = this.physics.add.staticImage(240, 320, 'platform')
            //.setScale(0.5);

        //Grupo de plataformas
        this.plataforms = this.physics.add.staticGroup();
        
        //Adicionando scenas aleatoriamente em uma scena
        for (let i = 0; i < 5; i++) {
            const x = Math.Between(80, 400);
            const y = 150 * i;

            const plataform = this.plataforms.create(x, y, 'platform');
            plataform.setScale(0.5);
            plataform.body.updateFromGameObject();
        }   

        //Player
        this.player = this.physics.add.image(240, 120, 'bunny-stand')
            .setScale(0.5);

        //Faz os elementos conlidirem
        this.physics.add.collider(this.player, this.plataforms);

        //Desabilitando a colisão do coelho e deixando apenas em baixo
        this.player.body.checkCollision.up = false;
        this.player.body.checkCollision.left = false;
        this.player.body.checkCollision.right = false;

        //Camera
        this.cameras.main.startFollow(this.player);

        //DeadZone da camera
        this.cameras.main.setDeadzone(this.scale.width * 1.5);

        //Cursores
        this.cursors = this.input.keyboard.createCursorKeys();

        //Cenouras
        this.carrots = this.physics.add.group({
            classType: Carrot
        });

        this.physics.add.collider(this.carrots, this.plataforms);
        
        this.physics.add.overlap(this.player, this.carrots, this.handleCollectCarrot, undefined, this);

        //Texto de pontuação
        const style = {color: '#000', fontSize: 24};
        this.pointsText = this.add.text(240, 10, 'Cenouras: 0', style);
        this.pointsText.setScrollFactor(0);
        this.pointsText.setOrigin(0.5, 0);
    }

    
    update(time, del) {
        //Pulando
        const touchingGround = this.player.body.touching.down;

        if (touchingGround) {
            this.player.setVelocityY(-300);
            this.sound.play('jump');

            //Mudar imagem do coelho
            this.player.setTexture('bunny-jump');
        }

        let velocityPlayer = this.player.body.velocity.y;
        if (velocityPlayer > 0 && this.player.texture.key !== 'bunny-stand') {
            this.player.setTexture('bunny-stand');
        }

        //Reusando as plataformas
        this.plataforms.children.iterate(child => {

            /**
             * @type {Phaser.Physics.Arcade.Sprite}
             */
            const plataform = child;
            
            //Pegar a posição Y da câmera
            const scrollY = this.cameras.main.scrollY;
            if (plataform.y >= scrollY + 700) {
                plataform.x = Math.Between(80, 400);
                plataform.y = scrollY - Math.Between(0, 10);
                plataform.body.updateFromGameObject();
            }

            //Criar uma cenoura acima
            this.addCarrotAbove(plataform);
        });

        //Cursores Direita e Esquerda
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);
        } else {
            this.player.setVelocityX(0);
        }

        //Testando se o coelho caiu
        let buttomPlataform = this.findBottomPlatform();
        if (this.player.y > buttomPlataform.y + 200) {
            console.log("Foi de americanas");
            //Tela de game over
            //Ir para outra cena
            this.sound.play('jump');
            this.scene.start('game-over');
        }
    }

    addCarrotAbove(plataforms) {
        //Respawn da cenoura
        const y = plataforms.y - plataforms.displayHeight;

        const carrot = this.carrots.get(plataforms.x, y, 'carrot');

        carrot.setActive(true);
        carrot.setVisible(true);
        
        this.add.existing(carrot);
        carrot.body.setSize(carrot.width, carrot.height);
        this.physics.world.enable(carrot);
    }

    //Comendo a cenoura funçao, utilizando kil and hide
    handleCollectCarrot(player, carrot) {
        this.carrots.killAndHide(carrot);
        this.physics.world.disableBody(carrot.body);

        this.points++;
        this.pointsText.text = 'Cenouras: ' + this.points;
        
    }

    //Procura a plataforma mais baixa
    findBottomPlatform() {
        let plataforms = this.plataforms.getChildren();
        let buttomPlataform = plataforms[0];
        
        for (let i = 1; i < plataforms.length; i++){
            let plataform = plataforms[1];

            if (plataform.y < buttomPlataform.y) {
                continue;
            }

            buttomPlataform = plataform;

        }

        return buttomPlataform;
    }
}