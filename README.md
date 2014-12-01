<h1>Sudoku</h1>

	<p>A logic based, combinatorial number-placement puzzle.</p>
	
	<ul>
		<li>Developer: Marc Whitbread</li>
		<li>Developer URL: http://marcwhitbread.com/</li>
		<li>Project URL: http://marcwhitbread.com/sudoku/</li>
	</ul>
	
	<h2>Features</h2>
	
		<h3>Timer</h3>
	
			<p>To time how quickly the player can finish the puzzle.</p>
	
		<h3>Reset</h3>
	
			<p>To allow the user to restart the puzzle.</p>
	
		<h3>Validation</h3>
	
			<p>To optionally allow the user instant feedback from the board if has any values conflicting with any other tile in it's region, row, or column.</p>
		
		<h3>CSS3 Fluid Layout</h3>
	
			<p>Employed the use of viewport units for a seamless experience across supported devices.</p>
			
		<h3>Puzzle Generator</h3>
		
			<p>TBD</p>

	<h2>Technologies Used</h2>
		
		<h3>Grunt</h3>
		
			<p>Automated LESS compilation, JS concatenation and minification.</p>
		
		<h3>AngularJS</h3>
		
			<p>MVC framework leveraged solely for 2 way model-view binding to reduce testing time that would have been impacted UI updates with jQuery.</p>
		
		<h3>LESS</h3>
		
			<p>Simplify and organize CSS code. Mixins used to simplify cross-browser prefix specific CSS attributes (transform, border-radius, transition).</p>
			
		<h3>AJAX/JSON</h3>
		
			<p>External storage and data model of default puzzle.</p>
			
			<p>Trade off:</p>
			
			<ul>
				<li>Separating data from metadata for scalability by simplifying data source replacement</li>
				<li>Deduces initial page load time by offloading until game start</li>
			</ul>
			
		<h3>FontAwesome</h3>
		
			<p>Font based icons to expedite UI development.</p>

	<h2>Application Structure</h2>
		
		<h3>Overview/Strategy</h3>
		
			<p>To develop a mobile first, responsive, and exclusively touch/mouse driven experience to avoid the keyboard entirely. This was achieved by removing the input field for populating a cells value and adding an option grid in stead. In addition, this would provide the user with the option to store more than one value in a tile more intuitively. Multiple selected options is also a very realistic scenario when working out a Sudoku puzzle.</p>
			
			<p>The decision to add a large object hierarchy (Board > Region > Tile > Option) at the outset of the project was to mitigate any risk of inflexibility in any additions to functionality at each of the levels that arose beyond the foresight of the initial functional design.</p>
		
		<h4>Controller</h4>
		
			<h4>A single controller is required to construct the board object and apply to the scope on DOM ready.</h4>
		
		<h3>Models</h3>

			<h4>Board</h4>
			
				<p>Object responsible for maintaining state of completion, loading, timing and 9 region objects.</p>

			<h4>Region</h4>
			
				<p>Contains 9 tile objects.</p>
			
				<p>Trade off: Separating tiles into region objects adds unnecessary complexity to the application but leaves a few pros:</p>
			
				<ul>
					<li>scalability to return to the code later and add functions applicable at the region level easily</li>
					<li>reduce calculations related to validation of regional tiles</li>
				</ul>
			
			<h4>Tile</h4>
			
				<p>Supplied with answers and defaults. Object responsible for maintaining state of validity, display, guesses and 9 option objects</p>
			
			<h4>Option</h4>
			
				<p>Object responsible for selected state. This object is not necessarily required but if expanding state of validity to an option itself as opposed to the tile, the option object would be able to handle it.</p>
				
	<h2>Trade-offs</h2>
		
		<h3>AngularJS</h3>
		
			<p>Test specifically stated that frameworks were not to be used. Time constrains, AngularJS model-view 2-way binding reduced testing time surrounding events and kicking back classes to the DOM to update state.</p>
			
		<h3>jQuery</h3>
		
			<p>jQuery was my ideal choice for this implementation based on my experience.</p>
			
		<h3>Puzzle Generator</h3>
		
			<p>Generating puzzles with a specific number of tiles and adding a difficulty option.</p>
			
		<h3>LocalStorage</h3>
		
			<p>Maintaining state in the browser beyond a page refresh.</p>