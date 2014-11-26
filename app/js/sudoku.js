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
	}
	
	//public methods
	Board.prototype = {
		
		//load board
		loadDefault: function() {
			
			var scope = this;
			
			$http.get('js/data/puzzle.js').success(function(data) {
            	
            	data.forEach(function(obj) {

	            	var region = new Region();
	            	region.load(obj.region);
	            	
	            	scope.regions.push(region);
	            	
            	});
            	
            });
			
		},
		
		//load random board
		loadRandom: function() {
			
			//TBD if time permits
			
		}
		
	}
	
	return Board;
	
}]);
app.factory('Region', ['Tile', function(Tile) {
	
	//constructor
	var Region = function() {
		this.tiles = [];
	}
	
	//public methods
	Region.prototype = {
		
		//load board
		load: function(data) {
			
			var scope = this;
            	
        	data.forEach(function(obj) {
	        	
            	var tile = new Tile(obj.val, obj.def);
	            scope.tiles.push(tile);
            	
            });
			
		}
		
	}
	
	return Region;
	
}]);
app.factory('Tile', [function() {
	
	//constructor
	var Tile = function(val, def) {
		this.val = (val != 0) ? val : null;
		this.def = def;
	}
	
	//public methods
	Tile.prototype = {
		
		//set the tile value
		setValue: function(val) {
			
			//check if editable
			if(!this.def) this.val = val;
			
		}
		
	}
	
	return Tile;
	
}]);