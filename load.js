var loadState = {

	preload: function() {

		var loadingLabel = game.add.text(80, 150, 'Loading...', {
			font: '30px Courier',
			fill: '#ffffff'
		});

		game.load.audio('mainAudio', 'sounds/ost2.mp3');
		game.load.audio('jump', 'sounds/jump.mp3');
		game.load.audio('die', 'sounds/die.mp3');
		game.load.audio('win', 'sounds/win.mp3');
		game.load.audio('coinc', 'sounds/coin.mp3');
		game.load.image('background', "Sprites/back.png");
		game.load.image('platform', "Sprites/platform.png");
		game.load.image('bgIntro', "Sprites/bgIntro.png");
		game.load.image('bgLose', "Sprites/bgLose.jpg");
		game.load.image('bgWins', "Sprites/bgWins.png");
		game.load.image('button', "Sprites/start.png");
		game.load.spritesheet('Mario', "Sprites/spm.png", 150, 224, 15);
		game.load.spritesheet('coin', "Sprites/coins.png", 103, 96, 6);
		game.load.spritesheet('princess', "Sprites/Peach.png", 31, 70, 6);
		game.load.spritesheet('barrel', "Sprites/Barrels.png", barrelWidth, barrelHeight, 8);
		game.load.spritesheet('kong', "Sprites/dk.png", 65, 150, 6);	

	},

	create: function() {				
		game.state.start('menu');
	}
	
};
