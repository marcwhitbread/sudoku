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
			
		},
		
		//hide open tile options
		hideTileOptions: function() {
			
			this.tiles.forEach(function(tile) {
				tile.hideOptions();
			});
			
		},
		
		//reset region
		reset: function() {
			
			this.tiles.forEach(function(tile) {
				tile.reset();
			});
			
		}
		
	}
	
	return Region;
	
}]);