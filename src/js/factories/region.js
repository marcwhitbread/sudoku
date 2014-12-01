function Region(id) {
	this.id = id;
	this.obj = $("<div class = 'region'>\
		<div class = 'resp'></div>\
	</div>");
	this.obj_inner = '.resp';
	this.tiles = [];
	
	//init region
	this.init = function() {
		
		for(var i = 8; i >= 0; i--) {
			this.tiles[i] = new Tile(i, 0, false);
			this.obj.children(this.obj_inner).prepend(this.tiles[i].obj);
		}
		
	}
	
	//load region
	this.load = function(data) {
		
		var scope = this;
        	
    	data.forEach(function(obj, i) {
        	
            scope.tiles[i].load(obj);
            
            scope.updateView();
        	
        });
		
	}
	
	//update view
	this.updateView = function() {}
	
	//get region row
	this.getRow = function() {
		return Math.ceil((this.id-1)/3+0.5)-1;
	}
	
	//get region col
	this.getCol = function() {
		return this.id%3;
	}
	
	//hide open tile options
	this.hideTileOptions = function() {
		
		this.tiles.forEach(function(tile) {
			tile.hideOptions();
		});
		
	}
	
	//select tile option
	this.selectTileOption = function(tile, option) {
		
		tile.selectOption(option);
			
	}
	
	//validate region against option
	this.validateTile = function(tile, number) {
		
		var tiles = []
		
		this.tiles.forEach(function(obj) {
			
			if(obj != tile)
				tiles.push(obj);
			
		});
		
		return this.validateTileSet(tile, number, tiles);
		
	}
	
	//validate row against option
	this.validateTileRow = function(tile, number) {

		var tiles = [];
		
		for(var i = 0; i < 3; i++)
			if(this.tiles[tile.getRow()*3+i].guesses.length > 0)
				tiles.push(this.tiles[tile.getRow()*3+i]);
		
		return this.validateTileSet(tile, number, tiles);
		
	}
	
	//validate col against option
	this.validateTileCol = function(tile, number) {
		
		var tiles = [];
		
		for(var i = 0; i < 3; i++) 
			if(this.tiles[tile.getCol()+i*3].guesses.length > 0)
				tiles.push(this.tiles[tile.getCol()+i*3]);
		
		return this.validateTileSet(tile, number, tiles);
		
	}
	
	//validate tile set against option
	this.validateTileSet = function(tile, number, tileSet) {
		
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
		
	}
	
	//reset region
	this.reset = function() {
		
		this.valid = true;
		
		//reset tiles
		this.tiles.forEach(function(tile) {
			tile.reset();
		});
		
		this.updateView();
		
	}

	this.reset();
	this.init();
}