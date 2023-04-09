import { Math, Scene } from "phaser";

export default class Level extends Scene {

    /**
     * @type {Phaser.Physics.Arcade.Sprite}
     */
    player;
    /**
     * @type {Phaser.Physics.Arcade.StaticGroup};
     */
    pipes;
    pipesUp;

    /**
     * @type {Phaser.Types.Input.Keyboard.CursorKeys}
     */
    cursors;

    //Points
    points = 0;

    /**
     * @type {Phaser.GameObjects.Text}
     */
    pointsText;

    constructor() {
        super('level');
    }

    preload() {
        this.load.image('background', 'assets/background.png');
        this.load.image('planeRed', 'assets/planeRed1.png');
        this.load.image('planeRed2', 'assets/planeRed2.png');
        this.load.image('planeRed3', 'assets/planeRed3.png');
        this.load.image('pipe', 'assets/pipe.png');
        this.load.image('pipeUp', 'assets/pipeUp.png')

    }

    create() {
        //Background
        this.add.image(240, 320, 'background')
            .setScrollFactor(0, 0);

        //Player
        this.player = this.physics.add.image(240, 120, 'planeRed')
            .setScale(0.7);

        //Pipes
        this.pipes = this.physics.add.staticGroup();
        for (let i = 0; i < 5; i++) {
            const y = Math.Between(400, 500);
            const x = 400 + (250 * i);

            const pipe = this.pipes.create(x, y, 'pipe');
            pipe.setScale(1.5);
            pipe.setOrigin(0.5);
            pipe.body.updateFromGameObject();
        }

        this.pipesUp = this.physics.add.staticGroup();
        for (let i = 0; i < 5; i++) {
            const y = Math.Between(400, 500);
            const x = (250 * i);

            const pipeTop = this.pipesUp.create(x, y - 150, 'pipeUp');
            pipeTop.setScale(1.5);
            pipeTop.setOrigin(0.6, 1.5);
            pipeTop.body.updateFromGameObject();
        }

        //Camera
        this.cameras.main.startFollow(this.player);

        //Colider
        this.physics.add.collider(this.player, this.pipes, () => {
            this.scene.start('game-over');
        });
        
        this.physics.add.collider(this.player, this.pipesUp, () => {
            this.scene.start('game-over');
        });
        this.player.body.checkCollision.right = true;
        this.player.body.checkCollision.up = true;
        this.player.body.checkCollision.down = true;


        //Cursores
        this.cursors = this.input.keyboard.createCursorKeys();

        //Points
        const style = {color: '#000', fontSize: 24};
        this.pointsText = this.add.text(240, 10, 'Pontuação: 0', style);
        this.pointsText.setScrollFactor(0);
        this.pointsText.setOrigin(0.5, 0);
    }

    update(time, del) {
        //Moving
        this.player.setAccelerationX(100);

        //Change Pipes
        this.pipes.children.iterate(child => {
            /**
             * @type {Phaser.Physics.Arcade.Sprite}
             */
            const pipe = child
            //Moving camera for taking more pipes
            const scrollX = this.cameras.main.scrollX;
            if (pipe.x + 400 <= scrollX) {
                pipe.y - 150 <= Math.Between(350, 500);
                pipe.x = scrollX + 800;
                pipe.body.updateFromGameObject();
            }
        })

        this.pipesUp.children.iterate(child => {
            /**
             * @type {Phaser.Physics.Arcade.Sprite}
             */
            const pipeUp = child
            //Moving camera for taking more pipeUps
            const scrollX = this.cameras.main.scrollX;
            if (pipeUp.x + 400 <= scrollX) {
                pipeUp.y + 150 <= Math.Between(350, 500);
                pipeUp.x = scrollX + 800;
                pipeUp.body.updateFromGameObject();
            }
        })

        //Junping
        if (this.cursors.space.isDown) {
            this.player.setVelocityY(-100);
            this.player.setTexture('planeRed2');

            this.points++;
            this.pointsText.text = 'Pontuação: ' + this.points;
        } else {
            this.player.setTexture('planeRed3')
        }

        //Game Over
        let buttonPipe = this.findButtonPipe();
        if (this.player.y > buttonPipe.y + 200) {
            this.scene.start('game-over');
        }
    }

    findButtonPipe() {
        let pipes = this.pipes.getChildren();
        this.buttonPipe = pipes[0];

        for (let i = 1; i < pipes.length; i++) {
            let pipe = pipes[1];
            
            if (pipe.y < this.buttonPipe.y) {
                continue;
            }
            this.buttonPipe = pipe;
        } 

        return this.buttonPipe;
    }
}
