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