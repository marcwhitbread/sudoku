function Tile(id, answer, lock) {
	this.id = id;
	this.obj = $("<div class = 'tile'>\
		<div class = 'resp'>\
			<div class = 'v-align options-toggle'>\
				<span class = 'guess'></span>\
				<div class = 'options'></div>\
				<div class = 'caret'></div>\
			</div>\
		</div>\
	</div>");
	this.obj_inner = '.options';
	this.answer = answer;
	this.lock = lock;
	this.guesses = null;
	this.showingOptions = null;
	this.options = [];
	this.valid = true;
	
	var guess_obj = $(this.obj).find('.guess');
	var options_obj = $(this.obj).find('.options');
	var options_toggle_obj = $(this.obj).find('.options-toggle');
	
	//init tile
	this.init = function() {
		
		for(var i = 8; i >= 0; i--) {
			this.options[i] = new Option(i+1);
			this.obj.find(this.obj_inner).prepend(this.options[i].obj);
		}
		
	}
	
	//load tile
	this.load = function(data) {
        
        this.answer = data.val;
        this.lock = data.def;
        
        /* events */
		options_toggle_obj.on('click', { scope: this }, function(e) {
			e.data.scope.showOptions();
		});
		
        this.reset();
		
	}
	
	//update view
	this.updateView = function() {
		
		//update lock
		if(this.lock && !this.obj.hasClass('locked'))
			this.obj.addClass('locked');
		
		//update show options
		if(this.showingOptions && !options_obj.hasClass('show'))
			options_obj.addClass('show');
		else if(!this.showingOptions && options_obj.hasClass('show'))
			options_obj.removeClass('show');
		
		//update tile validity
		if(!this.valid && !this.obj.hasClass('invalid'))
			this.obj.addClass('invalid');
		else if(this.valid && this.obj.hasClass('invalid'))
			this.obj.removeClass('invalid');
		
		//update guesses
		if(this.guesses.length == 1)
			guess_obj.html(this.guesses[0]);
		
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

		if(this.lock) return true;
		
		this.showingOptions = true;
		
		this.updateView();
		
	}

	//hide tile options
	this.hideOptions = function() {
		
		if(this.guesses.length > 1) return false;
		
		this.showingOptions = false;
		
		this.updateView();
		
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
		
		this.updateView();
			
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
		
		this.updateView();
		
	}
	
	this.reset();
	this.init();
}