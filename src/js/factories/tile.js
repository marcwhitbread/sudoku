app.factory('Tile', ['Option', function(Option) {
	
	//constructor
	var Tile = function(answer, lock) {
		this.answer = answer;
		this.lock = lock;
		this.guess = null;
		this.showingOptions = null;
		this.options = [];
		
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
		
			this.showingOptions = false;
			
		},
		
		//reset tile
		reset: function() {
			
			//reset guess
			this.guess = (this.lock) ? this.answer : null;
			this.showingOptions = false;
			
			//reset options
			this.options.forEach(function(option) {
				option.reset();
			});
			
		}
		
	}
	
	return Tile;
	
}]);