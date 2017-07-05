// wordPath.js
// Generates a Word Path puzzle given the word, grid size, and difficulty level.

/////////////////////////////////////////////////


// code is a mess.  needs structure


// ToDo:

// √ 	Fix last two tiles on solutionPath.
// √ 	Add difficulty setting which determines what letter set is used in randomizeGrid.
// √	Fix incorrect tiles on user path when backtracking.
// √	Change green lines to double line to avoid overlapping the red.

// Be more precise when calculating checkRow.
// Control left/right after checkRow.
// If theWord contains spaces, replace them with underscores, and add '_' to the random set.
// Allow user to enter a comma separated word list.
// Hold grid size, word, difficulty settings, and word list in local storage.
// Validate word so only letters and spaces are accepted.
// Rebuild the whole thing in a Canvas, so it looks the same on all devices.
// Fix incorrect tiles on solution path when backtracking from deadends.

// Game Play:

// First letter will start out highlighted.
// Player will draw a path using arrow keys. 
// (Eventually, letters should be clickable for mobile users.)
// Player starts with 3 lives.
// If player steps off the path, a life is lost and gameplay continues.
// When all lives are lost, game is over.
// Each correct step down the word path earns a number of points.
// Backtracking costs a number of points.
// If point total reaches zero, a life is lost, the path is cleared, and the player is returned to the start.
// When the wordPath is drawn, a maximum score is generated.
// At the end of the game, the (maximum scoring) wordPath is revealed.
// Shortcuts are allowed, but will not attain the maximum score.








//      *****     **          *****     ******       *****     **          *****
//    **     **   *         **     **   *     **   **     **   *         **     **
//    *       *   *         *       *   *      *   *       *   *         *       *
//    *           *         *       *   *     **   *       *   *         **
//    *           *         *       *   ******     *       *   *           *****
//    *    ****   *         *       *   *     **   *********   *                **
//    *       *   *         *       *   *      *   *       *   *                 *
//    *       *   *         *       *   *      *   *       *   *         *       *
//    **     **   *      *  **     **   *     **   *       *   *      *  **     **
//      *****     ********    *****     ******     *       *   ********    *****


// defaults
var gridHeight = 20,
	gridWidth = 20,
	theWord = 'wordpath',
	checkRow = -1;

var letterIndex;	

var theGrid = [];	
var solutionGrid = [];
var playerGrid = [];

var startingColumn;
var finishingColumn;

var numRepeat = 1;	// how many times the word will be repeated along the path
// This will be removed later.  
// As long as the last word ends at the bottom on the last letter, we don't care about how many times it was repeated.

var solutionPath = [];
var step = 0;

var playerPath = [];
var playerStep = 0;


// var i = 0;	// the current letter's place in the word

var current = {X: 0, Y: 0};
var player = {X: 0, Y: 0};

var finishingUp = false;

var rNum = 0;

var wordContainsSpaces = false;

/////////////////////////////////
// deugging variables

var showGridBuild = true;

















//    *********  *       *   *      *     *****    *********   ***     *****     *      *      *****
//    *          *       *   **     *   **     **      *        *    **     **   **     *    **     **
//    *          *       *   * *    *   *       *      *        *    *       *   * *    *    *
//    *          *       *   *  *   *   *              *        *    *       *   *  *   *    **
//    *******    *       *   *  *   *   *              *        *    *       *   *  *   *      *****
//    *          *       *   *   *  *   *              *        *    *       *   *   *  *           **
//    *          *       *   *   *  *   *              *        *    *       *   *   *  *            *
//    *          *       *   *    * *   *       *      *        *    *       *   *    * *    *       *
//    *          **     **   *     **   **     **      *        *    **     **   *     **    **     **
//    *            *****     *      *     *****        *       ***     *****     *      *      *****



function showOptionsBox() {
	$('#userInputArea').fadeIn(500); 

	// insert default values
	$('#userInputArea input#gridWidth').attr('placeholder', gridWidth);
	$('#userInputArea input#gridHeight').attr('placeholder', gridHeight);
	$('#userInputArea input#wordpath').attr('placeholder', theWord);
}

// initialize the grid with dots
function initializeGrid(){
	console.log('initializeGrid()');
	for (var w = 0; w<gridWidth; w++) {
		theGrid.push([]);
		for (var h = 0; h<gridHeight; h++) {

			theGrid[w].push({'letter' : '.'});
		}
	}	
	calculateEndCheckRow();
}


// initialize the solution grid
function initializePlayerGrid(){
	console.log('initializePlayerGrid()');
	for (var w=0; w<gridWidth; w++) {
		playerGrid.push([]);
		for (var h=0; h<gridHeight; h++) {
			playerGrid[w].push({'tile' : '<img src="images/empty-square.png" alt="empty">'});
		}
	}
}


// initialize the solution grid
function initializeSolutionGrid(){
	console.log('initializeSolutionGrid()');
	for (var w=0; w<gridWidth; w++) {
		solutionGrid.push([]);
		for (var h=0; h<gridHeight; h++) {
			solutionGrid[w].push({'tile' : '<img src="images/empty-square.png" alt="empty">'});
		}
	}
}

// fill the grid with random numbers
function randomizeGrid(){
	console.log('randomizeGrid()');

	// begin with all letters
	var randomSet = [];
	for (var i = 65; i <= 90; i++) {
	     randomSet[i-65] = String.fromCharCode(i).toLowerCase();
	}
	// add underscores if necessary
	if (wordContainsSpaces) randomSet.push('_');

	console.log('at first, the set contains: '+randomSet);

	console.log('difficulty: '+$('select#difficulty').val());

	// refine randomSet based on difficulty
	switch ($('select#difficulty').val()) {
		case 'easy' :
			$(randomSet).each(function(n){
				var setItem = this;

				for (var letter = 0; letter < theWord.length; letter++) {
				  if (theWord[letter] == setItem) randomSet.splice(randomSet.indexOf(theWord[letter]), 1);	
				}

				// jquery alernative to above for loop
				// $(theWord.split('')).each(function(){
				// 	if (this.toString() == setItem) randomSet.splice(randomSet.indexOf(this.toString()), 1);	
				// });

			});
			break;
		case 'normal' :
			
			break;
		case 'hard' :
			randomSet = [];
			$(theWord.split('')).each(function(){
				if ($.inArray(this.toString(), randomSet) === -1) randomSet.push(this.toString());
			});
			break;
		default :
			break;	
	}

	console.log('based on difficulty, the set is now: '+randomSet);
	
	// fill the grid with random letters
	for (var w = 0; w<gridWidth; w++) {		
		for (var h = 0; h<gridHeight; h++) {
			
			// grab a random letter from the results of this regex
			// var randomLetter = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 1);

			// grab a random letter from randomSet
			var randomLetter = randomSet[Math.floor(Math.random() * randomSet.length)];

			if (theGrid[w][h].letter == '.' || theGrid[w][h].letter == '*') {
				theGrid[w][h].letter = randomLetter.toUpperCase();
			}
		}
	}	
}

// draw the grid in the console
function drawGridToConsole(){
	var output = [];
	// display the grid in the console
	for (var h = 0; h<gridHeight; h++) {
		for (var w = 0; w<gridWidth; w++) {
			output.push(stripHTML(theGrid[w][h].letter));
		}
		output.push('\n');
	}
	console.log(output.join(''));	
}



// draw the grid on the page
function drawGrid(){
	console.log('drawGrid()');
	var output = [];
	for (var h = 0; h<gridHeight; h++) {
		for (var w = 0; w<gridWidth; w++) {
			output.push('<span>'+theGrid[w][h].letter+'</span>');
		}
		output.push('<br>');
	}
	$('div#gridArea').html(output.join(''));	

	//console.log(startingColumn+' * '+gridWidth+' = '+(startingColumn*gridWidth) );
	placeStartingPoint((startingColumn+1)*100/gridWidth);
	placeExitPoint((finishingColumn+1)*100/gridWidth);
}




// // draw the grid on the page
// function drawGrid(){
// 	console.log('drawGrid()');
// 	var output = [];
// 	for (var h = 0; h<gridHeight; h++) {
// 		for (var w = 0; w<gridWidth; w++) {
// 			output.push('<span><img src="images/'+theGrid[w][h].letter+'.png" alt="'+theGrid[w][h].letter+'"></span>');
// 		}
// 		output.push('<br>');
// 	}
// 	$('div#gridArea').html(output.join(''));	

// 	//console.log(startingColumn+' * '+gridWidth+' = '+(startingColumn*gridWidth) );
// 	placeStartingPoint((startingColumn+1)*100/gridWidth);
// 	placeExitPoint((finishingColumn+1)*100/gridWidth);
// }




// draw the grid on the page
function drawPlayerGrid(){
	console.log('drawPlayerGrid()');

	// get grid width in pixels
	var gridWidthInPixels = $('#gridArea').width();
	var gridHeightInPixels = $('#gridArea').height();
	var gridCellWidth = gridWidthInPixels / gridWidth;
	var gridCellHeight = gridHeightInPixels / gridHeight;

	var output = [];
	for (var h = 0; h<gridHeight; h++) {
		for (var w = 0; w<gridWidth; w++) {
			output.push('<span>'+ playerGrid[w][h].tile +'</span>');
		}
		output.push('<br>');
	}
	$('div#playerPathArea').html(output.join(''));	

	$('#playerPathArea').css({'width' : gridWidthInPixels,
							  'height' : gridHeightInPixels});
	$('#playerPathArea span img').css({'width' : gridCellWidth,
									   'height' : gridCellHeight});
}




// draw the grid on the page
function drawSolutionGrid(){
	console.log('drawSolutionGrid()');

	// get grid width in pixels
	var gridWidthInPixels = $('#gridArea').width();
	var gridHeightInPixels = $('#gridArea').height();
	var gridCellWidth = gridWidthInPixels / gridWidth;
	var gridCellHeight = gridHeightInPixels / gridHeight;

	console.log('gridHeightInPixels: '+gridHeightInPixels);
	console.log('divided by: '+gridHeight+' =');
	console.log('gridCellHeight: '+gridCellHeight);

	var output = [];
	for (var h = 0; h<gridHeight; h++) {
		for (var w = 0; w<gridWidth; w++) {
			output.push('<span>'+ solutionGrid[w][h].tile +'</span>');
		}
		output.push('<br>');
	}
	$('div#solutionPathArea').html(output.join(''));	

	$('#solutionPathArea').css({'width' : gridWidthInPixels,
							  'height' : gridHeightInPixels});
	
	$('#solutionPathArea span img').css({'width' : gridCellWidth,
										 'height' : gridCellHeight});
	
}



// place the starting point
function placeStartingPoint(column) {
	//console.log('placeStartingPoint()');
	
	$('#gridArea').prepend('<div id="start">\u25BE</div>');
	$('#start').css('left' , (column) + '%')
}



// place the exit point
function placeExitPoint(column) {
	console.log('placeExitPoint()');
	
	$('#gridArea').append('<div id="exit">\u25BE</div>');
	$('#exit').css('left' , (column) + '%')
}



// make sure given space is still on the grid
function isOpen(space) {
	if (space.X < gridWidth &&
		space.Y < gridHeight &&
		space.X >= 0 &&
		space.Y >= 0 &&
		theGrid[space.X][space.Y].letter == '.') {
		return true;
	}
	else return false;
}



// strip HTML tags from string
function stripHTML(dirtyString) {
	var container = document.createElement('div');
	var text = document.createTextNode(dirtyString);
	container.appendChild(text);
	return container.innerHTML; // innerHTML will be a xss safe string
}


function findOpenSpace(currentGridSpace) {

	var directionOptions = ['up', 'right', 'down', 'left'];
	var direction;
	var next = {};
	var prev = {};

	updateSolutionPathTiles();

	// place the letter in the current space
	theGrid[currentGridSpace.X][currentGridSpace.Y].letter = theWord[step % theWord.length].toUpperCase();

	// then, find the next open space

	// top row
	if (currentGridSpace.Y == 0) {

		console.log('at the top');
		console.log('removing \'up\' from directionOptions');

		// if directionOptions contains 'up', remove it
		// if (directionOptions.indexOf('up') != -1) directionOptions.splice(directionOptions.indexOf('up'), 1);
		// no need to remove.  it won't pass the dot test anyway

		// at top row, moving towards starting column will create a trap
		if (currentGridSpace.X < startingColumn) {

			console.log('removing \'right\' from directionOptions');
			// if directionOptions contains 'right', remove it
			if (directionOptions.indexOf('right') != -1) directionOptions.splice(directionOptions.indexOf('right'), 1);
		}
		else if (currentGridSpace.X > startingColumn) {
			
			console.log('removing \'left\' from directionOptions');
			// if directionOptions contains 'left', remove it
			if (directionOptions.indexOf('left') != -1) directionOptions.splice(directionOptions.indexOf('left'), 1);
		}
	}
	// right edge
	if (currentGridSpace.X == gridWidth -1){
		console.log('right edge');
		console.log('removing \'right\' and \'up\' from directionOptions');

		// if directionOptions contains 'right', remove it
		// if (directionOptions.indexOf('right') != -1) directionOptions.splice(directionOptions.indexOf('right'), 1);
		// no need to remove.  it won't pass the dot test anyway

		// if directionOptions contains 'up', remove it
		if (directionOptions.indexOf('up') != -1) directionOptions.splice(directionOptions.indexOf('up'), 1);
	}
	// left edge
	if (currentGridSpace.X == 0) {
		console.log('left edge');
		console.log('removing \'left\' and \'up\' from directionOptions');

		// if directionOptions contains 'left', remove it
		// if (directionOptions.indexOf('left') != -1) directionOptions.splice(directionOptions.indexOf('left'), 1);
		// no need to remove.  it won't pass the dot test anyway

		// if directionOptions contains 'up', remove it
		if (directionOptions.indexOf('up') != -1) directionOptions.splice(directionOptions.indexOf('up'), 1);
	}

	// check row and below
	if (currentGridSpace.Y >= checkRow) {
		
		console.log('\t\tCurrent row is at or below checkRow.');
		finishingUp = true;

		// if directionOptions contains 'up', remove it
		console.log('\t\tremoving \'up\' from directionOptions');
		if (directionOptions.indexOf('up') != -1) directionOptions.splice(directionOptions.indexOf('up'), 1);

		
		var headingRight = true;
		if (currentGridSpace.X > gridWidth / 2) {
			console.log('\t\tStart out going to the left.');
			headingRight = false;
		}
		else console.log('\t\tStart out going to the right.');

		
		var totalSpacesRemaining = 0;
		var openRowsRemaining = gridHeight - (currentGridSpace.Y + 1);

		if (headingRight) totalSpacesRemaining += gridWidth - (currentGridSpace.X + 1);
		else totalSpacesRemaining += currentGridSpace.X;
		totalSpacesRemaining += (gridHeight - (currentGridSpace.Y +1)) * gridWidth;
		console.log('\t\tThe maximum number of grid spaces we still have available (without going up) is: '+totalSpacesRemaining);
	
		var numLettersRemaining = theWord.length - (step % theWord.length + 1);
		console.log('\t\tThere are '+ numLettersRemaining + ' letters left in the word.')
		
		if (numLettersRemaining < openRowsRemaining) {
			console.log('\t\tWe\'ll have to run through one more iteration of the word.');
			// add theWord.length to numLettersRemaining
			numLettersRemaining += theWord.length;
		}
		else {
			console.log('\t\tWe can reach the bottom with the number of letters remaining.');
		}

		console.log('\t\tnumLettersRemaining: '+numLettersRemaining, 'openRowsRemaining: '+openRowsRemaining);
		// if the number of letters left in the word is equal to the number of rows from the bottom
		if (numLettersRemaining == openRowsRemaining) {
		console.log('\t\tremoving \'left\' and \'right\' from directionOptions');
			if (directionOptions.indexOf('left') != -1) directionOptions.splice(directionOptions.indexOf('left'), 1);
			if (directionOptions.indexOf('right') != -1) directionOptions.splice(directionOptions.indexOf('right'), 1);
		}
		else {
			var openRowsNeeded = Math.ceil(numLettersRemaining / gridWidth) + 1;
			console.log('\t\tRows needed to finish the word: '+ openRowsNeeded);
			
			
			if (openRowsNeeded >= openRowsRemaining && currentGridSpace.X != 0 && currentGridSpace.X != gridWidth -1) {
				console.log('\t\ttoo close to the bottom');
				console.log('\t\tremoving \'down\' from directionOptions');
				if (directionOptions.indexOf('down') != -1) directionOptions.splice(directionOptions.indexOf('down'), 1);
			}
		}
	}



	// if (blockedDirections.length > 0) {
	// 	console.log('removing ' + blockedDirections.join(', ') + ' from directionOptions');

	// 	// remove each item in blockedDirections from directionOptions
	// 	$(blockedDirections).each(function(n){
	// 		if (directionOptions.indexOf(blockedDirections[n]) != -1) directionOptions.splice(directionOptions.indexOf(blockedDirections[n]), 1);
	// 	});

	// 	console.log('now, directionOptions contains: ' + directionOptions.join(', ') );
	// }



	// randomly choose between remaining directions until an open space is found
	while (!isOpen(next) && directionOptions.length) {
		// pick a 'random' direction to go next
		direction = Math.floor((Math.random() * directionOptions.length) + 0);

		console.log('checking: \'' + directionOptions[direction] + '\'');

		switch(directionOptions[direction]) {
			case 'up' :
				next.X = currentGridSpace.X;
				next.Y = currentGridSpace.Y - 1; 
				if (!isOpen(next)) {
					console.log('removing up as an option');
					if (directionOptions.indexOf('up') != -1) directionOptions.splice(directionOptions.indexOf('up'), 1);
					console.log('now, directionOptions: '+directionOptions);
				}
				break;
			case 'right' :
				next.X = currentGridSpace.X + 1;
				next.Y = currentGridSpace.Y;
				if (!isOpen(next)) {
					console.log('removing right as an option');
					if (directionOptions.indexOf('right') != -1) directionOptions.splice(directionOptions.indexOf('right'), 1);
					console.log('now, directionOptions: '+directionOptions);
				}
				break;
			case 'down' :  
				next.X = currentGridSpace.X;
				next.Y = currentGridSpace.Y + 1;
				if (!isOpen(next)) {
					console.log('removing down as an option');
					if (directionOptions.indexOf('down') != -1) directionOptions.splice(directionOptions.indexOf('down'), 1);
					console.log('now, directionOptions: '+directionOptions);
				}
				break;
			case 'left' :
				next.X = currentGridSpace.X - 1;
				next.Y = currentGridSpace.Y;
				if (!isOpen(next)) {
					console.log('removing left as an option');
					if (directionOptions.indexOf('left') != -1) directionOptions.splice(directionOptions.indexOf('left'), 1);
					console.log('now, directionOptions: '+directionOptions);
				}
				break;
			default : // this will never happen 
		}	
	}

	// if no free space is available
	if (directionOptions.length == 0) {

		// dead end
		// alert('dead end');
		console.log('\n\n\n\n'+
			'!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'+
			'\n\nyou have reached a dead end');
		console.log(solutionPath.join(','));

		// var lastStep = solutionPath.slice(-1);
		var lastStep = solutionPath.pop();
		// var lastStep = solutionPath[solutionPath.length -1];

		console.log('last step was: '+lastStep);	

		switch(lastStep) {
			case 'up' :
				prev.X = currentGridSpace.X;
				prev.Y = currentGridSpace.Y + 1;
				break;
			case 'right' :
				prev.X = currentGridSpace.X - 1;
				prev.Y = currentGridSpace.Y;
				break;
			case 'down' :
				prev.X = currentGridSpace.X;
				prev.Y = currentGridSpace.Y - 1;
				break;
			case 'left' :
				prev.X = currentGridSpace.X + 1;
				prev.Y = currentGridSpace.Y;
				break;
			default : 
				alert('how did this happen?');
				// it should never happen
		}

		console.log('currentGridSpace.Y: '+currentGridSpace.Y);
		console.log('gridHeight - 1 = '+(gridHeight - 1));
		console.log('step % theWord.length: '+step % theWord.length+' ['+theWord[step % theWord.length]+']');
		console.log('theWord.length - 1 = '+(theWord.length - 1));

		// finish if the last letter is on the last line
		if ((currentGridSpace.Y == (gridHeight - 1)) && (step % theWord.length == theWord.length - 1)) {
			
			// place the last letter
			theGrid[currentGridSpace.X][currentGridSpace.Y].letter = theWord[step % theWord.length].toUpperCase();

			// add direction to solutionPath
			// solutionPath.push(directionOptions[direction]);
			solutionPath.push(lastStep);
			updateSolutionPathTiles();

			current.Y++;

			solutionPath.push('down');
			updateSolutionPathTiles();

			placeExitPoint(currentGridSpace.X);
		}
		else {
			step--;

			theGrid[currentGridSpace.X][currentGridSpace.Y].letter = "*";
			updateSolutionPathTiles();
			return prev; 
		}
		
	}
	// if a free space is available
	else {
		// move to empty space 


		

		// add direction to solutionPath
		solutionPath.push(directionOptions[direction]);

		// updateSolutionPathTiles();
		

		step++
		

		return next;
	}
	
	
}



// calculate word path
function fitWordPath() {

	// determine starting point
	startingColumn = Math.floor((Math.random() * gridWidth) + 0);

	current = {X: startingColumn, Y: 0};

	console.log('ready');

}


function advanceOneStep() {

	console.log('advanceOneStep()');

	// if current is not undefined
	if (current) {
		finishingColumn = current.X;

		// unless the last letter is placed in the bottom row
		if ((current.Y != gridHeight - 1) || (step % theWord.length != theWord.length)) {
			
			// if not on the last letter
			if ((step % theWord.length) < theWord.length) {

				console.log('\n\n\n\n\n\nstep: '+step);
				console.log('step % theWord.length: ' + step % theWord.length);
				console.log('theWord.length: '+theWord.length);
				console.log('placing \'' + theWord[step % theWord.length] + '\' at ' + JSON.stringify(current) );

				current = findOpenSpace(current);
				
				// if after updating current, we're now on the last letter
				if (step % theWord.length == theWord.length - 1) {
					
					if (showGridBuild) {
						drawGrid();
						drawSolutionGrid();
					}
					
				}
				
			} 

			if (showGridBuild) {
				drawGrid();
				drawSolutionGrid();
			}
		}
		// if the last letter is placed on the bottom row
		else {
			theGrid[current.X][current.Y].letter = theWord[step % theWord.length].toUpperCase();
		}
	}
	// eventually, current will be undefined
	else {
		randomizeGrid();
		drawGrid();
		drawPlayerGrid();
		drawSolutionGrid();
	}
}



function createWordPath() {

	console.log('createWordPath()');

	// determine starting point
	startingColumn = Math.floor((Math.random() * gridWidth) + 0);

	current = {X: startingColumn, Y: 0};

	solutionPath.push('down');

	// if current is not undefined
	while (current) {
		finishingColumn = current.X;

		// unless the last letter is placed in the bottom row
		if ((current.Y != gridHeight - 1) || (step % theWord.length != theWord.length)) {
			
			// if not on the last letter
			if ((step % theWord.length) < theWord.length) {

				console.log('\n\n\n\n\n\nstep: '+step);
				console.log('step % theWord.length: ' + step % theWord.length);
				console.log('theWord.length: '+theWord.length);
				console.log('placing \'' + theWord[step % theWord.length] + '\' at ' + JSON.stringify(current) );

				current = findOpenSpace(current);
				
				// if after updating current, we're now on the last letter
				if (step % theWord.length == theWord.length - 1) {
					
					if (showGridBuild) {
						drawGrid();
						drawPlayerGrid();
					}
					
				}
				
			} 

			if (showGridBuild) {
				drawGrid();
				drawPlayerGrid();
			}
		}
		// if the last letter is placed on the bottom row
		else {
			theGrid[current.X][current.Y].letter = theWord[step % theWord.length].toUpperCase();
		}
	}
	// eventually, current will be undefined
	if (!current) {
		randomizeGrid();
		drawGrid();
		drawPlayerGrid();

		startGame();
	}
}


function calculateEndCheckRow(){
	// if the word is shorter than the grid width, checkRow is the second to last line 
	if (theWord.length <= gridWidth) checkRow = gridHeight - 2;
	// if the word is longer than the grid width, checkRow is 
	else checkRow = gridHeight - 2 - Math.floor(theWord.length / gridWidth);

	console.log('The word will take at least ' + Math.floor(theWord.length / gridWidth) + ' full rows');
	console.log('and then '+theWord.length % gridWidth+' columns in another.');

	console.log('checkRow is row: '+checkRow);
}


function startGame(){
	console.log('startGame()');
	player.X = startingColumn;

	drawSolutionGrid();
	$('#solutionPathArea').hide();

	// place open box on starting square
	playerGrid[player.X][player.Y].tile = '<img src="images/open-circle.png" alt="open">';
	drawPlayerGrid();
	playerPath.push('down');

	// $(document).on('keydown', function(event) {
	//   switch (event.keyCode) {
	//   	case 37 : if (player.X > 0) moveLeft();
	//   		break;
	//   	case 38 : if (player.Y > 0) moveUp();
	//   		break;
	//   	case 39 : if (player.X < gridWidth - 1) moveRight();
	//   		break;
	//   	case 40 : if (player.Y < gridHeight - 1) moveDown();
	//   		break;
	//   	case 71 : $('#solutionPathArea').toggle(); // g
	//   		break;
	//   	default : console.log('keyCode: '+ event.keyCode);
	//   }
	// });			
}

function moveLeft(){
	console.log('moveLeft()');
	playerPath.push('left');
	player.X -= 1;
	updatePlayerPathTiles();
}
function moveUp(){
	console.log('moveUp()');	
	playerPath.push('up');
	player.Y -= 1;
	updatePlayerPathTiles();
}
function moveRight(){
	console.log('moveRight()');	
	playerPath.push('right');
	player.X++;
	updatePlayerPathTiles();
}
function moveDown(){
	console.log('moveDown()');
	playerPath.push('down');
	player.Y++;
	updatePlayerPathTiles();
}

function updatePlayerPathTiles(){
	console.log('updatePlayerPathTiles()');
	console.log('player.X: '+player.X+', player.Y: '+player.Y);
	console.log('playerPath: '+playerPath.join(', '));

	playerGrid[player.X][player.Y].tile = '<img src="images/open-circle.png" alt="open">';
	
	// examine the last item on the path
	switch (playerPath[playerPath.length -1]){
		case 'up' :
			// examine the second to last item on the path
			switch (playerPath[playerPath.length -2]){
				case 'up' :		 	// up, up
					playerGrid[player.X][player.Y +1].tile = '<img src="images/up-down.png" alt="up-down">';
					break;
				case 'right' : 		// right, up
					playerGrid[player.X][player.Y +1].tile = '<img src="images/up-left.png" alt="up-left">';
					break;
				case 'down' : 		// down, up
					playerGrid[player.X][player.Y +1].tile = '<img src="images/empty-square.png" alt="empty">';
					playerPath.splice(-2, 2);
					break;
				case 'left' : 		// left, up
					playerGrid[player.X][player.Y +1].tile = '<img src="images/up-right.png" alt="up-right">';
					break;
				default : console.log('this should not have happened');
			}
			break;
		case 'right' :
			// examine the second to last item on the path
			switch (playerPath[playerPath.length -2]){
				case 'up' : 		// up, right
					playerGrid[player.X -1][player.Y].tile = '<img src="images/down-right.png" alt="down-right">';
					break;
				case 'right' : 		// right, right
					playerGrid[player.X -1][player.Y].tile = '<img src="images/left-right.png" alt="up-down">';
					break;
				case 'down' : 		// down, right
					playerGrid[player.X -1][player.Y].tile = '<img src="images/up-right.png" alt="up-right">';
					break;
				case 'left' : 		// left, right
					playerGrid[player.X -1][player.Y].tile = '<img src="images/empty-square.png" alt="empty">';
					playerPath.splice(-2, 2);
					break;
				default : console.log('this should not have happened');
			}			
			break;
		case 'down' :
			// examine the second to last item on the path
			switch (playerPath[playerPath.length -2]){
				case 'up' : 		// up, down
					playerGrid[player.X][player.Y -1].tile = '<img src="images/empty-square.png" alt="empty">';
					playerPath.splice(-2, 2);
					break;
				case 'right' : 		// right, down
					playerGrid[player.X][player.Y -1].tile = '<img src="images/down-left.png" alt="down-left">';
					break;
				case 'down' : 		// down, down
					playerGrid[player.X][player.Y -1].tile = '<img src="images/up-down.png" alt="up-down">';
					break;
				case 'left' : 		// left, down
					playerGrid[player.X][player.Y -1].tile = '<img src="images/down-right.png" alt="down-right">';
					break;
				default : console.log('this should not have happened');
			}
			break;
		case 'left' :
			// examine the second to last item on the path
			switch (playerPath[playerPath.length -2]){
				case 'up' : 		// up, left
					playerGrid[player.X +1][player.Y].tile = '<img src="images/down-left.png" alt="down-left">';
					break;
				case 'right' : 		// right, left
					playerGrid[player.X +1][player.Y].tile = '<img src="images/empty-square.png" alt="empty">';
					playerPath.splice(-2, 2);
					break;
				case 'down' : 		// down, left
					playerGrid[player.X +1][player.Y].tile = '<img src="images/up-left.png" alt="up-left">';
					break;
				case 'left' : 		// left, left
					playerGrid[player.X +1][player.Y].tile = '<img src="images/left-right.png" alt="left-right">';
					break;
				default : console.log('this should not have happened');
			}
			break;
		default : alert('something made it on to playerPath that shouldn\'t have ...made it on there');
	}
	drawPlayerGrid();
}



function updateSolutionPathTiles(){
	console.log('updateSolutionPathTiles()');
	console.log('current.X: '+current.X+', current.Y: '+current.Y);
	// solutionGrid[current.X][current.Y].tile = '<img src="images/open-square.png" alt="open">';
	
	console.log('solutionPath: '+solutionPath.join(', '));
	console.log('last two steps: '+solutionPath[solutionPath.length -2]+', '+solutionPath[solutionPath.length -1]);

	if (solutionPath.length > 1) {
		// examine the last item on the path
		switch (solutionPath[solutionPath.length -1]){
			case 'up' :
				// examine the second to last item on the path
				switch (solutionPath[solutionPath.length -2]){
					case 'up' :		 	// up, up
						solutionGrid[current.X][current.Y +1].tile = '<img src="images/solution-up-down.png" alt="up-down">';
						break;
					case 'right' : 		// right, up
						solutionGrid[current.X][current.Y +1].tile = '<img src="images/solution-up-left.png" alt="up-left">';
						break;
					case 'down' : 		// down, up
						solutionGrid[current.X][current.Y +1].tile = '<img src="images/empty-square.png" alt="empty">';
						solutionPath.splice(-2, 2);
						break;
					case 'left' : 		// left, up
						solutionGrid[current.X][current.Y +1].tile = '<img src="images/solution-up-right.png" alt="up-right">';
						break;
					default : console.log('this should not have happened');
				}
				break;
			case 'right' :
				// examine the second to last item on the path
				switch (solutionPath[solutionPath.length -2]){
					case 'up' : 		// up, right
						solutionGrid[current.X -1][current.Y].tile = '<img src="images/solution-down-right.png" alt="down-right">';
						break;
					case 'right' : 		// right, right
						solutionGrid[current.X -1][current.Y].tile = '<img src="images/solution-left-right.png" alt="up-down">';
						break;
					case 'down' : 		// down, right
						solutionGrid[current.X -1][current.Y].tile = '<img src="images/solution-up-right.png" alt="up-right">';
						break;
					case 'left' : 		// left, right
						solutionGrid[current.X -1][current.Y].tile = '<img src="images/empty-square.png" alt="empty">';
						solutionPath.splice(-2, 2);
						break;
					default : console.log('this should not have happened');
				}
				break;
			case 'down' :
				// don't try to place tiles above the top row
				// if (current.Y > 0) {
					// examine the second to last item on the path
					switch (solutionPath[solutionPath.length -2]){
						case 'up' : 		// up, down
							solutionGrid[current.X][current.Y -1].tile = '<img src="images/empty-square.png" alt="empty">';
							solutionPath.splice(-2, 2);
							break;
						case 'right' : 		// right, down
							solutionGrid[current.X][current.Y -1].tile = '<img src="images/solution-down-left.png" alt="down-left">';
							break;
						case 'down' : 		// down, down
							solutionGrid[current.X][current.Y -1].tile = '<img src="images/solution-up-down.png" alt="up-down">';
							break;
						case 'left' : 		// left, down
							solutionGrid[current.X][current.Y -1].tile = '<img src="images/solution-down-right.png" alt="down-right">';
							break;
						default : console.log('this should not have happened');
					}
				// }
				break;
			case 'left' :
				// examine the second to last item on the path
				switch (solutionPath[solutionPath.length -2]){
					case 'up' : 		// up, left
						solutionGrid[current.X +1][current.Y].tile = '<img src="images/solution-down-left.png" alt="down-left">';
						break;
					case 'right' : 		// right, left
						solutionGrid[current.X +1][current.Y].tile = '<img src="images/empty-square.png" alt="empty">';
						solutionPath.splice(-2, 2);
						break;
					case 'down' : 		// down, left
						solutionGrid[current.X +1][current.Y].tile = '<img src="images/solution-up-left.png" alt="up-left">';
						break;
					case 'left' : 		// left, left
						solutionGrid[current.X +1][current.Y].tile = '<img src="images/solution-left-right.png" alt="left-right">';
						break;
					default : console.log('this should not have happened');
				}
				break;
			default : alert('something made it on to solutionPath that shouldn\'t have ...made it on there');
		}
	}

	
	// drawSolutionGrid();
}



















//    *********  *       *   *********   *      *   *********    *****
//    *          *       *   *           **     *       *      **     **
//    *          *       *   *           * *    *       *      *
//    *           *     *    *           *  *   *       *      **
//    *******     *     *    *******     *  *   *       *        *****
//    *           *     *    *           *   *  *       *             **
//    *            *   *     *           *   *  *       *              *
//    *            *   *     *           *    * *       *      *       *
//    *             * *      *           *     **       *      **     **
//    *********      *       *********   *      *       *        *****




////////////////////////////////
// click create button
$(document).on('click', '#userInputArea button.createButton', function(e){

	// get user input
	gridWidth = $('#userInputArea input#gridWidth').val() || $('#userInputArea input#gridWidth').attr('placeholder');
	gridHeight = $('#userInputArea input#gridHeight').val() || $('#userInputArea input#gridHeight').attr('placeholder');
	theWord = $('#userInputArea input#wordpath').val() || $('#userInputArea input#wordpath').attr('placeholder');

	console.log('creating ' + gridWidth +' x '+ gridHeight + ' puzzle for: ' + theWord);

	// hide user input area
	$('#userInputArea').fadeOut(500, function(){
		
		// fill grid with dots
		initializeGrid();
		initializeSolutionGrid();
		initializePlayerGrid();

		// make the puzzle
		if (showGridBuild) fitWordPath();
		else createWordPath();

	}); 

	e.preventDefault();

});

$(document).on('keydown', function(event) {
  switch (event.keyCode) {
  	// case 37 : if (player.X > 0) moveLeft();
  	// 	break;
  	// case 38 : if (player.Y > 0) moveUp();
  	// 	break;
  	// case 39 : if (player.X < gridWidth - 1) moveRight();
  	// 	break;
  	// case 40 : if (player.Y < gridHeight - 1) moveDown();
  	// 	break;
  	case 71 : $('#solutionPathArea').toggle(); // g
  		break;
  	default : console.log('keyCode: '+ event.keyCode);
  }
});		


// pressing enter while focussed on .userLabel or .color inputs clicks the addLabel button
$(document).on('keydown','#userInputArea input, #userInputArea select', function(event) {
  if (event.keyCode == 13) {
    $('#userInputArea button.createButton').click();
  }
});



// pressing the right arrow will advance to the next step for debugging
if (showGridBuild) {
	$(document).on('keydown', function(event) {
	  if (event.keyCode == 39) {
	    advanceOneStep();
	  }
	});	
}















//    *******     ********     *****     *******    *         *
//    *      **   *          **     **   *      **   *       *
//    *       *   *          *       *   *       *    *     *
//    *       *   *          *       *   *       *     *   *
//    *      **   *          *       *   *       *       *
//    *******     ******     *********   *       *       *
//    *      *    *          *       *   *       *       *
//    *       *   *          *       *   *       *       *
//    *       *   *          *       *   *      **       *
//    *       *   ********   *       *   *******         *


$(function(){
	showOptionsBox();

	// initializeGrid(); // this is now called when create button is clicked
	
	// fitWordPath();	// this is now called when create button is clicked

	// randomizeGrid();	// this is now called when create button is clicked

	// drawGrid();
	// drawGridToConsole();
});

