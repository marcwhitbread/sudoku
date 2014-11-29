'use strict';

var app = angular.module('sudoku', []);
app.controller('mainCtrl', ['$scope', 'Board', 'Region', 'Tile', function($scope, Board, Region, Tile) {
	
	$scope.board = new Board();
	$scope.board.loadDefault();
	
}]);
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
app.factory('Option', [function() {
	
	//constructor
	var Option = function(number) {
		this.number = number;
		this.enable = true;
		this.selected = null;
		
		this.reset();
	}
	
	//public methods
	Option.prototype = {
		
		//toggle option selected
		select: function() {
			
			this.selected = (this.selected) ? false : true;
			
		},
		
		//reset option
		reset: function() {
			
			this.selected = false;
			
		}
		
	}
	
	return Option;
	
}]);
app.factory('Region', ['Tile', function(Tile) {
	
	//constructor
	var Region = function(id) {
		this.id = id;
		this.tiles = [];
		
		this.reset();
	}
	
	//public methods
	Region.prototype = {
		
		//load board
		load: function(data) {
			
			var scope = this;
            	
        	data.forEach(function(obj, i) {
	        	
            	var tile = new Tile(i, obj.val, obj.def);
	            scope.tiles.push(tile);
            	
            });
			
		},
		
		//get region row
		getRow: function() {
			return Math.ceil((this.id-1)/3+0.5)-1;
		},
		
		//get region col
		getCol: function() {
			return this.id%3;
		},
		
		//hide open tile options
		hideTileOptions: function() {
			
			this.tiles.forEach(function(tile) {
				tile.hideOptions();
			});
			
		},
		
		//select tile option
		selectTileOption: function(tile, option) {
			
			tile.selectOption(option);
				
		},
		
		//validate region against option
		validateTile: function(tile, option) {
			
			var tiles = []
			
			this.tiles.forEach(function(obj) {
				
				if(obj != tile)
					tiles.push(obj);
				
			});
			
			return this.validateTileSet(tile, option, tiles);
			
		},
		
		//validate row against option
		validateTileRow: function(tile, option) {

			var tiles = [];
			
			for(var i = 0; i < 3; i++)
				if(this.tiles[tile.getRow()*3+i].guesses.length > 0)
					tiles.push(this.tiles[tile.getRow()*3+i]);
			
			return this.validateTileSet(tile, option, tiles);
			
		},
		
		//validate col against option
		validateTileCol: function(tile, option) {
			
			var tiles = [];
			
			for(var i = 0; i < 3; i++) 
				if(this.tiles[tile.getCol()+i*3].guesses.length > 0)
					tiles.push(this.tiles[tile.getCol()+i*3]);
			
			return this.validateTileSet(tile, option, tiles);
			
		},
		
		//validate tile set against option
		validateTileSet: function(tile, option, tileSet) {
			
			//matched tile set
			var invalidSet = [];
			
			//for each tile
			tileSet.forEach(function(tile) {
				
				//for each guess
				tile.guesses.forEach(function(guess) {
					
					//if the option number equals the only guess
					if(option.number == guess)
						invalidSet.push(tile);
				
				});
				
			});
			
			return invalidSet;
			
		},
		
		//reset region
		reset: function() {
			
			this.valid = true;
			
			//reset tiles
			this.tiles.forEach(function(tile) {
				tile.reset();
			});
			
		}
		
	}
	
	return Region;
	
}]);
app.factory('Tile', ['Option', function(Option) {
	
	//constructor
	var Tile = function(id, answer, lock) {
		this.id = id;
		this.answer = answer;
		this.lock = lock;
		this.guesses = null;
		this.showingOptions = null;
		this.options = [];
		this.valid = true;
		
		for(var i = 0; i < 9; i++) {
			this.options.push(new Option(i+1));
		}
		
		this.reset();
	}
	
	//public methods
	Tile.prototype = {
		
		//get tile row
		getRow: function() {
			return Math.ceil((this.id-1)/3+0.5)-1;
		},
		
		//get tile col
		getCol: function() {
			return this.id%3;
		},

		//show tile options
		showOptions: function() {
			
			this.showingOptions = true;
			
		},
		
		//hide tile options
		hideOptions: function() {
			
			if(this.guesses.length > 1) return false;
			
			this.showingOptions = false;
			
		},
		
		//select tile option
		selectOption: function(option) {
		
			option.select();

			this.updateGuess(option);
			
		},
		
		updateGuess: function(option) {
			
			if(option.selected) {
				
				this.guesses.push(option.number)				
				
			} else {
				
				var index = this.guesses.indexOf(option.number);
				this.guesses.splice(index,1);
				
			}
				
		},
		
		//reset tile
		reset: function() {
			
			//reset guess
			this.guesses = (this.lock) ? [this.answer] : [];
			this.showingOptions = false;
			this.valid = true;
			
			//reset options
			this.options.forEach(function(option) {
				option.reset();
			});
			
		}
		
	}
	
	return Tile;
	
}]);