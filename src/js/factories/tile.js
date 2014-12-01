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
	
	//load tile
	this.load = function(data) {
        
        this.answer = data.val;
        this.lock = data.def;
        
        this.reset();
		
	}
	
	//get tile row
	this.getRow = function() {
		return Math.ceil((this.id-1)/3+0.5)-1;
	}
	
	//get tile col
	this.getCol = function() {
		return this.id%3;
	}
	
	//show tile options
	this.showOptions = function() {
		
		this.showingOptions = true;
		
	}

	//hide tile options
	this.hideOptions = function() {
		
		if(this.guesses.length > 1) return false;
		
		this.showingOptions = false;
		
	}
	
	//select tile option
	this.selectOption = function(option) {
	
		option.select();

		this.updateGuess(option);
		
	}
	
	//update guess
	this.updateGuess = function(option) {
		
		if(option.selected) {
			
			this.guesses.push(option.number)				
			
		} else {
			
			var index = this.guesses.indexOf(option.number);
			this.guesses.splice(index,1);
			
		}
			
	}
	
	//reset tile
	this.reset = function() {
		
		//reset guess
		this.guesses = (this.lock) ? [this.answer] : [];
		this.showingOptions = false;
		this.valid = true;
		
		//reset options
		this.options.forEach(function(option) {
			option.reset();
		});
		
	}
	
	this.reset();
}