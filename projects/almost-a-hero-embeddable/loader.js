
function loadLoader() {
	PIXI.loader
	    .add([
	    	Images.LOADING_BG
	    ])
	    .load(initLoader);
}

function loadGameplay() {
	PIXI.loader
		.add([
			Images.BG, Images.TUTORIAL_CONTAINER_LIGHTNING, Images.TUTORIAL_FINGER,
			Images.INSTALL_BUTTON, Images.CHAR_ICON_1, Images.CHAR_ICON_2,
			Images.CHAR_ICON_3, Images.CHAR_ICON_4, Images.ENEMY_IDLE_0,
			Images.ENEMY_IDLE_1, Images.ENEMY_IDLE_2, Images.END_CARD,
			Images.END_CARD_CHEST, Images.LOGO, Images.TUTORIAL_CONTAINER_UNLOCK,
			Images.TUTORIAL_CONTAINER_ATTACK, Images.BOSS_NOTIFICATION,

			Images.HERO_HILT_IDLE_0, Images.HERO_HILT_IDLE_1, Images.HERO_HILT_IDLE_2,
			Images.HERO_HILT_ATTACK_0, Images.HERO_HILT_ATTACK_1, Images.HERO_HILT_ATTACK_2,
			Images.HERO_HILT_ATTACK_3, Images.HERO_HILT_ATTACK_4, Images.HERO_HILT_ATTACK_5,
			Images.HERO_HILT_ATTACK_6,

			Images.HERO_IDA_IDLE_0, Images.HERO_IDA_IDLE_1, Images.HERO_IDA_IDLE_2,
			Images.HERO_IDA_ATTACK_0, Images.HERO_IDA_ATTACK_1, Images.HERO_IDA_ATTACK_2,
			Images.HERO_IDA_ATTACK_3, Images.HERO_IDA_ATTACK_4, Images.HERO_IDA_ATTACK_5,
			Images.HERO_IDA_ATTACK_6, Images.HERO_IDA_ATTACK_7, Images.HERO_IDA_ATTACK_8,

			Images.HERO_SAM_IDLE_0, Images.HERO_SAM_IDLE_1, Images.HERO_SAM_IDLE_2,
			Images.HERO_SAM_ATTACK_0, Images.HERO_SAM_ATTACK_1, Images.HERO_SAM_ATTACK_2,
			Images.HERO_SAM_ATTACK_3, Images.HERO_SAM_ATTACK_4, Images.HERO_SAM_ATTACK_5,

			Images.HERO_DERECK_IDLE_0, Images.HERO_DERECK_IDLE_1, Images.HERO_DERECK_IDLE_2,
			Images.HERO_DERECK_ATTACK_0, Images.HERO_DERECK_ATTACK_1, Images.HERO_DERECK_ATTACK_2,
			Images.HERO_DERECK_ATTACK_3, Images.HERO_DERECK_ATTACK_4, Images.HERO_DERECK_ATTACK_5,

			Images.BOSS_IDLE_0, Images.BOSS_IDLE_1, Images.BOSS_IDLE_2
		])
		.on("progress", printLoadAmt)
		.load(initGameplay);
}

function printLoadAmt(loader, resource) {
}
