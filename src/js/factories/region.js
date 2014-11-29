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
		validate: function(tile, option) {
			
			this.validateTileSet(tile, option, this.tiles, 1);
			
		},
		
		validateTileRow: function(tile, option) {

			var tiles = [];
			
			for(var i = 0; i < 3; i++)
				tiles.push(this.tiles[tile.getRow()*3+i]);
			
			this.validateTileSet(tile, option, tiles, (!option.selected) ? 1 : 0);
			
		},
		
		validateTileCol: function(tile, option) {
			
			var tiles = [];
			
			for(var i = 0; i < 3; i++)
				tiles.push(this.tiles[(i*3)+tile.getCol()]);
			
			this.validateTileSet(tile, option, tiles, (!option.selected) ? 1 : 0);
			
		},
		
		//validate tile set against option
		validateTileSet: function(tile, option, tileSet, threshold) {
			
			//matched tile set
			var set = [];
			
			//for each tile
			tileSet.forEach(function(tile) {
				
				//for each guess
				tile.guesses.forEach(function(guess) {
					
					//if the option number equals the only guess
					if(option.number == guess)
						set.push(tile);
				
				});
				
			});
			
			//if there is more than 1 match in the set
			var valid = (set.length > threshold) ? false : true;
			
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