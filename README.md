<h1>Sudoku</h1>

<p>A logic based, combinatorial number-placement puzzle.</p>

<ul>
<li>Developer: Marc Whitbread</li>
<li>Developer URL: http://marcwhitbread.com/</li>
<li>Project URL: http://marcwhitbread.com/sudoku/</li>
</ul>

<h2>Features</h2>

<h4>Timer</h4>

<p>To time how quickly the player can finish the puzzle.</p>

<h4>Reset</h4>

<p>To allow the user to restart the puzzle.</p>

<h4>Validation</h4>

<p>To optionally allow the user instant feedback from the board if has any values conflicting with any other tile in it's region, row, or column.</p>

<h4>CSS3 Fluid Layout</h4>

<p>Employed the use of viewport units for a seamless experience across supported devices.</p>

<h4>Puzzle Generator</h4>

<p>TBD</p>

<h2>Technologies Used</h2>

<h4>Grunt</h4>

<p>Automated LESS compilation, JS concatenation and minification.</p>

<h4>AngularJS</h4>

<p>MVC framework leveraged solely for 2 way model-view binding to reduce testing time that would have been impacted UI updates with jQuery.</p>

<h4>LESS</h4>

<p>Simplify and organize CSS code. Mixins used to simplify cross-browser prefix specific CSS attributes (transform, border-radius, transition).</p>

<h4>AJAX/JSON</h4>

<p>External storage and data model of default puzzle.</p>

<p>Trade off:</p>

<ul>
<li>Separating data from metadata for scalability by simplifying data source replacement</li>
<li>Deduces initial page load time by offloading until game start</li>
</ul>

<h4>FontAwesome</h4>

<p>Font based icons to expedite UI development.</p>

<h2>Application Structure</h2>

<h4>Overview/Strategy</h4>

<p>To develop a mobile first, responsive, and exclusively touch/mouse driven experience to avoid the keyboard entirely. This was achieved by removing the input field for populating a cells value and adding an option grid in stead. In addition, this would provide the user with the option to store more than one value in a tile more intuitively. Multiple selected options is also a very realistic scenario when working out a Sudoku puzzle.</p>

<p>The decision to add a large object hierarchy (Board > Region > Tile > Option) at the outset of the project was to mitigate any risk of inflexibility in any additions to functionality at each of the levels that arose beyond the foresight of the initial functional design.</p>

<h4>Controllers</h4>

<p>A single controller is required to construct the board object and apply to the scope on DOM ready.</p>

<h4>Models</h4>

<h5>Board()</h5>

<p>Object responsible for maintaining state of completion, loading, timing and 9 region objects.</p>

<h5>Region()</h5>

<p>Contains 9 tile objects.</p>

<p>Trade off: Separating tiles into region objects adds unnecessary complexity to the application but leaves a few pros:</p>

<ul>
<li>scalability to return to the code later and add functions applicable at the region level easily</li>
<li>reduce calculations related to validation of regional tiles</li>
</ul>

<h5>Tile()</h5>

<p>Supplied with answers and defaults. Object responsible for maintaining state of validity, display, guesses and 9 option objects</p>

<h5>Option()</h5>

<p>Object responsible for selected state. This object is not necessarily required but if expanding state of validity to an option itself as opposed to the tile, the option object would be able to handle it.</p>

<h2>Trade-offs</h2>

<h4>AngularJS</h4>

<p>Test specifically stated that frameworks were not to be used. Time constrains, AngularJS model-view 2-way binding reduced testing time surrounding events and kicking back classes to the DOM to update state.</p>

<h4>jQuery</h4>

<p>jQuery was my ideal choice for this implementation based on my experience.</p>

<h4>Puzzle Generator</h4>

<p>Generating puzzles with a specific number of tiles and adding a difficulty option.</p>

<h4>LocalStorage</h4>

<p>Maintaining state in the browser beyond a page refresh.</p>