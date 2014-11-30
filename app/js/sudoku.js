'use strict';

var app = angular.module('sudoku', []);
app.controller('mainCtrl', ['$scope', 'Board', 'Region', 'Tile', function($scope, Board, Region, Tile) {
	
	$scope.board = new Board();
	
}]);
app.factory('Board', ['$http', '$interval', 'Region', function($http, $interval, Region) {
	
	//constructor
	var Board = function() {
		this.regions = [];
		this.validated = true;
		this.timer;
		this.stop;
		this.win;
		this.loaded;
		
		this.reset();
		this.init();
	}
	
	//public methods
	Board.prototype = {
		
		//init board
		init: function() {
			
			for(var i = 0; i < 9; i++) {
				this.regions.push(new Region(i));
			}
			
		},
		
		//load board
		loadDefault: function() {
			
			this.loaded = true;
			
			var scope = this;
			
			$http.get('js/data/puzzle.js').success(function(data) {
            	
            	data.forEach(function(obj, i) {
	            	
	            	scope.regions[i].load(obj.region);
	            	
            	});
            	
            	scope.reset();
            	
            });
			
		},
		
		//load random board
		loadRandom: function() {
			
			this.loaded = true;
			this.startTimer();
			
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
			
			this.win = this.checkWin();
				
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
		
		//validate single guess
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
		
		//validate set of tiles
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
		
		//check win condition
		checkWin: function() {
			
			var flag = true;
			
			this.regions.forEach(function(region) {

				region.tiles.forEach(function(tile) {

					//check guess against answer and confirm only 1 guess made per tile
					if((tile.guesses.length != 1) || (tile.guesses[0] != tile.answer))
						flag = false;
					
				});
				
			});
			
			return flag;
			
		},
		
		//start timer
		startTimer: function() {
			
			var scope = this;
			
			this.stop = $interval(function() {
				if(scope.win) {
					scope.stop = undefined;
					return true;
				}
					
				scope.timer++;
			}, 1000);
			
		},
		
		//Reset board to start
		reset: function() {
			
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
		this.init();
	}
	
	//public methods
	Region.prototype = {
		
		//init region
		init: function() {
			
			for(var i = 0; i < 9; i++) {
				this.tiles.push(new Tile(i, 0, false));
			}
			
		},
		
		//load region
		load: function(data) {
			
			var scope = this;
            	
        	data.forEach(function(obj, i) {
	        	
	            scope.tiles[i].load(obj);
            	
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
		validateTile: function(tile, number) {
			
			var tiles = []
			
			this.tiles.forEach(function(obj) {
				
				if(obj != tile)
					tiles.push(obj);
				
			});
			
			return this.validateTileSet(tile, number, tiles);
			
		},
		
		//validate row against option
		validateTileRow: function(tile, number) {

			var tiles = [];
			
			for(var i = 0; i < 3; i++)
				if(this.tiles[tile.getRow()*3+i].guesses.length > 0)
					tiles.push(this.tiles[tile.getRow()*3+i]);
			
			return this.validateTileSet(tile, number, tiles);
			
		},
		
		//validate col against option
		validateTileCol: function(tile, number) {
			
			var tiles = [];
			
			for(var i = 0; i < 3; i++) 
				if(this.tiles[tile.getCol()+i*3].guesses.length > 0)
					tiles.push(this.tiles[tile.getCol()+i*3]);
			
			return this.validateTileSet(tile, number, tiles);
			
		},
		
		//validate tile set against option
		validateTileSet: function(tile, number, tileSet) {
			
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
		
		//load tile
		load: function(data) {
            
            this.answer = data.val;
            this.lock = data.def;
            
            this.reset();
			
		},
		
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
//convert seconds to mm:ss format
var filterTime = function() {
	return function(seconds) {
		
		var mins = Math.floor(seconds/60);
		var secs = Math.floor(seconds%60);
		
		//add leading zero
		secs = (secs.toString().length < 2) ? '0' + secs : secs;

		return mins + ':' + secs;
		
	}
}

app.filter('filterTime', filterTime);