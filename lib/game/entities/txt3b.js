ig.module(
	'game.entities.txt3b'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityTxt3b = ig.Entity.extend({
	
	size: {x: 100, y: 50},
	
	type: ig.Entity.TYPE.A, // Player friendly group
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.NEVER,
  
  gravityFactor: 0,
	
	animSheet: new ig.AnimationSheet( 'media/txt3b.png', 448, 135 ),	
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		// Add the animations
		this.addAnim( 'idle', 1, [0] );
	}
  
});


});