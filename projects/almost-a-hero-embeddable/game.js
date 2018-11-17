const app = new PIXI.Application({
 width: 480,
 height: 800
});
//Aliases
let Application = PIXI.Application,
   Container = PIXI.Container,
   ParticleContainer = PIXI.particles.ParticleContainer,
   loader = PIXI.loader,
   resources = PIXI.loader.resources,
   TextureCache = PIXI.utils.TextureCache,
   Sprite = PIXI.Sprite,
   Rectangle = PIXI.Rectangle,
   Text = PIXI.Text,
   TextStyle = PIXI.TextStyle,
   AnimatedSprite = PIXI.extras.AnimatedSprite;
const GAME_WIDTH = 480,
   GAME_HEIGHT = 800,
   GAME_RATIO = 1.666;

// PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

var GuiConstants = {
	SPACING: 5,
}
var CharacterType = {
	HILT: 0,
	IDA: 1,
	SAM: 2,
	DERECK: 3
}

// Variables
var tink = new Tink(PIXI, app.renderer.view);
var graphics = new PIXI.Graphics();
var entities = new Container();
var enemy1Container = new Container();
var enemy2Container = new Container();
var enemy3Container = new Container();
var enemy4Container = new Container();
var eContainer1 = new Container();
var eContainer2 = new Container();
var eContainer3 = new Container();
var bossContainer = new Container();
var gui = new Container();
var endCardContainer = new Container();
var updatable = [];
var endCardUpdatable = [];
var resizable = [];
var enemies = [];
var characters = [];
var boss;
var pointer;

var loaderBackground;
var background;
var tutorialText;
var installButton;
var maximumAttackCooldown = 250;
var attackCooldown = maximumAttackCooldown;
var characterBar;
var currentCharacter = 0;
var currentAttackingCharacter = 0;
var maximumCharacterAttackCooldown = 100;
var characterAttackCooldown = maximumCharacterAttackCooldown;
var allFinished = false;
var bossAdded = false;


// Creates canvas element, pushes to DOM
document.body.appendChild(app.view);
styleRenderer();

loadLoader();

GameState = {
	ADD_LIGHTNING: 	0,
	ADD_CHAR_1: 	1,
	ATTACK: 		2,
	ADD_CHAR_2: 	3,
	ADD_CHAR_3:		4,
	ADD_CHAR_4:		5,
	ATTACK_BOSS: 	6,
	GAME_OVER: 		7
}
var state = GameState.ADD_LIGHTNING;

// Called on load completion
function initLoader() {
	console.log(' - LOADER INITIALIZED - ');

	// Add containers to stage
	entities = new Container();
	gui = new Container();
	app.stage.addChild(gui);

	// Create loading bg
	loaderBackground = new Sprite(resources[Images.LOADING_BG].texture);
	resizeSpriteByWidth(loaderBackground, app.renderer.width);

	gui.addChild(loaderBackground);

	// Load gameplay
	loadGameplay();
}

function initGameplay() {
	// Remove previous items
	gui.removeChild(loaderBackground)
	app.stage.removeChild(gui);

	// Add background
	createBackground();
	createTutorialText();
	createCharacterBar();
	createInstallButton();
	createTutorialFinger();

	addEnemy(1); addEnemy(2); addEnemy(3);

	app.stage.addChild(entities);
	app.stage.addChild(enemy1Container);
	app.stage.addChild(enemy2Container);
	app.stage.addChild(enemy3Container);
	app.stage.addChild(enemy4Container);
	app.stage.addChild(eContainer1);
	app.stage.addChild(eContainer2);
	app.stage.addChild(bossContainer);
	app.stage.addChild(eContainer3);
	app.stage.addChild(gui);


	// Create Tink pointer
	pointer = tink.makePointer();

	// Initial resize
	resize();

	gameLoop();
}

function initEndCard() {
	state = GameState.GAME_OVER;
	graphics.alpha = 0;
	graphics.update = function() {
		if (this.alpha < 0.75) {
			this.alpha += 0.05;
		} else {
			endCardUpdatable.splice(endCardUpdatable.indexOf(this), 1);
		}
	}
	endCardContainer.addChild(graphics);
	addEndCardLogo();
	createEndMenu();
	createEndMenuChest();
	endCardContainer.addChild(installButton);
	endCardUpdatable.push(installButton);
	endCardUpdatable.push(graphics);
	app.stage.addChild(endCardContainer);
	console.log("End card initiated");
}

function gameLoop() {
	delta = app.ticker.deltaTime;

	// Normalize screen shake
	entities.x += (0 - entities.x) / 5;
	entities.y += (0 - entities.y) / 5;
	enemy1Container.x += (0 - enemy1Container.x) / 5;
	enemy1Container.y += (0 - enemy1Container.y) / 5;
	enemy2Container.x += (0 - enemy2Container.x) / 5;
	enemy2Container.y += (0 - enemy2Container.y) / 5;
	enemy3Container.x += (0 - enemy3Container.x) / 5;
	enemy3Container.y += (0 - enemy3Container.y) / 5;
	enemy4Container.x += (0 - enemy4Container.x) / 5;
	enemy4Container.y += (0 - enemy4Container.y) / 5;
	bossContainer.x += (0 - bossContainer.x) / 5;
	bossContainer.y += (0 - bossContainer.y) / 5;
	eContainer1.x += (0 - eContainer1.x) / 5;
	eContainer1.y += (0 - eContainer1.y) / 5;
	eContainer2.x += (0 - eContainer2.x) / 5;
	eContainer2.y += (0 - eContainer2.y) / 5;
	eContainer3.x += (0 - eContainer3.x) / 5;
	eContainer3.y += (0 - eContainer3.y) / 5;

	if (state == GameState.GAME_OVER) {
		graphics.clear();
		graphics.beginFill(0x000000);
		// Darkener
		graphics.drawRect(0, 0, app.renderer.width, app.renderer.height);
		graphics.endFill();

		// Update end card updatables
		for (e in endCardUpdatable) {
			endCardUpdatable[e].update();
		}

		// Fade out old GUI
		if (gui.alpha > 0) {
			gui.alpha -= 0.1;
		}

		// Call next animation frame
		requestAnimationFrame(gameLoop);

		return;
	}

	for (e in updatable) {
		updatable[e].update();
	}

	// Checking if all enemies removed, adding boss if so
	allFinished = true;
	for (i = 0; i < enemies.length; i++) {
		let e = enemies[i];
		if (!e.finalDeath) {
			allFinished = false;
		}
	}
	if (allFinished && !bossAdded) {
		addBoss();
		addScreenFlash();
		createBossNotification();
		bossAdded = true;
	}

	// Update tink
	tink.update();
	// Add Tink listeners
	pointer.tap = tap;

	if (state == GameState.ATTACK) {
		if (currentCharacter != 3) {
			attackCooldown--;
			if (attackCooldown <= 0) {
				state++;
				attackCooldown = maximumAttackCooldown;
				currentCharacter++;
				characterBar.boxes[currentCharacter].hidden = false;
				switch (currentCharacter) {
					case 1:
						state = GameState.ADD_CHAR_2;
					break;
					case 2:
						state = GameState.ADD_CHAR_3;
					break;
					case 3:
						state = GameState.ADD_CHAR_4;
					break;
				}
			}
		}
	}

	// Call next animation frame
	requestAnimationFrame(gameLoop);
}

function resizeSpriteByWidth(sprite, width) {
	let newScale = width / sprite.width;
	sprite.width = width;
	sprite.height = sprite.height * newScale;
}
function resizeSpriteByHeight(sprite, height) {
	let newScale = height / sprite.height;
	sprite.height = height;
	sprite.width = sprite.width * newScale;
}

// Resize method
resize();
// styleRenderer();
function resize() {
    // Calculate new dimensions
    var height = window.innerHeight - (window.innerHeight * .1);
    var width = height / GAME_RATIO;

    // Apply new dimensions
    app.renderer.resize(width, height);

	// Resize all resizable
	for (e in resizable) {
		resizable[e].resize();
	}
	styleRenderer();
}
// Resize listener
window.onresize = resize;

function tap() {

	// Check if in attack area
	if (pointer.y > app.renderer.height * 0.15
	&& pointer.y < app.renderer.height * 0.7) {

		switch (state) {
			case GameState.ADD_LIGHTNING:
				tutorialFinger.fadeOut();
				// Add lightning attack to enemies
				for (i = 0; i < enemies.length; i++) {
					let e = enemies[i];
					addLightning(e.mainSprite.x, e.mainSprite.y);
					e.hit(40);
				}
				// Enter next state
				state = GameState.ADD_CHAR_1;
				characterBar.boxes[0].hidden = false;
				tutorialFinger.fadeIn();
			break;
			case GameState.ADD_CHAR_1:
			break;
			case GameState.ATTACK:
				attackEnemy();
				// Add fireball attack to enemies
				let chosenEnemy = getRandomInt(3);
				// for (i = 0; i < enemies.length; i++) {
				// 	let e = enemies[i];
				// 	createFireBall(e.mainSprite.x, e.mainSprite.y);
				// 	e.hit(20);
				// }

				// let e = enemies[chosenEnemy];
				// createFireBall(e.mainSprite.x, e.mainSprite.y);
				// e.hit(20);
			break;
			case GameState.ADD_CHAR_2:
			break;
			case GameState.ATTACK_BOSS:
			break;
			case GameState.GAME_OVER:
			break;
		}
	}
}

function attackEnemy() {
	// Attacking
	if (characters.length > 0) {
		if (currentAttackingCharacter > characters.length - 1) {
			currentAttackingCharacter = 0;
		}

		if (characters[currentAttackingCharacter].state !=
			characters[currentAttackingCharacter].CharState.ATTACKING) {
			characters[currentAttackingCharacter].enterAttackState();
		}
		currentAttackingCharacter++;
		// } else {
		// 	characterAttackCooldown--;
		// }
	}
}

function shakeScreen(xAmt, yAmt) {
	let negative = Math.random() > 0.5 ? true : false;
	entities.x += negative ? -xAmt : xAmt;
	entities.y += negative ? -yAmt : yAmt;
	eContainer1.x += negative ? -xAmt : xAmt;
	eContainer1.y += negative ? -yAmt : yAmt;
	eContainer2.x += negative ? -xAmt : xAmt;
	eContainer2.y += negative ? -yAmt : yAmt;
	eContainer3.x += negative ? -xAmt : xAmt;
	eContainer3.y += negative ? -yAmt : yAmt;
	bossContainer.x += negative ? -xAmt : xAmt;
	bossContainer.y += negative ? -yAmt : yAmt;
	enemy1Container.x += negative ? -xAmt : xAmt;
	enemy1Container.y += negative ? -yAmt : yAmt;
	enemy2Container.x += negative ? -xAmt : xAmt;
	enemy2Container.y += negative ? -yAmt : yAmt;
	enemy3Container.x += negative ? -xAmt : xAmt;
	enemy3Container.y += negative ? -yAmt : yAmt;
	enemy4Container.x += negative ? -xAmt : xAmt;
	enemy4Container.y += negative ? -yAmt : yAmt;
}

// Style/position app
function styleRenderer() {
	app.renderer.view.style.position = 'absolute';
	app.renderer.view.style.left = (window.innerWidth / 2) - (app.renderer.width / 2) + "px";
	app.renderer.view.style.border = "3px solid white";
	app.renderer.view.style.borderRadius = "5px";
	app.renderer.view.style.marginBottom = "5%";
	app.renderer.view.style.boxShadow = "0px 20px 30px black";
	app.renderer.roundPixels = true;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
