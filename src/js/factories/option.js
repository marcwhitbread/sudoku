var Option = function(number) {
	this.number = number;
	this.enable = true;
	this.selected = null;
	
	/* public methods */
	
	//toggle option selected
	this.select = function() {	
		this.selected = (this.selected) ? false : true;
	}
	
	//reset option
	this.reset = function() {
		this.selected = false;		
	}
		
	this.reset();
}