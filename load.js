var loadState = {
	preload: function() {
		var loadingLabel = game.add.text(80, 150, 'loading...', {
			font: '30px Courier',
			fill: '#ffffff'
		});
		game.load.audio('ost','sounds/ost2.mp3');
		game.load.audio('jump', ['sounds/jump.mp3', 'sounds/jump.ogg']);
		game.load.audio('die', ['sounds/die.mp3', 'sounds/die.ogg']);
		game.load.audio('win', ['sounds/win.mp3', 'sounds/win.ogg']);
		game.load.audio('coinc', ['sounds/coin.mp3', 'sounds/coin.ogg']);
		game.load.image('background', "Sprites/back.png");
		game.load.image('platform', "Sprites/platform.png");
		game.load.spritesheet('Mario', "Sprites/spm.png", marioWidth, marioHeight, 15);
		game.load.spritesheet('coin', "Sprites/coins.png", 103, 96, 6);
		game.load.spritesheet('princess', "Sprites/Peach.png", 31, 70, 6);
		game.load.spritesheet('barrel', "Sprites/Barrels.png", barrelWidth, barrelHeight, 8);		
	},
	create: function() {				
		game.state.start('menu');
	}
};