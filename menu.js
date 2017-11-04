var menuState = {
	create: function() {
		var bg = game.add.tileSprite(0, 0, 800, 600, 'bgIntro');
		var nameLabel = game.add.text(80, 80, 'MARIO', {
			font: '80px Arial',			
			fill: '#fff',
			stroke: '#000',
			strokeThickness: 10
		});
		var startLabel = game.add.text(80, game.world.height-80, 'press the W key to start', {
			font: '25px Arial',
			fill: '#ffffff',
			stroke: '#000',
			strokeThickness: 10
		});
		var wkey = game.input.keyboard.addKey(Phaser.Keyboard.W);
		wkey.onDown.addOnce(this.start, this);
	},
	start: function() {
		game.state.start('play');		
	}
};