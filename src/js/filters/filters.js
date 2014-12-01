//convert seconds to mm:ss format
/*var filterTime = function() {
	return function(seconds) {
		
		var mins = Math.floor(seconds/60);
		var secs = Math.floor(seconds%60);
		
		//add leading zero
		secs = (secs.toString().length < 2) ? '0' + secs : secs;

		return mins + ':' + secs;
		
	}
}

app.filter('filterTime', filterTime);*/