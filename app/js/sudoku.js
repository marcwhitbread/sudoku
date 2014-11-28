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
		this.validate = true;
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
			
			region.validate(option);
				
		},
		
		//toggle hints
		toggleValidation: function() {
			
			this.validate = (this.validate) ? false : true;
			
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
		
		//validate region againstv option
		validate: function(option) {

			//matched tile set
			var set = [];
			
			//build tile query set
			var tiles = this.tiles;
			
			//for each tile
			tiles.forEach(function(tile) {

				//if the option number equals the only guess
				if((option.number == tile.guesses[0]) && (tile.guesses.length == 1)) {
					set.push(tile);
				}
				
			});
			
			//if there is more than 1 match in the set
			var valid = (set.length > 1) ? false : true;
			
			//set valid flag
			set.forEach(function(obj) {
				obj.valid = valid;
			});
			
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