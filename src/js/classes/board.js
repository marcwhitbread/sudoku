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
			this.regions[i] = new Region(i, this);
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
	
	//update view timer
	this.updateTimer = function() {
		
		global_timer_obj.html(this.formatTime());
		
	}
	
	//update view
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