var platforms, mario, princess;
var ground, coins, coinsText;
var barrels, quantCoins = 0;
var cursors, ost, facing = '';
var platformScl = 0.5, marioScl = 0.2;
var platformWidth = 192 * platformScl;
var platformHeight = 48 * platformScl;
var marioWidth = 150 * marioScl;
var marioHeight = 224 * marioScl;
var barrelWidth = 34;
var barrelHeight = 39;
var won = false;

var mainState = {

	create: function() {

		ost = game.add.audio('ost');
		ost.play();

		game.physics.startSystem(Phaser.Physics.ARCADE);

		cursors = game.input.keyboard.createCursorKeys();

		ground = game.add.group();
		ground.enableBody = true;

		for (var i = 0; i < 10; i++) {
			var p = ground.create(i * platformWidth, game.height - platformHeight, 'platform');
			p.scale.setTo(platformScl);
			p.body.immovable = true;
		}

		var bg = game.add.tileSprite(0, 0, 800, 600, 'background');

		coinsText = game.add.text(16, 16, 'Coins: 0', {
			fontSize: '26px',
			fill: '#000',
			stroke: '#fff',
			strokeThickness: 3
		});

		barrels = game.add.group();
		coins = game.add.group();
		platforms = game.add.group();

		barrels.enableBody = true;		
		coins.enableBody = true;		
		platforms.enableBody = true;

		var platform = platforms.create(game.width - platformWidth, 100, 'platform');
		platform.scale.setTo(platformScl);
		platform.body.immovable = true;

		var hSpace = 120, wSpace = 0;
		var w, h, j = 0;

		for (var i = 1; i <= 15; i++) {
			w = j * platformWidth + wSpace;
			h = game.height - hSpace;
			platform = platforms.create(w, h, 'platform');

			if (i % 4 == 0) {
				var coin = coins.create(w + platformWidth / 2, h - platformHeight, 'coin');
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
			var coin = coins.create(w + platformWidth / 2, h - platformHeight, 'coin');
			coin.scale.setTo(marioScl);
			coin.animations.add('rotate', [0, 1, 2, 3, 4, 5], 12, true);
			coin.animations.play('rotate');
			coin.body.immovable = true;
			w = j * platformWidth + wSpace;
			h = game.height - hSpace;
			platform = platforms.create(w, h, 'platform');
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

		mario = game.add.sprite(0, game.height - marioHeight - platformHeight, 'Mario');
		mario.scale.setTo(marioScl);
		game.physics.arcade.enable(mario);
		mario.body.gravity.y = 300;
		mario.body.collideWorldBounds = true;				
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

		// collisions
		var hitPlatform = game.physics.arcade.collide(mario, platforms);
		var hitGround = game.physics.arcade.collide(mario, ground);
		var hitPrincess = game.physics.arcade.collide(princess, platforms);
		var marioPrincess = game.physics.arcade.collide(mario, princess, winsTheGame);
		var barrelsHit = game.physics.arcade.collide(barrels, platforms, moveBarrels);
		var barrelsCollide = game.physics.arcade.collide(barrels,barrels, barrelCollision);
		var bHitGround = game.physics.arcade.collide(barrels, ground);
		var marioHitsBarrel = game.physics.arcade.collide(mario, barrels, finishGame);
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
	coinsText.text = 'Coins: ' + (++quantCoins);
	var snd = game.add.audio('coinc');
	snd.play();	
}

var intervalID = window.setInterval(lunchBarrels, 3000);

function lunchBarrels() {
	if (!won) {
		for (var i = 1; i <= 3; i++) {
			var position = Math.random() * (game.width - platformWidth - 60);
			var barrel = barrels.create(position, -10, 'barrel');
			barrel.body.gravity.y = 300;
			barrel.animations.add('rotate', [0, 1, 2, 3, 4, 5, 6, 7], 7, true);
			barrel.animations.play('rotate');
		}
	}
}

function moveBarrels(barrel, platform) {
	if (barrel.body.touching.left) {
		barrel.body.velocity.x = 150;
	} else if (barrel.body.touching.right) {
		barrel.body.velocity.x = -150;
	} else if (barrel.body.touching.down && barrel.body.velocity.x == 0) {
		barrel.body.velocity.x = 150;
	}
}

function finishGame() {
	reset();
	mainState.lose();
}

function winsTheGame() {
	if (quantCoins >= 10) {
		reset();
		mainState.win();
	}	
}

function reset() {
	quantCoins = 0;
	coins.kill();	
	barrels.kill();	
}

function barrelCollision(barrel,barrel){
	if (barrel.body.touching.left) {
		barrel.body.velocity.x = 150;
	} else if (barrel.body.touching.right) {
		barrel.body.velocity.x = -150;
	} else if (barrel.body.touching.down && barrel.body.velocity.x == 0) {
		barrel.body.velocity.x = 150;
	}
}