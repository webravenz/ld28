ig.module(
	'game.entities.txt1'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityTxt1 = ig.Entity.extend({
	
	size: {x: 100, y: 50},
	
	type: ig.Entity.TYPE.A, // Player friendly group
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.NEVER,
  
  gravityFactor: 0,
	
	animSheet: new ig.AnimationSheet( 'media/txt1.png', 444, 85 ),	
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		// Add the animations
		this.addAnim( 'idle', 1, [0] );
	}
  
});


});