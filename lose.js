var loseState = {
	create: function() {
		var bg = game.add.tileSprite(0, 0, 800, 600, 'bgLose');
		var winLabel = game.add.text(40, 50, 'YOU LOST :(', {
			font: '80px Arial', 
			fill: '#FF0000',
			stroke: '#000',
			strokeThickness: 10
		});
		var startLabel = game.add.text(80, game.world.height-80, 'press the W key to restart', {
			font: '25px Arial',
			fill: '#ffffff',
			stroke: '#000',
			strokeThickness: 10
		});

		ost.stop();
		ost = game.add.audio('die');
		ost.play();

		var wkey = game.input.keyboard.addKey(Phaser.Keyboard.W);
		wkey.onDown.addOnce(this.restart, this);
	},
	restart: function() {
		game.state.start('play');
	}
};