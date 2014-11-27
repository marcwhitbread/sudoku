app.factory('Tile', [function() {
	
	//constructor
	var Tile = function(answer, lock) {
		this.answer = answer;
		this.lock = lock;
		this.guess = (lock) ? answer : null;
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