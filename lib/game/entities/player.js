ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityPlayer = ig.Entity.extend({
	
	// The players (collision) size is a bit smaller than the animation
	// frames, so we have to move the collision box a bit (offset)
	size: {x: 72, y: 72},
  offset: {x: 11, y: 25},
	
	maxVel: {x: 300, y: 800},
	friction: {x: 1500, y: 0},
	
	type: ig.Entity.TYPE.A, // Player friendly group
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.ACTIVE,
	
	animSheet: new ig.AnimationSheet( 'media/player.png', 92, 121 ),	
	
	sfxJump: new ig.Sound( 'media/sounds/jump.*' ),
	
	
	health: 1,

	// These are our own properties. They are not defined in the base
	// ig.Entity class. We just use them internally for the Player
	flip: false,
	accelGround: 2000,
	accelAir: 600,
	jump: 750,	
	maxHealth: 1,
  selected: false,

	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		// Add the animations
		this.addAnim( 'idle', 1, [0] );
		this.addAnim( 'run', 0.1, [7,8,9,10,11,12,13,14] );
		this.addAnim( 'jump', 0.05, [1,2,3,4], true );
		this.addAnim( 'fall', 0.2, [5], true ); // stop at the last frame
		this.addAnim( 'ground', 0.1, [6,0], true ); // stop at the last frame
		this.addAnim( 'pain', 0.3, [0], true );

		// Set a reference to the player on the game instance
		ig.game.addPlayer && this.active && ig.game.addPlayer(this);
	},
	
	
	update: function() {

		// Handle user input; move left or right
		var accel = this.standing ? this.accelGround : this.accelAir;
		if( ig.input.state('left') && this.selected) {
			this.accel.x = -accel;
			this.flip = true;
		}
		else if( ig.input.state('right')  && this.selected) {
			this.accel.x = accel;
			this.flip = false;
		}
		else {
			this.accel.x = 0;
		}

		// jump
		if( this.standing && ig.input.pressed('jump') && this.selected ) {
			this.vel.y = -this.jump;
			this.sfxJump.play();
		}
		
		if( this.vel.y < 0 ) {
			if( this.currentAnim != this.anims.jump ) {
				this.currentAnim = this.anims.jump.rewind();
			}
		}
		else if( this.vel.y > 0 ) {
			if( this.currentAnim != this.anims.fall ) {
				this.currentAnim = this.anims.fall.rewind();
			}
		}
		else if( this.vel.x != 0 ) {
			this.currentAnim = this.anims.run;
		}
		else {
      if(this.currentAnim == this.anims.fall) this.currentAnim = this.anims.ground.rewind();
			if(this.currentAnim != this.anims.ground) this.currentAnim = this.anims.idle;
		}
		
		this.currentAnim.flip.x = this.flip;
    
    this.currentAnim.alpha = this.selected ? 1 : 0.6;
		
		// Move!
		this.parent();
	},

	kill: function() {
		this.parent();

		// Reload this level
		ig.game.reloadLevel();
	}
});


});