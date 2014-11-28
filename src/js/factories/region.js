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