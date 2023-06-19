import { Scene } from "phaser";
import { CONFIG } from "../config";
import Player from "../entities/Player";
import Touch from "../entities/Touch";
import Hud from "../entities/Hud";

export default class Lab extends Scene {

    /**@type {Phaser.Tilemaps.Tilemap} */
    map;

    //Variavel de camadas
    layers = {};

    /**@type {Player} */
    player;
    touch;

    /** @type {Phaser.Physics.Arcade.Group} */
    groupObjects;

    isTouching = false;

    constructor() {
        super('Lab'); //Salvando o nome da cena
    }

    preload() {
        //Importando o JSON
        this.load.tilemapTiledJSON('tilemap-lab-info', 'mapas/lab_info1.json');

        //Carregando os tiles do map
        this.load.image('tiles-office', 'mapas/tiles/tiles_office.png');
        this.load.image('tiles-walls', 'mapas/tiles/tiles_walls.png');
        this.load.image('tiles-floors', 'mapas/tiles/tiles_floors.png');
        this.load.image('tiles-store', 'mapas/tiles/tiles_store.png');

        //Importando um spriteseet
        this.load.spritesheet('player', 'mapas/tiles/altair.png', {
            frameWidth: CONFIG.TILE_SIZE,
            frameHeight: CONFIG.TILE_SIZE * 2
        })

        //Carregando o balão do quadro
        this.load.atlas('hud', 'mapas/hud.png', 'mapas/hud.json');

    }

    create() {
        this.cursors = this.input.keyboard.createCursorKeys();

        this.createMap();
        this.createLayer();
        this.createObjects();
        this.createPlayer();
        this.createColider();
        this.createCamera();
        this.hud = new Hud(this, 0, 0);

    }

    update() {

    }

    createMap() {
        this.map = this.make.tilemap({
            key: 'tilemap-lab-info', //Dados JASON
            tileWidth: CONFIG.TILE_SIZE,
            tileHeight: CONFIG.TILE_SIZE,
        })

        console.log(this.map.getTileLayerNames())

        //Fazendo a correspondecia entre as imagens usadas no Tiled
        //E as carregadas pelo Phaser
        // addTilesetImage(Nome da imagem no tile, nome da imagem carregada no phaser)
        this.map.addTilesetImage('tiles_office', 'tiles-office');
        this.map.addTilesetImage('tiles_walls', 'tiles-walls');
        this.map.addTilesetImage('tiles_floors', 'tiles-floors');
        this.map.addTilesetImage('tiles_store', 'tiles-store');
    }

    createLayer() {
        //Funcao para criar layers altomático 
        const tiles_office = this.map.getTileset('tiles_office');
        const tiles_walls = this.map.getTileset('tiles_walls');
        const tiles_floors = this.map.getTileset('tiles_floors');
        const tiles_store = this.map.getTileset('tiles_store');

        const layerNames = this.map.getTileLayerNames();
        for (let i = 0; i < layerNames.length; i++) {
            const name = layerNames[i];

            this.layers[name] = this.map.createLayer(name, [tiles_office, tiles_store, tiles_walls, tiles_floors], 0, 0)

            //Definindo a propriedade para camada
            this.layers[name].setDepth(i);

            //Veiricando se a camada possui colisão
            if (name.endsWith('Colision')) {
                this.layers[name].setCollisionByProperty({ colider: true })

                /*                 if (CONFIG.DEBUG_COLLISION) {
                                    const debugGraphics = this.add.graphics().setAlpha(0.75).setDepth(i);
                                    this.layers[name].renderDebug(debugGraphics, {
                                        tileColor: null, // Color of non-colliding tiles
                                        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
                                        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
                                    });
                                } */
            }
        }

    }

    createLayersManual() {
        //Pegando os tilessets
        const tiles_office = this.map.getTileset('tiles_office');
        const tiles_walls = this.map.getTileset('tiles_walls');
        const tiles_floors = this.map.getTileset('tiles_floors');
        const tiles_store = this.map.getTileset('tiles_store');

        //Inserindo os layers manualmente
        this.map.createLayer('Abaixo1', [tiles_floors], 0, 0)
        this.map.createLayer('Meio1', [tiles_walls], 0, 0)
        this.map.createLayer('Meio2', [tiles_office], 0, 0)
        this.map.createLayer('Acima1', [tiles_office], 0, 0)
        this.map.createLayer('Acima2', [tiles_office], 0, 0)
        this.map.createLayer('Acima3', [tiles_office, tiles_store], 0, 0)
        this.map.createLayer('Objetos', [tiles_office, tiles_store], 0, 0)

    }

    createCamera() {
        const mapWidth = this.map.width * CONFIG.TILE_SIZE;
        const mapHeight = this.map.height * CONFIG.TILE_SIZE;

        this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
        this.cameras.main.startFollow(this.player);
    }

    createColider() {
        /*  const tiles_office = this.map.getTileset('tiles_office');
            const tiles_walls = this.map.getTileset('tiles_walls');
            const tiles_floors = this.map.getTileset('tiles_floors');
            const tiles_store = this.map.getTileset('tiles_store');
         */
        const layerNames = this.map.getTileLayerNames();
        for (let i = 0; i < layerNames.length; i++) {
            const name = layerNames[i];

            if (name.endsWith('Colision')) {
                this.physics.add.collider(this.player, this.layers[name]);
            }
        }

        //Criar colisão entre a "Maozinha" do Player e os objetos da camada de objetos da camada de Objetos
        // Chama a função this.handleTouch toda vez que o this.touch entrar em contato com um objeto do this.groupObjects
        this.physics.add.overlap(this.touch, this.groupObjects, this.handleTouch, undefined, this);

    }

    createPlayer() {
        this.touch = new Touch(this, 16 * 8, 16 * 5);

        this.player = new Player(this, 16 * 8, 16 * 5, this.touch);
        this.player.setDepth(2);
    }

    createObjects() {
        // Criar um grupo para os objetos
        this.groupObjects = this.physics.add.group();

        const objects = this.map.createFromObjects("Cadeira", "Quadro", "PFood", "PTell", {
            name: "Cadeira", name: "Quadro", name: "PFood", name: "PTell",

        });


        // Tornando todos os objetos, Sprites com Physics (que possuem body)
        this.physics.world.enable(objects);

        for (let i = 0; i < objects.length; i++) {
            //Pegando o objeto atual
            const obj = objects[i];
            //Pegando as informações do Objeto definidas no Tiled
            const prop = this.map.objects[0].objects[i];


            obj.setDepth(this.layers.length + 1);
            obj.setVisible(false);
            obj.prop = this.map.objects[0].objects[i].properties;

            console.log(obj.x, obj.y);

            this.groupObjects.add(obj);
        }
    }

    handleTouch(touch, object) {
        if (this.isTouching && this.player.isAction) {

            return;
        }

        if (this.isTouching && !this.player.isAction) {
            this.isTouching = false;
            return;
        }

        //Ação para Cadeira
        if (this.player.isAction) {
            this.isTouching = true;
            console.log(this.player)
            if (object.name == "Cadeira") {
                if (this.player.body.enable == true) {
                    this.player.body.enable = false;
                    this.player.x = object.x - 8;
                    this.player.y = object.y - 8;
                    this.player.direction = 'up';
                    object.setDepth(4);

                } else {
                    this.player.body.enable = true;
                    this.player.x = object.x + 8;
                    this.player.y = object.y + 8;
                    this.player.direction = 'up';
                    object.setDepth(0);
                }
            }

        }

        //Ação para o quadro
        if (this.player.isAction) {
            if (object.name == "Quadro") {
                const { space } = this.cursors;

                if (space.isDown && !this.spaceDown) {
                    this.spaceDown = true;
                    this.hud.showDialog('Aviso: Nunca faltem uma aula do Daniel mesmo doente. Isto pode ocasionar desespero e \n Dívidas na matéria');
                    setTimeout(() => {
                        this.hud.destroy();
                    }, 10000);
                }
            }
        }

        //Placa de comida
        if (this.player.isAction) {
            if (object.name == "PFood") {
                const { space } = this.cursors;
                if (space.isDown && !this.spaceDown) {
                    this.hud.showDialog('Proibido consumir alimentos. Refeitório é la embaixo');
                    setTimeout(() => {
                        this.hud.destroy();
                    }, 10000);
                }
            }
        }

        //Placa de celular
        if (this.player.isAction) {
            if (object.name == "PTell") {
                const { space } = this.cursors;

                if (space.isDown && !this.spaceDown) {
                    this.spaceDown = true;
                    this.hud.showDialog('Proibido zap zap galerinha!');
                    setTimeout(() => {
                        this.hud.destroy();
                    }, 10000);
                }
            }
        }
    }
}