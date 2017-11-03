var winState = {
	create: function() {
		var winLabel = game.add.text(80, 80, 'YOU WON!', {
			font: '50px Arial', 
			fill: '#00FF00'
		});
		var startLabel = game.add.text(80, game.world.height-80, 'press the W key to restart', {
			font: '25px Arial',
			fill: '#ffffff'
		});

		ost.stop();
		ost = game.add.audio('win');
		ost.play();

		var wkey = game.input.keyboard.addKey(Phaser.Keyboard.W);
		wkey.onDown.addOnce(this.restart, this);
	},
	restart: function() {
		game.state.start('menu');
	}
};