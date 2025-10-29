class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  init() {
    this.scene.launch('Ui');
    this.score = 0;
  }

  create() {
    this.createMap();
    this.createAudio();
    this.createChests();
    this.createInput();

    this.createGameManager();
  }

  update() {
    this.player.update(this.cursors);
  }

  createAudio() {
    this.goldPickupAudio = this.sound.add('goldSound', { loop: false, volume: 0.2 });
  }

  createPlayer(location) {
    this.player = new Player(this, location[0] * 2, location[1] * 2, 'characters', 0);
  }

  createGameManager() {
    this.events.on('spawnPlayer', (location) => {
      this.createPlayer(location);
      this.addCollisions();
    });
    this.events.on('chestSpawned', (chest) => {
      this.spawnChest(chest);
    });
    // listen to the event to spawn a monster
    this.events.on('monsterSpawned', (monster) => {
      this.spawnMonster(monster);
    });
    this.gameManager = new GameManager(this, this.map.map.objects);
    this.gameManager.setup();
  }

  createChests() {
    // create a chest group
    this.chests = this.physics.add.group();
    // create chest positions array
    this.chestPositions = [[100, 100], [200, 200], [300, 300], [400, 400], [500, 500]];
    // specify the max number of chest we can have
    this.maxNumberOfChests = 3;
    // spawn a chest
    for (let i = 0; i < this.maxNumberOfChests; i += 1) {
      this.spawnChest();
    }
  }

  spawnChest(chestObject) {
    let chest = this.chests.getFirstDead();
    if (!chest) {
      chest = new Chest(this, chestObject.x * 2, chestObject.y * 2, 'items', 0);
      // add chest to chests group
      this.chests.add(chest);
    } else {
      chest.coins = chestObject.gold; // pass the amount of gold
      chest.id = chestObject.id; // pass the chest id
      chest.setPosition(chestObject.x * 2, chestObject.y * 2);
      chest.makeActive();
    }
  }

  spawnChest(monster) {
    console.log(monster);
  }

  createInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  addCollisions() {
    // check for collisions between player and blocked layer
    this.physics.add.collider(this.player, this.map.blockedLayer);
    // check for overlaps between player and chest game objects
    this.physics.add.overlap(this.player, this.chests, this.collectChest, null, this);
  }

  collectChest(player, chest) {
    // play gold pickup sound
    this.goldPickupAudio.play();
    // update our score
    this.score += chest.coins;
    // update score in the ui
    this.events.emit('updateScore', this.score);
    // make chest game object inactive
    chest.makeInactive();
    this.events.emit('pickUpChest', chest.id);
    // spawn a new chest
    this.time.delayedCall(1000, this.spawnChest, [], this);
  }

  createMap() {
    // create map
    this.map = new Map(this, 'map', 'background', 'background', 'blocked');
  }
}
