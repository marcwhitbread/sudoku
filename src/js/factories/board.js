app.factory('Board', ['$http', '$interval', 'Region', function($http, $interval, Region) {
	
	//constructor
	var Board = function() {
		this.regions = [];
		this.validated = true;
		this.timer;
		this.stop;
		
		this.reset();
	}
	
	//public methods
	Board.prototype = {
		
		//load board
		loadDefault: function() {
			
			var scope = this;
			
			$http.get('js/data/puzzle.js').success(function(data) {
            	
            	data.forEach(function(obj, i) {

	            	var region = new Region(i);
	            	region.load(obj.region);
	            	
	            	scope.regions.push(region);
	            	
            	});
            	
            });
			
		},
		
		//load random board
		loadRandom: function() {
			
			//TBD if time permits
			
		},
		
		//hide open tile options
		hideTileOptions: function() {
			
			this.regions.forEach(function(region) {
				region.hideTileOptions();
			});
			
		},
		
		//select tile option
		selectTileOption: function(region, tile, option) {
			
			region.selectTileOption(tile, option);
			
			//begin validation
			this.validateTile(region, tile, [], option);
				
		},
		
		//validate update to board
		validateTile: function(region, tile, validatedTiles, option) {
			
			var scope = this;
			
			if(option && !option.selected)
				scope.validateGuess(region, tile, option.number, validatedTiles);
			
			tile.guesses.forEach(function(guess) {
				scope.validateGuess(region, tile, guess, validatedTiles);
			});
			
			if(tile.guesses.length == 0) {
				tile.valid = true;
			}
			
		},
		
		validateGuess: function(region, tile, guess, validatedTiles) {
			
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
				
		},
		
		validateSet: function(region, tile, number, invalidSet, validatedTiles) {

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
			
		},
		
		//toggle hints
		toggleValidation: function() {
			
			this.validated = (this.validated) ? false : true;
			
		},
		
		//start timer
		startTimer: function() {
			
			var scope = this;
			
			this.stop = $interval(function() {
				scope.timer++;
			}, 1000);
			
		},
		
		//Reset board to start
		reset: function() {
			
			this.timer = 0;
			this.stop = undefined;
			
			this.startTimer();
			
			this.regions.forEach(function(region) {
				region.reset();
			});
			
		}
		
	}
	
	return Board;
	
}]);