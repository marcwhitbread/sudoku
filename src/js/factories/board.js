app.factory('Board', ['$http', 'Region', function($http, Region) {
	
	//constructor
	var Board = function() {
		this.regions = [];
		this.validated = true;
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
			this.validateTile(region, tile, option, []);
				
		},
		
		//validate update to board
		validateTile: function(region, tile, option, validatedTiles) {
			
			var scope = this;
			
			//validate region
			var invalidSet = region.validateTile(tile, option);
			
			this.validateSet(region, tile, option, invalidSet, validatedTiles);
			
			//validate rows/cols
			for(var i = 0; i < 3; i++) {
			
				var colRegion = this.regions[region.getCol()+i*3];
				var rowRegion = this.regions[region.getRow()*3+i];

				if(colRegion != region) {
					
					var invalidSet = colRegion.validateTileCol(tile, option);
					
					this.validateSet(colRegion, tile, option, invalidSet, validatedTiles);
					
				}
				
				if(rowRegion != region) {
					
					var invalidSet = rowRegion.validateTileRow(tile, option);
					
					this.validateSet(rowRegion, tile, option, invalidSet, validatedTiles);
					
				}
					
			}
			
			if(tile.guesses.length == 0) {
				tile.valid = true;
			}
			
		},
		
		validateSet: function(region, tile, option, invalidSet, validatedTiles) {

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
					scope.validateTile(region, obj, option, validatedTiles);
				}
				
			});
			
		},
		
		//toggle hints
		toggleValidation: function() {
			
			this.validated = (this.validated) ? false : true;
			
		},
		
		//Reset board to start
		reset: function() {
			
			this.regions.forEach(function(region) {
				region.reset();
			});
			
		}
		
	}
	
	return Board;
	
}]);