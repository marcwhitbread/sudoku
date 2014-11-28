app.factory('Tile', ['Option', function(Option) {
	
	//constructor
	var Tile = function(id, answer, lock) {
		this.id = id;
		this.answer = answer;
		this.lock = lock;
		this.guesses = null;
		this.showingOptions = null;
		this.options = [];
		this.valid = true;
		
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
			
			if(this.guesses.length > 1) return false;
			
			this.showingOptions = false;
			
		},
		
		//select tile option
		selectOption: function(option) {
		
			option.select();

			this.updateGuess(option);
			
		},
		
		updateGuess: function(option) {
			
			if(option.selected) {
				
				this.guesses.push(option.number)				
				
			} else {
				
				var index = this.guesses.indexOf(option.number);
				this.guesses.splice(index,1);
				
			}
				
		},
		
		//reset tile
		reset: function() {
			
			//reset guess
			this.guesses = (this.lock) ? [this.answer] : [];
			this.showingOptions = false;
			this.valid = true;
			
			//reset options
			this.options.forEach(function(option) {
				option.reset();
			});
			
		}
		
	}
	
	return Tile;
	
}]);