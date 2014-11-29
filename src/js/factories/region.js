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