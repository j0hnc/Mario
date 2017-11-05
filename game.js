var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv');

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', mainState);
game.state.add('win', winState);
game.state.add('lose', loseState);

game.state.start('boot');