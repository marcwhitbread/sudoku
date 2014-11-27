app.factory('Option', [function() {
	
	//constructor
	var Option = function(number) {
		this.number = number;
		this.enable = true;
		this.selected = false;
	}
	
	//public methods
	Option.prototype = {
		
		//toggle option selected
		select: function() {
			
			this.selected = (this.selected) ? false : true;
			
		},
		
		//reset option
		reset: function() {
			
			this.selected = false;
			
		}
		
	}
	
	return Option;
	
}]);