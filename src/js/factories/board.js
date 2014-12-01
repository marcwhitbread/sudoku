var Board = function() {
	this.regions = [];
	this.validated = true;
	this.timer;
	this.stop;
	this.win;
	this.loaded;
	
	//init board
	this.init = function() {
		
		for(var i = 0; i < 9; i++) {
			this.regions.push(new Region(i));
		}
		
	}
	
	//load board
	this.loadDefault = function() {
		
		this.loaded = true;
		
		var scope = this;
		
		$http.get('js/data/puzzle.js').success(function(data) {
        	
        	data.forEach(function(obj, i) {
            	
            	scope.regions[i].load(obj.region);
            	
        	});
        	
        	scope.reset();
        	
        });
		
	}
	
	//load random board
	this.loadRandom = function() {
		
		this.loaded = true;
		this.startTimer();
		
		//TBD if time permits
		
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
		
		this.win = this.checkWin();
			
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
		
		return flag;
		
	}
	
	//start timer
	this.startTimer = function() {
		
		var scope = this;
		
		this.stop = $interval(function() {
			if(scope.win) {
				scope.stop = undefined;
				return true;
			}
				
			scope.timer++;
		}, 1000);
		
	}
	
	//Reset board to start
	this.reset = function() {
		
		this.timer = 0;
		$interval.cancel(this.stop);
		this.stop = undefined;
		this.win = false;
		
		if(this.loaded)
			this.startTimer();
		
		this.regions.forEach(function(region) {
			region.reset();
		});
		
	}
	
	this.reset();
	this.init();
}