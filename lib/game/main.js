ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',

	'plugins.camera',
	'plugins.touch-button',
	'plugins.impact-splash-loader',
	
	'game.entities.player',

	'game.levels.title',
	'game.levels.one',
	'game.levels.two',
	'game.levels.three',
	'game.levels.four',
	'game.levels.five'
)
.defines(function(){
	

// Our Main Game class. This will load levels, host all entities and
// run the game.

MyGame = ig.Game.extend({
	
	clearColor: "#f1d99d",
	gravity: 1500, // All entities are affected by this
	
	// Load a font
	font: new ig.Font( 'media/fredoka-one.font.png' ),

	// HUD icons
	
	
	init: function() {
		// We want the font's chars to slightly touch each other,
		// so set the letter spacing to -2px.
		this.font.letterSpacing = -2;	
    
    var as = new ig.AnimationSheet( 'media/bkg1.png', 150, 161 );
    var as2 = new ig.AnimationSheet( 'media/bkg2.png', 120, 66 );
    var as3 = new ig.AnimationSheet( 'media/bkg3.png', 250, 206 );
    this.backgroundAnims = {
        'media/plateformes2.png': {
            0: new ig.Animation( as, 0.15, [0,1,2,3] ),
            1: new ig.Animation( as2, 0.1, [0,1,2,3,4] ),
            2: new ig.Animation( as3, 0.18, [0,1,2,1] )
        }
    };
    
		this.loadLevel( LevelOne );
	},
  
  addPlayer: function(player) {
    if(player.selected) this.selectedPlayer = this.players.length;
    this.players.push(player);
  },
  
  switchPlayer: function() {
    this.selectedPlayer++;
    if(this.selectedPlayer >= this.players.length) this.selectedPlayer = 0;
    
    for(var i =0; i < this.players.length; i++) {
      this.players[i].selected = i === this.selectedPlayer;
    }
  },

	loadLevel: function( data ) {
    
		// Remember the currently loaded level, so we can reload when
		// the player dies.
		this.currentLevel = data;
    
    this.resetTimer = 120;
    this.players = [];

		// Call the parent implemenation; this creates the background
		// maps and entities.
		this.parent( data );
		
		this.setupCamera();
	},
	
	setupCamera: function() {
		// Set up the camera. The camera's center is at a third of the screen
		// size, i.e. somewhat shift left and up. Damping is set to 3px.		
		this.camera = new ig.Camera( ig.system.width/3, ig.system.height/3, 3 );
		
		// The camera's trap (the deadzone in which the player can move with the
		// camera staying fixed) is set to according to the screen size as well.
    	this.camera.trap.size.x = ig.system.width/5;
    	this.camera.trap.size.y = ig.system.height/5;
		
		// The lookahead always shifts the camera in walking position; you can 
		// set it to 0 to disable.
    	this.camera.lookAhead.x = ig.system.width/8;
		
		// Set camera's screen bounds and reposition the trap on the player
    	this.camera.max.x = this.collisionMap.pxWidth - ig.system.width;
    	this.camera.max.y = this.collisionMap.pxHeight - ig.system.height;
    	this.camera.set( this.players[this.selectedPlayer] );
	},

	reloadLevel: function() {
		this.loadLevelDeferred( this.currentLevel );
	},
	
	update: function() {		
		// Update all entities and BackgroundMaps
		this.parent();
		
		// Camera follows the player
		this.camera.follow( this.players[this.selectedPlayer] );
    
    if(ig.input.state('switch')) {
      if(!this.switched) {
        this.switched = true;
        this.switchPlayer();
      }
    } else {
      this.switched = false;
    }
    
    this.resetTimer--;
    
    if(ig.input.state('reset') && this.resetTimer <= 0) {
      this.reloadLevel();
    }
		
		// Instead of using the camera plugin, we could also just center
		// the screen on the player directly, like this:
		// this.screen.x = this.player.pos.x - ig.system.width/2;
		// this.screen.y = this.player.pos.y - ig.system.height/2;
	},
	
	draw: function() {
		// Call the parent implementation to draw all Entities and BackgroundMaps
		this.parent();
		

		// Draw the heart and number of coins in the upper left corner.
		// 'this.player' is set by the player's init method
		if( this.player ) {
			var x = 16, 
				y = 16;

			for( var i = 0; i < this.player.maxHealth; i++ ) {
				// Full or empty heart?
				if( this.player.health > i ) {
					this.heartFull.draw( x, y );
				}
				else {
					this.heartEmpty.draw( x, y );	
				}

				x += this.heartEmpty.width + 8;
			}

			// We only want to draw the 0th tile of coin sprite-sheet
			x += 48;
			this.coinIcon.drawTile( x, y+6, 0, 36 );

			x += 42;
			this.font.draw( 'x ' + this.player.coins, x, y+10 )
		}
		
		// Draw touch buttons, if we have any
		if( window.myTouchButtons ) {
			window.myTouchButtons.draw(); 
		}
	}
});



// The title screen is simply a Game Class itself; it loads the LevelTitle
// runs it and draws the title image on top.

MyTitle = ig.Game.extend({
	clearColor: "#f1d99d",
	gravity: 800,

	// The title image
	title: new ig.Image( 'media/title.png' ),

	// Load a font
	font: new ig.Font( 'media/fredoka-one.font.png' ),

	init: function() {
		// Bind keys
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
		ig.input.bind( ig.KEY.X, 'jump' );
		ig.input.bind( ig.KEY.C, 'switch' );
		ig.input.bind( ig.KEY.R, 'reset' );
		
		// Align touch buttons to the screen size, if we have any
		if( window.myTouchButtons ) {
			window.myTouchButtons.align(); 
		}

		// We want the font's chars to slightly touch each other,
		// so set the letter spacing to -2px.
		this.font.letterSpacing = -2;
    
    var as = new ig.AnimationSheet( 'media/bkg1.png', 150, 161 );
    var as2 = new ig.AnimationSheet( 'media/bkg2.png', 120, 66 );
    var as3 = new ig.AnimationSheet( 'media/bkg3.png', 250, 206 );
    this.backgroundAnims = {
        'media/plateformes2.png': {
            0: new ig.Animation( as, 0.15, [0,1,2,3] ),
            1: new ig.Animation( as2, 0.1, [0,1,2,3,4] ),
            2: new ig.Animation( as3, 0.18, [0,1,2,1] )
        }
    };

		this.loadLevel( LevelTitle );
		this.maxY = this.backgroundMaps[0].pxHeight - ig.system.height;
    
    
		this.setupCamera();
	},

	update: function() {
		// Check for buttons; start the game if pressed
		if( ig.input.pressed('jump') ) {
			ig.system.setGame( MyGame );
			return;
		}
		
		this.parent();
	},

	draw: function() {
		this.parent();

		var cx = ig.system.width/2;
		this.title.draw( cx - this.title.width/2, 200 );
		
		// Draw touch buttons, if we have any
		if( window.myTouchButtons ) {
			window.myTouchButtons.draw(); 
		}
    
    this.screen.x = 1600 - ig.system.width / 2;
    this.screen.y = 850 - ig.system.height / 2;
	},
  
  addPlayer: function(player) {
    if(!this.players) this.players = [];
    if(player.selected) this.selectedPlayer = this.players.length;
    this.players.push(player);
  },
  
  
	setupCamera: function() {
		// Set up the camera. The camera's center is at a third of the screen
		// size, i.e. somewhat shift left and up. Damping is set to 3px.		
		this.camera = new ig.Camera( ig.system.width/3, ig.system.height/3, 3 );
		
		// The camera's trap (the deadzone in which the player can move with the
		// camera staying fixed) is set to according to the screen size as well.
    	this.camera.trap.size.x = ig.system.width/5;
    	this.camera.trap.size.y = ig.system.height/5;
		
		// The lookahead always shifts the camera in walking position; you can 
		// set it to 0 to disable.
    	this.camera.lookAhead.x = ig.system.width/8;
		
		// Set camera's screen bounds and reposition the trap on the player
    	this.camera.max.x = this.collisionMap.pxWidth - ig.system.width;
    	this.camera.max.y = this.collisionMap.pxHeight - ig.system.height;
    	this.camera.set( this.players[this.selectedPlayer] );
	}
});

window.initGame = function() {

  if( ig.ua.mobile ) {
    // If we're running on a mobile device and not within Ejecta, disable 
    // sound completely :(
    if( !window.ejecta ) {
      ig.Sound.enabled = false;
    }

    // Use the TouchButton Plugin to create a TouchButtonCollection that we
    // can draw in our game classes.

    // Touch buttons are anchored to either the left or right and top or bottom
    // screen edge.
    var buttonImage = new ig.Image( 'media/touch-buttons.png' );
    myTouchButtons = new ig.TouchButtonCollection([
      new ig.TouchButton( 'left', {left: 0, bottom: 0}, 128, 128, buttonImage, 0 ),
      new ig.TouchButton( 'right', {left: 128, bottom: 0}, 128, 128, buttonImage, 1 ),
      new ig.TouchButton( 'switch', {right: 128, bottom: 0}, 128, 128, buttonImage, 2 ),
      new ig.TouchButton( 'jump', {right: 0, bottom: 96}, 128, 128, buttonImage, 3 )
    ]);
  }

  // If our screen is smaller than 640px in width (that's CSS pixels), we scale the 
  // internal resolution of the canvas by 2. This gives us a larger viewport and
  // also essentially enables retina resolution on the iPhone and other devices 
  // with small screens.


  // We want to run the game in "fullscreen", so let's use the window's size
  // directly as the canvas' style size.
  var canvas = document.getElementById('canvas');
  var size = Math.min(window.innerWidth, window.innerHeight);
  canvas.style.width = size + 'px';
  canvas.style.height = size + 'px';
  canvas.style.marginTop = -(size / 2) + 'px';
  canvas.style.marginLeft = -(size / 2) + 'px';
  var scale = 2;


  // Listen to the window's 'resize' event and set the canvas' size each time
  // it changes.
  window.addEventListener('resize', function(){
    // If the game hasn't started yet, there's nothing to do here
    if( !ig.system ) { return; }

    // Resize the canvas style and tell Impact to resize the canvas itself;
    var size = Math.min(window.innerWidth, window.innerHeight);
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    canvas.style.marginTop = -(size / 2) + 'px';
    canvas.style.marginLeft = -(size / 2) + 'px';
    ig.system.resize( size * scale, size * scale );

    // Re-center the camera - it's dependend on the screen size.
    if( ig.game && ig.game.setupCamera ) {
      ig.game.setupCamera();
    }

    // Also repositon the touch buttons, if we have any
    if( window.myTouchButtons ) {
      window.myTouchButtons.align(); 
    }
  }, false);


  // Finally, start the game into MyTitle and use the ImpactSplashLoader plugin 
  // as our loading screen
  var width = size * scale,
    height = size * scale;
  ig.main( '#canvas', MyTitle, 60, width, height, 1, ig.ImpactSplashLoader );

}

});
