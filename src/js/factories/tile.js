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