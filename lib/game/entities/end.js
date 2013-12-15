

ig.module(
	'game.entities.end'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityEnd = ig.Entity.extend({
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(255, 0, 0, 0.7)',
	
	size: {x: 32, y: 32},
		
	triggeredBy: function( entity, trigger ) {	
		document.body.className = 'gameover';
	},
	
	update: function(){}
});

});