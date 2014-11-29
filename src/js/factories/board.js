app.factory('Board', ['$http', 'Region', function($http, Region) {
	
	//constructor
	var Board = function() {
		this.regions = [];
		this.validated = true;
	}
	
	//public methods
	Board.prototype = {
		
		//load board
		loadDefault: function() {
			
			var scope = this;
			
			$http.get('js/data/puzzle.js').success(function(data) {
            	
            	data.forEach(function(obj, i) {

	            	var region = new Region(i);
	            	region.load(obj.region);
	            	
	            	scope.regions.push(region);
	            	
            	});
            	
            });
			
		},
		
		//load random board
		loadRandom: function() {
			
			//TBD if time permits
			
		},
		
		//hide open tile options
		hideTileOptions: function() {
			
			this.regions.forEach(function(region) {
				region.hideTileOptions();
			});
			
		},
		
		//select tile option
		selectTileOption: function(region, tile, option) {
		
			region.selectTileOption(tile, option);
			
			this.validate(region, tile, option);
				
		},
		
		//validate update to board
		validate: function(region, tile, option) {
			
			//validate region
			region.validate(tile, option);
			
			//validate rows/cols
			for(var i = 0; i < 3; i++) {
				
				if(this.regions[region.getRow()*3+i] != region)
					this.regions[region.getRow()*3+i].validateTileRow(tile, option);
				
				if(this.regions[(i*3)+region.getCol()] != region)
					this.regions[(i*3)+region.getCol()].validateTileCol(tile, option);
					
			}
			
		},
		
		//toggle hints
		toggleValidation: function() {
			
			this.validated = (this.validated) ? false : true;
			
		},
		
		//Reset board to start
		reset: function() {
			
			this.regions.forEach(function(region) {
				region.reset();
			});
			
		}
		
	}
	
	return Board;
	
}]);