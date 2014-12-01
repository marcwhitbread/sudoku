//on dom ready
$(document).ready(function() {
	
	var board = new Board('#sudoku-board');
	
});
/*app.controller('mainCtrl', ['$scope', 'Board', 'Region', 'Tile', function($scope, Board, Region, Tile) {
	
	$scope.board = new Board();
	
}]);*/
function Board(obj) {
	this.obj = $(obj);
	this.regions = [];
	this.validated = true;
	this.timer;
	this.stop;
	this.win;
	this.loaded;
	
	var play_modal_obj = $('.play.modal');
	var play_modal_play_button_obj = $('.play.modal .button.load');
	var win_modal_obj = $('.win.modal');
	var reset_button_obj = $('.button.reset');
	var validate_button_obj = $('.button.validate');
	var global_timer_obj = $('.global-timer');
	var body_obj = $('body');
	var options_toggle_objs;
	
	//init board
	this.init = function() {
		
		for(var i = 8; i >= 0; i--) {
			this.regions[i] = new Region(i);
			this.obj.prepend(this.regions[i].obj);
		}
		
		options_toggle_objs = $(this.obj).find('.options-toggle');
		
		/* events */
		play_modal_play_button_obj.on('click', { scope: this }, function(e) {
			e.data.scope.loadDefault(e.data.scope);
		});
		
		validate_button_obj.on('click', { scope: this }, function(e) {
			e.data.scope.toggleValidation();
		});
		
		reset_button_obj.on('click', { scope: this }, function(e) {
			e.data.scope.reset();
		});

		options_toggle_objs.on('click', { scope: this }, function(e) {
			console.log('a');
			e.data.scope.hideTileOptions();
		});
		
	}
	
	//load board
	this.loadDefault = function(scope) {
		
		this.loaded = true;
		
		$.ajax({
			dataType: 'json',
			url: 'js/data/puzzle.js',
			success: function(data) {
	        	
	        	data.forEach(function(obj, i) {
	            	scope.regions[i].load(obj.region);
	        	});
	        	
	        	scope.reset();
	        	
	        }
	    });
		
	}
	
	//load random board
	this.loadRandom = function() {
		
		this.loaded = true;
		this.startTimer();
		
		//TBD if time permits
		
	}
	
	this.updateTimer = function() {
		
		global_timer_obj.html(this.formatTime());
		
	}
	
	this.updateView = function() {
		
		//update timer
		this.updateTimer();
		
		//update win modal
		if(this.win && !win_modal_obj.hasClass('show'))
			win_modal_obj.addClass('show');
		else if(!this.win && win_modal_obj.hasClass('show'))
			win_modal_obj.removeClass('show');
			
		//update play modal
		if(!this.loaded && !play_modal_obj.hasClass('show'))
			play_modal_obj.addClass('show');
		else if(this.loaded && play_modal_obj.hasClass('show'))
			play_modal_obj.removeClass('show');
			
		//update hints
		if(this.validated && !body_obj.hasClass('hints'))
			body_obj.addClass('hints');
		else if(!this.validated && body_obj.hasClass('hints'))
			body_obj.removeClass('hints');
		
	}
	
	//format timer as mins:secs
	this.formatTime = function() {
		
		var mins = Math.floor(this.timer/60);
		var secs = Math.floor(this.timer%60);
		
		//add leading zero
		secs = (secs.toString().length < 2) ? '0' + secs : secs;

		return mins + ':' + secs;
		
	}
	
	//hide open tile options
	this.hideTileOptions = function() {
		
		this.regions.forEach(function(region) {
			region.hideTileOptions();
		});
		
	}
	
	//select tile option
	this.selectTileOption = function(region, tile, option) {
		
		region.selectTileOption(tile, option);
		
		//begin validation
		this.validateTile(region, tile, [], option);
		
		this.checkWin();
		
		this.updateView();
		tile.updateView();
			
	}
	
	//validate update to board
	this.validateTile = function(region, tile, validatedTiles, option) {
		
		var scope = this;
		
		if(option && !option.selected)
			scope.validateGuess(region, tile, option.number, validatedTiles);
		
		tile.guesses.forEach(function(guess) {
			scope.validateGuess(region, tile, guess, validatedTiles);
		});
		
		if(tile.guesses.length == 0) {
			tile.valid = true;
		}
		
	}
	
	//validate single guess
	this.validateGuess = function(region, tile, guess, validatedTiles) {
		
		//validate region
		var invalidSet = region.validateTile(tile, guess);
		
		this.validateSet(region, tile, guess, invalidSet, validatedTiles);
		
		//validate rows/cols
		for(var i = 0; i < 3; i++) {
		
			var colRegion = this.regions[region.getCol()+i*3];
			var rowRegion = this.regions[region.getRow()*3+i];

			if(colRegion != region) {
				
				var invalidSet = colRegion.validateTileCol(tile, guess);
				
				this.validateSet(colRegion, tile, guess, invalidSet, validatedTiles);
				
			}
			
			if(rowRegion != region) {
				
				var invalidSet = rowRegion.validateTileRow(tile, guess);
				
				this.validateSet(rowRegion, tile, guess, invalidSet, validatedTiles);
				
			}
				
		}
			
	}
	
	//validate set of tiles
	this.validateSet = function(region, tile, number, invalidSet, validatedTiles) {

		var scope = this;
		
		if(tile.guesses.length == 0) {
			tile.valid = true;
		} else if((invalidSet.length > 0) && (validatedTiles.indexOf(tile) == -1)) {
			validatedTiles.push(tile);
			tile.valid = false;
		} else if(validatedTiles.indexOf(tile) == -1) {
			tile.valid = true;
		}
		
		invalidSet.forEach(function(obj) {
			
			if(validatedTiles.indexOf(obj) == -1) {
				scope.validateTile(region, obj, validatedTiles, undefined);
			}
			
		});
		
	}
	
	//toggle hints
	this.toggleValidation = function() {
		
		this.validated = (this.validated) ? false : true;
		
		this.updateView();
		
	}
	
	//check win condition
	this.checkWin = function() {
		
		var flag = true;
		
		this.regions.forEach(function(region) {

			region.tiles.forEach(function(tile) {

				//check guess against answer and confirm only 1 guess made per tile
				if((tile.guesses.length != 1) || (tile.guesses[0] != tile.answer))
					flag = false;
				
			});
			
		});
		
		this.win = flag;
		
	}
	
	//start timer
	this.startTimer = function() {
		
		var scope = this;
		
		this.stop = setInterval(function() {
			if(scope.win) {
				scope.stop = undefined;
				return true;
			}
				
			scope.timer++;
			
			scope.updateView();
		}, 1000);
		
	}
	
	//Reset board to start
	this.reset = function() {
		
		this.timer = 0;
		clearInterval(this.stop);
		this.stop = undefined;
		this.win = false;
		
		if(this.loaded)
			this.startTimer();
		
		this.regions.forEach(function(region) {
			region.reset();
		});
		
		this.updateView();
		
	}
	
	this.reset();
	this.init();
}
function Option(number) {
	this.number = number;
	this.obj = $("<div class = 'option'>\
		<div class = 'resp'>\
			<div class = 'v-align'>\
				<span>" + this.number + "</span>\
			</div>\
		</div>\
	</div>");
	this.enable = true;
	this.selected = null;
	
	/* public methods */
	
	//toggle option selected
	this.select = function() {	
		this.selected = (this.selected) ? false : true;
	}
	
	//reset option
	this.reset = function() {
		this.selected = false;		
	}
		
	this.reset();
}
function Region(id) {
	this.id = id;
	this.obj = $("<div class = 'region'>\
		<div class = 'resp'></div>\
	</div>");
	this.obj_inner = '.resp';
	this.tiles = [];
	
	//init region
	this.init = function() {
		
		for(var i = 8; i >= 0; i--) {
			this.tiles[i] = new Tile(i, 0, false);
			this.obj.children(this.obj_inner).prepend(this.tiles[i].obj);
		}
		
	}
	
	//load region
	this.load = function(data) {
		
		var scope = this;
        	
    	data.forEach(function(obj, i) {
        	
            scope.tiles[i].load(obj);
            
            scope.updateView();
        	
        });
		
	}
	
	//update view
	this.updateView = function() {}
	
	//get region row
	this.getRow = function() {
		return Math.ceil((this.id-1)/3+0.5)-1;
	}
	
	//get region col
	this.getCol = function() {
		return this.id%3;
	}
	
	//hide open tile options
	this.hideTileOptions = function() {
		
		this.tiles.forEach(function(tile) {
			tile.hideOptions();
		});
		
	}
	
	//select tile option
	this.selectTileOption = function(tile, option) {
		
		tile.selectOption(option);
			
	}
	
	//validate region against option
	this.validateTile = function(tile, number) {
		
		var tiles = []
		
		this.tiles.forEach(function(obj) {
			
			if(obj != tile)
				tiles.push(obj);
			
		});
		
		return this.validateTileSet(tile, number, tiles);
		
	}
	
	//validate row against option
	this.validateTileRow = function(tile, number) {

		var tiles = [];
		
		for(var i = 0; i < 3; i++)
			if(this.tiles[tile.getRow()*3+i].guesses.length > 0)
				tiles.push(this.tiles[tile.getRow()*3+i]);
		
		return this.validateTileSet(tile, number, tiles);
		
	}
	
	//validate col against option
	this.validateTileCol = function(tile, number) {
		
		var tiles = [];
		
		for(var i = 0; i < 3; i++) 
			if(this.tiles[tile.getCol()+i*3].guesses.length > 0)
				tiles.push(this.tiles[tile.getCol()+i*3]);
		
		return this.validateTileSet(tile, number, tiles);
		
	}
	
	//validate tile set against option
	this.validateTileSet = function(tile, number, tileSet) {
		
		//matched tile set
		var invalidSet = [];
		
		//for each tile
		tileSet.forEach(function(tile) {
			
			//for each guess
			tile.guesses.forEach(function(guess) {
				
				//if the option number equals the only guess
				if(number == guess)
					invalidSet.push(tile);
			
			});
			
		});
		
		return invalidSet;
		
	}
	
	//reset region
	this.reset = function() {
		
		this.valid = true;
		
		//reset tiles
		this.tiles.forEach(function(tile) {
			tile.reset();
		});
		
		this.updateView();
		
	}

	this.reset();
	this.init();
}
function Tile(id, answer, lock) {
	this.id = id;
	this.obj = $("<div class = 'tile'>\
		<div class = 'resp'>\
			<div class = 'v-align options-toggle'>\
				<span class = 'guess'></span>\
				<div class = 'options'></div>\
				<div class = 'caret'></div>\
			</div>\
		</div>\
	</div>");
	this.obj_inner = '.options';
	this.answer = answer;
	this.lock = lock;
	this.guesses = null;
	this.showingOptions = null;
	this.options = [];
	this.valid = true;
	
	var guess_obj = $(this.obj).find('.guess');
	var options_obj = $(this.obj).find('.options');
	var options_toggle_obj = $(this.obj).find('.options-toggle');
	
	//init tile
	this.init = function() {
		
		for(var i = 8; i >= 0; i--) {
			this.options[i] = new Option(i+1);
			this.obj.find(this.obj_inner).prepend(this.options[i].obj);
		}
		
	}
	
	//load tile
	this.load = function(data) {
        
        this.answer = data.val;
        this.lock = data.def;
        
        /* events */
		options_toggle_obj.on('click', { scope: this }, function(e) {
			e.data.scope.showOptions();
		});
		
        this.reset();
		
	}
	
	//update view
	this.updateView = function() {
		
		//update lock
		if(this.lock && !this.obj.hasClass('locked'))
			this.obj.addClass('locked');
		
		//update show options
		if(this.showingOptions && !options_obj.hasClass('show'))
			options_obj.addClass('show');
		else if(!this.showingOptions && options_obj.hasClass('show'))
			options_obj.removeClass('show');
		
		//update tile validity
		if(!this.valid && !this.obj.hasClass('invalid'))
			this.obj.addClass('invalid');
		else if(this.valid && this.obj.hasClass('invalid'))
			this.obj.removeClass('invalid');
		
		//update guesses
		if(this.guesses.length == 1)
			guess_obj.html(this.guesses[0]);
		
	}
	
	//get tile row
	this.getRow = function() {
		return Math.ceil((this.id-1)/3+0.5)-1;
	}
	
	//get tile col
	this.getCol = function() {
		return this.id%3;
	}
	
	//show tile options
	this.showOptions = function() {

		if(this.lock) return true;
		
		this.showingOptions = true;
		
		this.updateView();
		
	}

	//hide tile options
	this.hideOptions = function() {
		
		if(this.guesses.length > 1) return false;
		
		this.showingOptions = false;
		
		this.updateView();
		
	}
	
	//select tile option
	this.selectOption = function(option) {
		
		option.select();

		this.updateGuess(option);
		
	}
	
	//update guess
	this.updateGuess = function(option) {
		
		if(option.selected) {
			
			this.guesses.push(option.number)				
			
		} else {
			
			var index = this.guesses.indexOf(option.number);
			this.guesses.splice(index,1);
			
		}
		
		this.updateView();
			
	}
	
	//reset tile
	this.reset = function() {
		
		//reset guess
		this.guesses = (this.lock) ? [this.answer] : [];
		this.showingOptions = false;
		this.valid = true;
		
		//reset options
		this.options.forEach(function(option) {
			option.reset();
		});
		
		this.updateView();
		
	}
	
	this.reset();
	this.init();
}
//convert seconds to mm:ss format
/*var filterTime = function() {
	return function(seconds) {
		
		var mins = Math.floor(seconds/60);
		var secs = Math.floor(seconds%60);
		
		//add leading zero
		secs = (secs.toString().length < 2) ? '0' + secs : secs;

		return mins + ':' + secs;
		
	}
}

app.filter('filterTime', filterTime);*/