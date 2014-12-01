function Option(number, tile) {
	this.number = number;
	this.tile = tile;
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
	this.init = function() {
		
		this.obj.on('click', { scope: this }, function(e) {
			
			//if not open
			if(!e.data.scope.tile.showingOptions) return true;
			
			e.data.scope.tile.region.board.selectTileOption(e.data.scope.tile.region, e.data.scope.tile, e.data.scope);
			
		});
			
	}
	
	this.updateView = function() {
		
		//update selected
		if(this.selected && !this.obj.hasClass('selected'))
			this.obj.addClass('selected')
		else if(!this.selected && this.obj.hasClass('selected'))
			this.obj.removeClass('selected')
		
	}
	
	//toggle option selected
	this.select = function() {
		this.selected = (this.selected) ? false : true;
		
		this.updateView();
	}
	
	//reset option
	this.reset = function() {
		this.selected = false;		
		
		this.updateView();
	}
		
	this.reset();
	this.init();
}