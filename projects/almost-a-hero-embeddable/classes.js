function addScreenFlash() {

	let graphics = new PIXI.Graphics();

	graphics.beginFill(0xFFFFFF);
	graphics.drawRect(0, 0, app.renderer.width, app.renderer.height); // drawRect(x, y,
	graphics.endFill();

	graphics.alpha = 0.5;

	graphics.update = function() {
		this.alpha -= 0.1;

		if (this.alpha <= 0) {
			// updatable.splice($.inArray(this, updatable), 1);
			updatable.splice(updatable.indexOf(this), 1);
			this.destroy();
		}
	}

	updatable.push(graphics);
	app.stage.addChild(graphics);
}

function createBackground() {
	background = new Sprite(resources[Images.BG].texture);

	// Types
	resizable.push(background);
	entities.addChild(background);

	// Functions
	background.resize = function() {
		resizeSpriteByHeight(background, app.renderer.height);
	};
}

function createTutorialText() {
	tutorialText = new Sprite(resources[Images.TUTORIAL_CONTAINER_LIGHTNING].texture);

	// Variables
	tutorialText.y = -tutorialText.height;
	tutorialText.targetY = 10;
	tutorialText.currentState = GameState.ADD_LIGHTNING;

	// Types
	updatable.push(tutorialText);
	resizable.push(tutorialText);
	gui.addChild(tutorialText);

	// Functions
	tutorialText.resize = function() {
		resizeSpriteByWidth(this, app.renderer.width * 0.8);
		this.x = (app.renderer.width / 2) - (this.width / 2);
		this.y = -tutorialText.height * 2;
	}
	tutorialText.update = function() {
		this.y += (this.targetY - this.y) / 10;

		if (this.currentState != state && state != GameState.GAME_OVER) {
			this.currentState = state;
			this.swapImage();
		}
	}
	tutorialText.swapImage = function() {
		let s;
		switch (this.currentState) {
			case GameState.ADD_CHAR_1:
			case GameState.ADD_CHAR_2:
			case GameState.ADD_CHAR_3:
			case GameState.ADD_CHAR_4:
				s = new Sprite(resources[Images.TUTORIAL_CONTAINER_UNLOCK].texture);
			break;
			case GameState.ATTACK:
			case GameState.ATTACK_BOSS:
				s = new Sprite(resources[Images.TUTORIAL_CONTAINER_ATTACK].texture);
			break;
		}

		s.x = this.x;
		s.y = this.y;
		s.width = this.width;
		s.height = this.height;
		s.update = this.update;
		s.resize = this.resize;
		s.swapImage = this.swapImage;
		s.targetY = this.targetY;
		s.currentState = this.currentState;

		gui.removeChild(tutorialText);
		updatable.splice(updatable.indexOf(tutorialText), 1);
		tutorialText = s;
		gui.addChild(tutorialText);
		updatable.push(tutorialText);
		tutorialText.resize();

	}

}

function createBossNotification() {
	let sprite = new Sprite(resources[Images.BOSS_NOTIFICATION].texture);

	// Dimensions
	let nw = app.renderer.width * 0.4;
	let ns = nw / sprite.width;
	sprite.width = nw;
	sprite.height = sprite.height * ns;

	// Position
	sprite.x = (app.renderer.width / 2) - (sprite.width / 2);
	sprite.y = (app.renderer.height / 2) - (sprite.height / 2);

	sprite.remove = function() {
		updatable.splice(updatable.indexOf(this), 1);
		gui.removeChild(this);
	}

	sprite.update = function() {
		this.alpha -= 0.01;
		this.y -= 0.1;

		if (this.alpha <= 0) {
			this.remove();
		}
	}

	updatable.push(sprite);
	gui.addChild(sprite);
}

function createTutorialFinger() {
	tutorialFinger = new Sprite(resources[Images.TUTORIAL_FINGER].texture);

	// Variables
	tutorialFinger.x = 0 - this.width;
	tutorialFinger.y = app.renderer.height;
	tutorialFinger.bounceState = 0;
	tutorialFinger.bounceAmount = 30;
	tutorialFinger.maximumBounceCooldown = 30;
	tutorialFinger.bounceCooldown = tutorialFinger.maximumBounceCooldown;
	tutorialFinger.targetAlpha = 1;
	tutorialFinger.alpha = 0;
	tutorialFinger.targetRotation = 0;
	tutorialFinger.anchor.set(0.3, 0.2);

	// Types
	gui.addChild(tutorialFinger);
	updatable.push(tutorialFinger);
	resizable.push(tutorialFinger);

	// Functions
	tutorialFinger.update = function() {
		// Fade to target opacity
		this.alpha += (this.targetAlpha - this.alpha) / 15;

		// Define target position
		switch (state) {
			case GameState.ATTACK_BOSS:
			case GameState.ATTACK:	// Fall through intended
			case GameState.ADD_LIGHTNING:
				this.targetX = (app.renderer.width / 2) - (this.width * this.anchor.x);
				this.targetY = (app.renderer.height / 1.8) - (this.height / 2);
				this.targetRotation = 0;
			break;
			case GameState.ADD_CHAR_1:
				this.targetX = characterBar.boxes[0].x + (characterBar.boxes[0].width / 2);
				this.targetY = characterBar.boxes[0].y;
				this.targetRotation = 2.5;
			break;
			case GameState.ADD_CHAR_2:
				this.targetX = characterBar.boxes[1].x + (characterBar.boxes[1].width / 2);
				this.targetY = characterBar.boxes[1].y;
				this.targetRotation = 2.5;
			break;
			case GameState.ADD_CHAR_3:
				this.targetX = characterBar.boxes[2].x + (characterBar.boxes[2].width / 2);
				this.targetY = characterBar.boxes[2].y;
				this.targetRotation = 2.5;
			break;
			case GameState.ADD_CHAR_4:
				this.targetX = characterBar.boxes[3].x + (characterBar.boxes[3].width / 2);
				this.targetY = characterBar.boxes[3].y;
				this.targetRotation = 2.5;
			break;
			case GameState.GAME_OVER:
			break;
		}

		// Bounce frequency
		this.bounceCooldown--;
		if (this.bounceCooldown <= 0) {
			switch (this.bounceState) {
				case 0:
					this.bounceState = 1;
				break;
				case 1:
					this.bounceState = 0;
				break;
			}
			this.bounceCooldown = this.maximumBounceCooldown;
		}
		// Move towards target position w/ Bounce
		var easeAmt = 5;
		if (this.bounceState === 0) {
			this.x += (this.targetX - this.x) / easeAmt;
			this.y += ((this.targetY + this.bounceAmount) - this.y) / easeAmt;
		} else if (this.bounceState === 1) {
			this.x += (this.targetX - this.x) / easeAmt;
			this.y += (this.targetY - this.y) / easeAmt;
		}
		// Move towards target rotation
		this.rotation += (this.targetRotation - this.rotation) / 10;
	}

	tutorialFinger.resize = function() {
		resizeSpriteByWidth(this, app.renderer.width * 0.2);
		this.x = 0 - this.width;
		this.y = app.renderer.height;
	}

	tutorialFinger.fadeIn = function() {
		this.targetAlpha = 0.5;
	}
	tutorialFinger.fadeOut = function() {
		this.targetAlpha = 0;
	}

	tutorialFinger.fadeIn();
}

function createInstallButton() {
	installButton = new Sprite(resources[Images.INSTALL_BUTTON].texture);

	// Variables
	installButton.squeezeState = 0;
	installButton.maximumSqueezeCooldown = 15;
	installButton.squeezeCooldown = installButton.maximumSqueezeCooldown;
	installButton.squeezeAmount = 15;
	installButton.fullWidth = app.renderer.width * 0.45;
	installButton.targetWidth = installButton.fullWidth;

	// Types
	gui.addChild(installButton);
	updatable.push(installButton);
	resizable.push(installButton);

	installButton.update = function() {
		// Sizing with end card
		if (state == GameState.GAME_OVER) {
			if (this.fullWidth != app.renderer.width * 0.65) {
				this.resize();
			}
			let ty = app.renderer.height - (app.renderer.height / 3);
			this.y += (ty - this.y) / 5;
		}
		// Squeeze animation
		this.squeezeCooldown--;
		if (this.squeezeCooldown <= 0) {
			this.squeezeCooldown = this.maximumSqueezeCooldown;
			if (this.squeezeState == 0) {
				this.squeezeState = 1;
				this.targetWidth = this.fullWidth - this.squeezeAmount;
			} else if (this.squeezeState == 1) {
				this.squeezeState = 0;
				this.targetWidth = this.fullWidth + this.squeezeAmount;
			}
		}
		// Ease to squeezed size
		this.width += (this.targetWidth - this.width) / 3.5;
		// Center
		this.x = (app.renderer.width / 2) - (this.width / 2);

		if (pointer.hitTestSprite(this)) {
			pointer.cursor = "pointer";
			this.tint = 0x999999;
			if (pointer.isDown) {
				this.tint = 0x777777;
			}
		}
		else {
			pointer.cursor = "auto";
			this.tint = 0xFFFFFF;
		}
	}

	installButton.resize = function() {
		if (state == GameState.GAME_OVER) {
			this.fullWidth = app.renderer.width * 0.65;
		} else {
			this.fullWidth = app.renderer.width * 0.45;
		}
		resizeSpriteByWidth(this, this.fullWidth);
		this.x = (app.renderer.width / 2) - (this.width / 2);
		this.y = app.renderer.height - this.height - GuiConstants.SPACING;
	}
}

function createCharacterBar() {
	var box1 = new Sprite(resources[Images.CHAR_ICON_1].texture);
	var box2 = new Sprite(resources[Images.CHAR_ICON_2].texture);
	var box3 = new Sprite(resources[Images.CHAR_ICON_3].texture);
	var box4 = new Sprite(resources[Images.CHAR_ICON_4].texture);
	box1.hidden = true; box2.hidden = true; box3.hidden = true; box4.hidden = true;
	box1.clicked = false; box2.clicked = false; box3.clicked = false; box4.clicked = false;

	characterBar = {
		boxes: [ box1, box2, box3, box4 ]
	}

	for (b in characterBar.boxes) {
		b.unlocked = false;
	}

	characterBar.update = function() {
		for (i = 0; i < this.boxes.length; i++) {
			var b = this.boxes[i];

			if (pointer.hitTestSprite(b) && !b.clicked) {
				b.tint = 0x999999;
				if (pointer.isDown && !b.hidden && !b.clicked) {
					b.tint = 0x777777;
					b.unlocked = true;
					b.clicked = true;
					addCharacter(this.boxes.indexOf(b));
					state = GameState.ATTACK;
				}
			}
			else {
				pointer.cursor = "auto";
				// Locking
				if (b.hidden) {
					b.tint = 0x000000;
					b.alpha = 0.5;
				} else if (b.unlocked) {
					b.tint = 0xFFFFFF;
					b.alpha += (1 - b.alpha) / 5;
				} else {
					b.unlocked = true;
					b.tint = 0x888888;
					b.alpha += (1 - b.alpha) / 5;
				}
			}
		}
	}

	// Types
	updatable.push(characterBar);

	// Resize all
	for (var i = 0; i < characterBar.boxes.length; i++) {
		// Resize
		resizeSpriteByWidth(characterBar.boxes[i], app.renderer.width * 0.2);
	}

	// Position all
	var fullWidth = (box1.width * 4) + (GuiConstants.SPACING * 3);
	var centerX = (app.renderer.width / 2) - (fullWidth / 2);

	for (var i = 0; i < characterBar.boxes.length; i++) {
		// Position
		characterBar.boxes[i].x = centerX + (box1.width * i) + (GuiConstants.SPACING * (i));
		characterBar.boxes[i].y = app.renderer.height - characterBar.boxes[i].height
		 - (app.renderer.height * 0.12);
	}

	// Add all to GUI container
	gui.addChild(box1);
	gui.addChild(box2);
	gui.addChild(box3);
	gui.addChild(box4);
}

function addEnemy(slot) {
	let enemy = {};

	// Variables
	enemy.health = 100;
	enemy.healthWidth = 20;
	enemy.graphics = new PIXI.Graphics();
	enemy.finalDeath = false;

	// Types
	enemies[slot-1] = enemy;
	updatable.push(enemy);


	enemy.addSpriteToContainer = function() {
		switch (slot) {
			case 1:
				eContainer1.addChild(enemy.mainSprite);
			break;
			case 2:
				eContainer2.addChild(enemy.mainSprite);
			break;
			case 3:
				eContainer3.addChild(enemy.mainSprite);
			break;
		}
	}

	enemy.buildAnimations = function() {
		// Create idle animation
		let idleImages = [ Images.ENEMY_IDLE_0, Images.ENEMY_IDLE_1, Images.ENEMY_IDLE_2 ];
		let textureArray = [];
		for (let i = 0; i < idleImages.length; i++)
		{
		     let texture = PIXI.Texture.fromImage(idleImages[i]);
		     textureArray.push(texture);
		};
		this.idleSprite = new AnimatedSprite(textureArray);
		this.idleSprite.animationSpeed = 0.05;

		// Assign current sprite
		this.mainSprite = this.idleSprite;
		this.mainSprite.play();

		this.resize();
	}

	enemy.update = function() {
		this.graphics.clear();
		this.graphics.beginFill(0x000000);

		let healthX = 0 - (this.mainSprite.width) + (this.healthWidth / 2);
		let healthY = 0 - (this.healthHeight * 4);
		// Background
		this.graphics.drawRect(healthX, healthY, this.healthWidth, this.healthHeight);
		this.graphics.endFill();
		// Foreground
		this.graphics.beginFill(0xf44248);
		this.graphics.drawRect(healthX + 2, healthY + 2, (this.healthWidth - 4) * (this.health / 100), this.healthHeight - 4);

		// Death
		if (this.dead) {
			this.mainSprite.alpha -= 0.01;

			if (this.mainSprite.alpha <= 0) {
				entities.removeChild(this);
				this.dead = false;
				if (!this.finalDeath) {
					enemies[slot - 1] = undefined;
					addEnemy(slot);
				}
			}
		}
	}

	enemy.resize = function() {
		resizeSpriteByHeight(this.mainSprite, app.renderer.height * 0.17);

		this.healthWidth = app.renderer.width * 0.2;
		this.healthHeight = this.healthWidth / 8;
	}

	enemy.findPosition = function() {
		let SPACING = 10;
		let s = this.mainSprite;
		let x = 0;
		let y = 0;
		s.anchor.set(0.5);
		switch (slot) {
			case 1:
				x = app.renderer.width - (s.width / 2) - SPACING;
				y = app.renderer.height * 0.4;
			break;
			case 2:
				x = app.renderer.width - (s.width / 2) - (SPACING * 4);
				y = app.renderer.height * 0.5;
			break;
			case 3:
				x = app.renderer.width - (s.width / 2) - SPACING;
				y = app.renderer.height * 0.6;
			break;
		}

		s.x = x;
		s.y = y;
	}

	enemy.hit = function(damage) {
		this.health -= damage;
		if (this.health <= 0) {
			this.die();
		}
		// Health limiting
		if (this.health <= 0) {
			this.health = 0;
		}
	}

	enemy.die = function() {
		this.dead = true;
		if (characters.length == 4) {
			this.finalDeath = true;
		}
	}

	enemy.buildAnimations();
	enemy.findPosition();
	enemy.mainSprite.addChild(enemy.graphics);

	enemy.addSpriteToContainer();

}

function addLightning(x, y) {
	var lightning = {};

	let animImages = [ Images.LIGHTNING_0, Images.LIGHTNING_1, Images.LIGHTNING_2, Images.LIGHTNING_3 ];
	let textureArray = [];
	for (let i = 0; i < animImages.length; i++)
	{
		 let texture = PIXI.Texture.fromImage(animImages[i]);
		 textureArray.push(texture);
	};

	// Sprite properties
	let animSprite = new AnimatedSprite(textureArray);
	animSprite.width = app.renderer.width * 0.3;
	animSprite.height = app.renderer.height * 0.55;

	lightning.sprite = animSprite;
	lightning.sprite.anchor.set(0.5, 1.0);

	lightning.sprite.loop = false;
	lightning.sprite.animationSpeed = 0.3;
	lightning.sprite.position.set(x, y);

	addScreenFlash();
	shakeScreen((Math.random() * 20) + 5, (Math.random() * 20) + 5);

	addLightningHit(lightning.sprite.x, lightning.sprite.y);

	lightning.sprite.play();
	lightning.sprite.onComplete = () => {
		lightning.sprite.destroy();
	};

	entities.addChild(lightning.sprite);

}

function addLightningHit(x, y) {
	let animImages = [ Images.LIGHTNING_END_0, Images.LIGHTNING_END_1, Images.LIGHTNING_END_2 ];
	let textureArray = [];
	for (let i = 0; i < animImages.length; i++)
	{
		 let texture = PIXI.Texture.fromImage(animImages[i]);
		 textureArray.push(texture);
	};

	// Sprite properties
	let animSprite = new AnimatedSprite(textureArray);
	animSprite.anchor.set(0.5, 0);
	animSprite.x = x;
	animSprite.y = y;
	animSprite.loop = false;
	animSprite.animationSpeed = 0.4;
	entities.addChild(animSprite);

	animSprite.play();

	animSprite.onComplete = () => {
		animSprite.destroy();
	}
}

function addCharacter(type) {
	addScreenFlash();
	let character = new Character();
	character.idleSprite;
	character.type = type;
	character.CharState = {
		IDLE: 0,
		WALKING: 1,
		ATTACKING: 2
	}
	character.maximumWalkCooldown = 100;
	character.walkCooldown = character.maximumWalkCooldown;
	character.maximumAttackHitCooldown = 35;
	character.attackHitCooldown = character.maximumAttackHitCooldown;
	character.state = character.CharState.IDLE;
	character.homeX;
	character.homeY;
	character.targetX;
	character.targetY;
	character.targetEnemy;

	let idleTextureArray = [];
	let idleImages = [];
	let attackTextureArray = [];
	let attackImages = [];
	let x = 0, y = 0;

	// Character functions
	character.update = function() {
		switch (this.state) {
			case this.CharState.IDLE:
			break;
			case this.CharState.WALKING:
				if (this.walkCooldown > 0) {
					this.walkCooldown--;
				} else {
					this.state = this.CharState.ATTACKING;
					this.enterAttackState();
					this.mainSprite.x = this.targetX;
					this.mainSprite.y = this.targetY;
					this.walkCooldown = this.maximumWalkCooldown;
				}
			break;
			case this.CharState.ATTACKING:
				if (this.attackHitCooldown > 0) {
					this.attackHitCooldown--;
				} else {
					shakeScreen(getRandomInt(20), getRandomInt(20));
					this.targetEnemy.hit(30);
					createFireBall(this.targetEnemy.mainSprite.x, this.targetEnemy.mainSprite.y);
					this.attackHitCooldown = 999999;
				}
			break;
		}

		// Move to target position
		this.mainSprite.x += (this.targetX - this.mainSprite.x) / 20;
		this.mainSprite.y += (this.targetY - this.mainSprite.y) / 20;
	}

	character.enterIdleState = function() {
		this.removeSpriteFromContainer();

		this.mainSprite = this.idleSprite;
		this.mainSprite.play();

		// this.arrangePosition();
		this.targetX = this.homeX;
		this.targetY = this.homeY;

		this.resize();
		this.addSpriteToContainer();
	}

	character.enterAttackState = function() {
		if (allFinished && !bossAdded) {
			return;
		}

		this.removeSpriteFromContainer();
		this.state = this.CharState.ATTACKING;

		// Find enemy
		this.attackHitCooldown = this.maximumAttackHitCooldown;
		let e = this.findEnemy();//enemies[getRandomInt(3)];
		// this.targetX = e.mainSprite.x - (e.mainSprite.width);
		// this.targetY = e.mainSprite.y;
		this.targetEnemy = e;

		// Apply sprite
		this.attackSprite.x = this.mainSprite.x;
		this.attackSprite.y = this.mainSprite.y;
		this.mainSprite = this.attackSprite;
		this.mainSprite.loop = false;
		this.attackSprite.gotoAndPlay(0);
		this.attackFrequency = this.maximumAttackFrequency;

		// Position
		// this.mainSprite.x = this.x;
		// this.mainSprite.y = this.x;

		this.resize();
		this.addSpriteToContainer();

	}

	character.arrangePosition = function() {
		// Position
		let SPACING = 10;
		let s = character.mainSprite;
		switch (type) {
			case CharacterType.HILT:
				x = SPACING * 8;
				y = app.renderer.height * 0.4;
			break;
			case CharacterType.IDA:
				x = SPACING * 20;
				y = app.renderer.height * 0.5;
			break;
			case CharacterType.SAM:
				x = SPACING * 13;
				y = app.renderer.height * 0.6;
			break;
			case CharacterType.DERECK:
				x = SPACING * 10;
				y = app.renderer.height * 0.7;
			break;
		}
		character.mainSprite.position.set(x, y);
		character.homeX = x;	character.homeY = y;
		character.targetX = x;	character.targetY = y;
	}

	character.removeSpriteFromContainer = function() {
		switch (type) {
			case CharacterType.HILT:
				enemy1Container.removeChild(this.mainSprite);
			break;
			case CharacterType.IDA:
				enemy2Container.removeChild(this.mainSprite);
			break;
			case CharacterType.SAM:
				enemy3Container.removeChild(this.mainSprite);
			break;
			case CharacterType.DERECK:
				enemy4Container.removeChild(this.mainSprite);
			break;
		}
	}

	character.addSpriteToContainer = function() {
		if (this.mainSprite == undefined) return;
		this.resize();

		switch (type) {
			case CharacterType.HILT:
				enemy1Container.addChild(this.mainSprite);
			break;
			case CharacterType.IDA:
				enemy2Container.addChild(this.mainSprite);
			break;
			case CharacterType.SAM:
				enemy3Container.addChild(this.mainSprite);
			break;
			case CharacterType.DERECK:
				enemy4Container.addChild(this.mainSprite);
			break;
		}
	}

	character.findEnemy = function() {
		let e;
		if (bossAdded) {
			e = boss;
		} else {
			e = enemies[getRandomInt(3)];

			if (e.finalDeath) {
				e = character.findEnemy();
			}
		}

		return e;
	}

	character.resize = function() {
		if (type == CharacterType.HILT) {
			if (this.state == this.CharState.ATTACKING) {
				resizeSpriteByHeight(this.mainSprite, app.renderer.height * 0.35);
			} else {
				resizeSpriteByHeight(this.mainSprite, app.renderer.height * 0.2);
			}
		} else if (type == CharacterType.SAM) {
			if (this.state == this.CharState.ATTACKING) {
				resizeSpriteByHeight(this.mainSprite, app.renderer.height * 0.5);
			} else {
				resizeSpriteByHeight(this.mainSprite, app.renderer.height * 0.2);
			}
		} else if (type == CharacterType.DERECK) {
			if (this.state == this.CharState.ATTACKING) {
				resizeSpriteByHeight(this.mainSprite, app.renderer.height * 0.3);
			} else {
				resizeSpriteByHeight(this.mainSprite, app.renderer.height * 0.2);
			}
		} else {
			resizeSpriteByHeight(this.mainSprite, app.renderer.height * 0.2);
		}
	}

	// Animation creation
	switch (type) {
		case CharacterType.HILT:
			attackImages = [ Images.HERO_HILT_ATTACK_0, Images.HERO_HILT_ATTACK_1, Images.HERO_HILT_ATTACK_2,
							 Images.HERO_HILT_ATTACK_3, Images.HERO_HILT_ATTACK_4, Images.HERO_HILT_ATTACK_5,
							 Images.HERO_HILT_ATTACK_6 ];
			idleImages = [ Images.HERO_HILT_IDLE_0, Images.HERO_HILT_IDLE_1, Images.HERO_HILT_IDLE_2 ];
		break;
		case CharacterType.IDA:
			attackImages = [ Images.HERO_IDA_ATTACK_0, Images.HERO_IDA_ATTACK_1, Images.HERO_IDA_ATTACK_2,
			 				 Images.HERO_IDA_ATTACK_3, Images.HERO_IDA_ATTACK_4, Images.HERO_IDA_ATTACK_5,
						 	 Images.HERO_IDA_ATTACK_6, Images.HERO_IDA_ATTACK_7, Images.HERO_IDA_ATTACK_8 ];
			idleImages = [ Images.HERO_IDA_IDLE_0, Images.HERO_IDA_IDLE_1, Images.HERO_IDA_IDLE_2 ];
			character.maximumAttackHitCooldown = 65;
		break;
		case CharacterType.SAM:
			attackImages = [ Images.HERO_SAM_ATTACK_0, Images.HERO_SAM_ATTACK_1, Images.HERO_SAM_ATTACK_2,
			 				 Images.HERO_SAM_ATTACK_3, Images.HERO_SAM_ATTACK_4, Images.HERO_SAM_ATTACK_5 ];
			idleImages = [ Images.HERO_SAM_IDLE_0, Images.HERO_SAM_IDLE_1, Images.HERO_SAM_IDLE_2 ];
		break;
		case CharacterType.DERECK:
			attackImages = [ Images.HERO_DERECK_ATTACK_0, Images.HERO_DERECK_ATTACK_1, Images.HERO_DERECK_ATTACK_2,
			 				 Images.HERO_DERECK_ATTACK_3, Images.HERO_DERECK_ATTACK_4, Images.HERO_DERECK_ATTACK_5 ];
			idleImages = [ Images.HERO_DERECK_IDLE_0, Images.HERO_DERECK_IDLE_1, Images.HERO_DERECK_IDLE_2 ];
			character.maximumAttackHitCooldown = 25;
		break;
	}
	for (let i = 0; i < idleImages.length; i++) {
		 let texture = PIXI.Texture.fromImage(idleImages[i]);
		 idleTextureArray.push(texture);
	};
	for (let i = 0; i < attackImages.length; i++) {
		 let texture = PIXI.Texture.fromImage(attackImages[i]);
		 attackTextureArray.push(texture);
	}
	// Set up animations
	character.idleSprite = new AnimatedSprite(idleTextureArray);
	character.idleSprite.animationSpeed = 0.05;
	character.idleSprite.anchor.set(0.5);
	character.attackSprite = new AnimatedSprite(attackTextureArray);
	character.attackSprite.animationSpeed = 0.1;
	character.attackSprite.anchor.set(0.5);
	character.attackSprite.onComplete = () => {
		character.state = character.CharState.IDLE;
		character.enterIdleState();
	}

	// Set & trigger sprite
	character.mainSprite = character.idleSprite;
	character.mainSprite.anchor.set(0.5);
	character.mainSprite.play();
	// character.resize();
	character.arrangePosition();

	characters.push(character);
	updatable.push(character);

	character.addSpriteToContainer();
}

class Character {
	constructor() {

	}
}

function addBoss() {
	boss = {};

	// Variables
	boss.health = 300;
	boss.healthWidth = 20;
	boss.graphics = new PIXI.Graphics();
	boss.dead = false;

	// Add to container
	updatable.push(boss);

	boss.buildAnimations = function() {
		// Create idle animation
		let idleImages = [ Images.BOSS_IDLE_0, Images.BOSS_IDLE_1, Images.BOSS_IDLE_2 ];
		let textureArray = [];
		for (i = 0; i< idleImages.length; i++) {
			let t = PIXI.Texture.fromImage(idleImages[i]);
			textureArray.push(t);
		};
		this.idleSprite = new AnimatedSprite(textureArray);
		this.idleSprite.animationSpeed = 0.025;

		// Assign current sprite
		this.mainSprite = this.idleSprite;
		this.mainSprite.play();
		this.resize();
	}

	boss.update = function() {
		this.graphics.clear();
		this.graphics.beginFill(0x000000);

		let healthX = 0 - (this.mainSprite.width) + (this.healthWidth / 2);
		let healthY = 0 - (this.healthHeight * 9);
		// Background
		this.graphics.drawRect(healthX, healthY, this.healthWidth, this.healthHeight);
		this.graphics.endFill();
		// Foreground
		this.graphics.beginFill(0xf44248);
		this.graphics.drawRect(healthX + 2, healthY + 2, (this.healthWidth - 4) * (this.health / 300), this.healthHeight - 4);

		// Death
		if (this.dead) {
			if (this.mainSprite.alpha > 0) {
				this.mainSprite.alpha -= 0.1;
			}
		}
	}

	boss.resize = function() {
		resizeSpriteByHeight(this.mainSprite, app.renderer.height * 0.23);

		this.healthWidth = this.mainSprite.width * 0.8;
		this.healthHeight = this.healthWidth / 8;
	}

	boss.setPosition = function() {
		let SPACING = 10;
		let s = this.mainSprite;

		let x = 0;
		let y = 0;

		x = app.renderer.width - (s.width / 2) - (SPACING * 4);
		y = app.renderer.height * 0.5;

		s.anchor.set(0.5);
		s.x = x;
		s.y = y;
	}

	boss.hit = function(damage) {
		this.health -= damage;
		if (this.health <= 0 && !this.dead) {
			this.die();
		}
		// Health limiting
		if (this.health <= 0) {
			this.health = 0;
		}
	}

	boss.die = function() {
		this.dead = true;
		initEndCard();
	}

	// Build animations
	boss.buildAnimations();

	// Position
	boss.setPosition();

	// Add health bar
	boss.mainSprite.addChild(boss.graphics);
	bossContainer.addChild(boss.mainSprite);
}

function createEndMenu() {
	let endMenu = new Sprite(resources[Images.END_CARD].texture);

	endMenu.update = function() {
		// Position
		let ty = (app.renderer.height / 2.5) - (endMenu.height / 2);
		endMenu.y += (ty - endMenu.y) / 10;
	}

	endMenu.resize = function() {
		resizeSpriteByWidth(endMenu, app.renderer.width * 0.75);
		endMenu.x = (app.renderer.width / 2) - endMenu.width / 2;
		endMenu.y = app.renderer.height;
	}

	endMenu.resize();

	endCardContainer.addChild(endMenu);
	endCardUpdatable.push(endMenu);

}

function createEndMenuChest() {
	let chest = new Sprite(resources[Images.END_CARD_CHEST].texture);

	chest.targetWidth = 0;
	chest.currentWidth = 0;
	chest.maximumShakeCooldown = 3;
	chest.shakeCooldown = chest.maximumShakeCooldown;
	chest.targetOffsetX = 0;
	chest.offsetX = 0;
	chest.targetOffsetY = 0;
	chest.offsetY = 0;
	chest.maximumOffset = 3;

	chest.update = function() {
		// Shaking
		this.shakeCooldown --;
		if (this.shakeCooldown <= 0) {
			this.shakeCooldown = this.maximumShakeCooldown;
			let negative = Math.random() > 0.5 ? true : false;
			this.offsetX = negative ? -getRandomInt(this.maximumOffset)
			 				: getRandomInt(this.maximumOffset);
			negative = Math.random() > 0.5 ? true : false;
			this.offsetY = negative ? -getRandomInt(this.maximumOffset)
			 				: getRandomInt(this.maximumOffset);
		}

		// Easing shake
		this.offsetX += (this.targetOffsetX - this.offsetX) / 10;
		this.offsetY += (this.targetOffsetY - this.offsetY) / 10;

		// Growth
		this.currentWidth += (this.targetWidth - this.currentWidth) / 20;
		this.resize();
	}

	chest.resize = function() {
		// Dimensions
		resizeSpriteByWidth(this, this.currentWidth);
		// Position
		this.x = (app.renderer.width / 2) - (this.width / 2) + this.offsetX;
		this.y = (app.renderer.height / 2) - (this.height / 2) + this.offsetY;
	}

	chest.width = 1;
	chest.height = 0.953608247;
	chest.targetWidth = app.renderer.width * 0.5;
	chest.x = (app.renderer.width / 2) - (chest.width / 2) + chest.offsetX;
	chest.y = (app.renderer.height / 2) - (chest.height / 2) + chest.offsetY;

	// Types
	endCardUpdatable.push(chest);
	endCardContainer.addChild(chest);
}

function addEndCardLogo() {
	let endCardLogo = new Sprite(resources[Images.LOGO].texture);

	endCardLogo.targetY = app.renderer.height - (app.renderer.height / 4);

	endCardLogo.update = function() {
		// Move up
		this.y += (this.targetY - this.y) / 5;
	}

	endCardLogo.resize = function() {
		resizeSpriteByWidth(this, app.renderer.width * 0.3);
		this.x = (app.renderer.width / 2) - (this.width / 2);
		this.y = app.renderer.height;
		this.targetY = app.renderer.height - this.height - 20;
	}

	endCardLogo.resize();

	endCardUpdatable.push(endCardLogo);
	endCardContainer.addChild(endCardLogo);

}

function createFireBall(x, y) {
	var fireball = {};

	let animImages = [ Images.FIREBALL_0, Images.FIREBALL_1, Images.FIREBALL_2, Images.FIREBALL_3, Images.FIREBALL_4 ];
	let textureArray = [];
	for (let i = 0; i < animImages.length; i++)
	{
		 let texture = PIXI.Texture.fromImage(animImages[i]);
		 textureArray.push(texture);
	};

	// Sprite properties
	let animSprite = new AnimatedSprite(textureArray);
	animSprite.width = app.renderer.width * 0.3;
	animSprite.height = app.renderer.height * 0.55;

	fireball.sprite = animSprite;
	fireball.sprite.anchor.set(0.5, 1.0);

	fireball.sprite.loop = false;
	fireball.sprite.animationSpeed = 0.2;
	fireball.sprite.position.set(x, y);

	// addScreenFlash();
	// shakeScreen((Math.random() * 20) + 5, (Math.random() * 20) + 5);

	// addLightningHit(lightning.sprite.x, lightning.sprite.y);

	fireball.sprite.play();
	fireball.sprite.onComplete = () => {
		fireball.sprite.destroy();
	};

	eContainer3.addChild(fireball.sprite);
}




















function test() {

}
