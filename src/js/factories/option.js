function Option(number) {
	this.number = number;
	this.obj = $("<div class = 'option'>\
		<div class = 'resp'>\
			<div class = 'v-align'>\
				<span>" + this.number + "</span>\
			</div>\
		</div>\
	</div>");
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