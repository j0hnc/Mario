var platforms, mario, cursors, facing = '';
var platformScl = 0.5;
var platformWidth = 192 * platformScl;
var platformHeight = 48 * platformScl;
var marioScl = 0.2;
var marioHeight = 224;
var marioWidth = 150;
var arrGround;
var coins, coin, coinsTxt;
var quantCoins = 0;
var princess;
var barrels;
var barrelWidth = 34;
var barrelHeight = 39;
var ost;
var won = false;

var mainState = {

	create: function() {

		ost = game.add.audio('ost');
		ost.play();

		game.physics.startSystem(Phaser.Physics.ARCADE);
		cursors = game.input.keyboard.createCursorKeys();

		arrGround = game.add.group();
		arrGround.enableBody = true;

		for (var i = 0; i < 10; i++) {
			var p = arrGround.create(i * 96, game.height - 26, 'platform');
			p.scale.setTo(platformScl);
			p.body.immovable = true;
		}

		bg = game.add.tileSprite(0, 0, 800, 600, 'background');

		coinsTxt = game.add.text(16, 16, 'Coins: 0', {
			fontSize: '26px',
			fill: '#000'
		});

		coinsTxt.stroke = '#fff';
		coinsTxt.strokeThickness = 3;

		barrels = game.add.group();
		barrels.enableBody = true;

		platforms = game.add.group();
		platforms.enableBody = true;
		var platform = platforms.create(game.width - platformWidth, 100, 'platform');
		platform.scale.setTo(platformScl);
		platform.body.immovable = true;

		coins = game.add.group();
		coins.enableBody = true;

		var hSpace = 120;
		var wSpace = 0;
		var w, h, j = 0;

		for (var i = 1; i <= 15; i++) {

			w = j * platformWidth + wSpace;
			h = game.height - hSpace;
			var platform = platforms.create(w, h, 'platform');

			if (i % 3 == 0) {
				coin = coins.create(w + platformWidth / 2, h - platformHeight, 'coin');
				coin.scale.setTo(marioScl);
				coin.animations.add('rotate', [0, 1, 2, 3, 4, 5], 12, true);
				coin.animations.play('rotate');
				coin.body.immovable = true;
			}

			wSpace += 80;
			j++;

			if (i % 5 == 0) {
				hSpace += 150;
				wSpace = 0;
				j = 0;
			}

			platform.scale.setTo(platformScl);
			platform.body.immovable = true;
		}

		j = 1;
		hSpace = 190;
		wSpace = 0;

		for (var i = 1; i <= 8; i++) {
			coin = coins.create(w + platformWidth / 2, h - platformHeight, 'coin');
			coin.scale.setTo(marioScl);
			coin.animations.add('rotate', [0, 1, 2, 3, 4, 5], 12, true);
			coin.animations.play('rotate');
			coin.body.immovable = true;
			w = j * platformWidth + wSpace;
			h = game.height - hSpace;
			var platform = platforms.create(w, h, 'platform');
			wSpace += 80;
			j++;
			if (i % 4 == 0) {
				hSpace += 150;
				wSpace = 0;
				j = 1;
			}
			platform.scale.setTo(platformScl);
			platform.body.immovable = true;
		}

		mario = game.add.sprite(0, game.height - marioHeight * marioScl - 48, 'Mario');
		game.physics.arcade.enable(mario);
		mario.body.gravity.y = 300;
		mario.body.collideWorldBounds = true;
		mario.scale.setTo(marioScl);
		mario.animations.add('walkL', [0, 1, 2], 7, true);
		mario.animations.add('walkR', [3, 4, 5], 7, true);
		mario.animations.add('JumpL', [7, 6, 8], 3, false);
		mario.animations.add('JumpR', [10, 11, 9], 3, false);
		mario.frame = 4;

		princess = game.add.sprite(game.width - 50, 0, 'princess');
		game.physics.arcade.enable(princess);
		princess.body.gravity.y = 0;
		princess.body.collideWorldBounds = true;
		princess.animations.add('animate', [0, 1, 2, 3], 7, true);
		princess.animations.add('falling',[4,5],4,true);
		princess.animations.play('animate');
	},
	update: function() {

		if (won) { coins.kill(); }

		var hitPlatform = game.physics.arcade.collide(mario, platforms);
		var hitGround = game.physics.arcade.collide(mario, arrGround);
		var hitPrincess = game.physics.arcade.collide(princess, platforms);
		var marioPrincess = game.physics.arcade.collide(mario, princess, winsTheGame);
		var barrelsHit = game.physics.arcade.collide(barrels, platforms, moveThem);
		var barrelsCollide = game.physics.arcade.collide(barrels,barrels, collideb);
		var bHitGround = game.physics.arcade.collide(barrels, arrGround);
		var marioHitsBarrel = game.physics.arcade.collide(mario, barrels, theEnd);
		var getCoin = game.physics.arcade.overlap(mario, coins, collectCoin, null, this);

		for (var i = 0; i < barrels.children.length; i++) {
			var tmpBarrel = barrels.children[i];
			if (tmpBarrel.body.position.x >= game.width || tmpBarrel.body.position.x <= 0) tmpBarrel.kill();
			if (tmpBarrel.body.touching.right) {
				tmpBarrel.body.velocity.x = -150;
			} else if (tmpBarrel.body.touching.left) {
				tmpBarrel.body.velocity.x = 150;
			}
		}

		mario.body.velocity.x = 0;

		if (cursors.left.isDown) {
			mario.body.velocity.x = -200;
			if (facing != 'left') {
				if (mario.body.touching.down && (hitPlatform || hitGround)) {
					mario.animations.play('walkL');
				} else {
					mario.animations.play("JumpL");
				}
				facing = 'left';
			}
		} else if (cursors.right.isDown) {
			mario.body.velocity.x = 200;
			if (facing != 'right') {
				if (mario.body.touching.down && (hitPlatform || hitGround)) {
					mario.animations.play('walkR');
				} else {
					mario.animations.play("JumpR");
				}
				facing = 'right';
			}
		} else {
			mario.animations.stop();
			if (facing != 'idle') {
				if (facing == 'left') {
					mario.frame = 1;
				} else {
					mario.frame = 4;
				}
				facing = 'idle';
			}
		}

		if (cursors.up.isDown && mario.body.touching.down && (hitPlatform || hitGround)) {
			var snd = game.add.audio("jump");
			snd.volume = 0.2;
			snd.play();
			if (cursors.left.isDown) {
				mario.animations.play("JumpL");
			}
			if (cursors.right.isDown) {
				mario.animations.play("JumpR");
			}
			mario.body.velocity.y = -250;
		}
	},
	win: function() {
		game.state.start('win');
	},
	lose: function() {
		game.state.start('lose');
	}
};

function collectCoin(mario, coin) {
	coin.kill();
	var snd = game.add.audio('coinc');
	snd.play();
	quantCoins++;
	coinsTxt.text = 'Coins: ' + quantCoins;
}

var intervalID = window.setInterval(lunchBarrels, 3000);

function lunchBarrels() {
	if (won == false) {
		for (var i = 1; i <= 3; i++) {
			var position = Math.random() * (game.width - platformWidth - 60);
			var barrel = barrels.create(position, -10, 'barrel');
			barrel.body.gravity.y = 300;
			barrel.animations.add('rotate', [0, 1, 2, 3, 4, 5, 6, 7], 7, true);
			barrel.animations.play('rotate');
		}
	}
}

function moveThem(barrel, platform) {
	if (barrel.body.touching.left) {
		barrel.body.velocity.x = 150;
	} else if (barrel.body.touching.right) {
		barrel.body.velocity.x = -150;
	} else if (barrel.body.touching.down && barrel.body.velocity.x == 0) {
		barrel.body.velocity.x = 150;
	}
}

function theEnd() {
	mainState.lose();
}

function winsTheGame() {
	if (quantCoins >= 3) { // for testing
		mainState.win();		
	}	
}

function collideb(barrel,barrel){
	if (barrel.body.touching.left) {
		barrel.body.velocity.x = 150;
	} else if (barrel.body.touching.right) {
		barrel.body.velocity.x = -150;
	} else if (barrel.body.touching.down && barrel.body.velocity.x == 0) {
		barrel.body.velocity.x = 150;
	}
}