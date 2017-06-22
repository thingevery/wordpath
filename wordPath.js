// wordPath.js
// Generates a Word Path puzzle given the word, grid size, and difficulty level.

/////////////////////////////////////////////////


// code is a mess.  needs structure


// ToDo:

// Be more precise when calculating checkRow.
// Control left/right after checkRow.
// Add difficulty setting which determines what letter set is used in randomizeGrid.
// If theWord contains spaces, replace them with underscores, and add '_' to the random set.
// Allow user to enter a comma separated word list.
// Hold grid size, word, difficulty settings, and word list in local storage.


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

var startingColumn;
var finishingColumn;

var numRepeat = 1;	// how many times the word will be repeated along the path
// This will be removed later.  
// As long as the last word ends at the bottom on the last letter, we don't care about how many times it was repeated.

var gridPath = [];
var step = 0;

// var i = 0;	// the current letter's place in the word

var current = {X: 0, Y: 0};

var finishingUp = false;

var rNum = 0;





















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

// fill the grid with random numbers
function randomizeGrid(){
	console.log('randomizeGrid()');

	for (var w = 0; w<gridWidth; w++) {		
		for (var h = 0; h<gridHeight; h++) {
			var randomLetter = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 1);
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
		console.log(gridPath.join(','));

		var lastStep = gridPath.pop(gridPath.length-1);
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

		if ((currentGridSpace.Y == (gridHeight - 1)) && (step % theWord.length == theWord.length - 1)) {
			theGrid[currentGridSpace.X][currentGridSpace.Y].letter = theWord[step % theWord.length].toUpperCase();

			placeExitPoint(currentGridSpace.X);
		}
		else {
			step--;

			theGrid[currentGridSpace.X][currentGridSpace.Y].letter = "*";

			return prev; 
		}
		
	}
	// if a free space is available
	else {
		// move to empty space 

		// add direction to gridPath
		gridPath.push(directionOptions[direction]);
		
		// // set current to next
		// prev = currentGridSpace;
		// currentGridSpace = next;	

		step++
		
		// i++;

		// if (i == theWord.length) i = 0;
		

		return next;
	}
	
	
}



// calculate word path
function fitWordPath() {

	// determine starting point
	startingColumn = Math.floor((Math.random() * gridWidth) + 0);

	current = {X: startingColumn, Y: 0};


	// later, the conditional below will change to require that the 
	// last letter of the word ends on the bottom row of the puzzle


	console.log('ready');

	// // repeat the word so many times
	// for (var n = 0; n < numRepeat; n++){
		

	// 	// for (var i = 0; i < theWord.length; i++) {
		
	// 	// while (i < theWord.length) {
	// 	do {

	// 		console.log('\n\n\n\n\n\nstep: '+step);
	// 		console.log('step % theWord.length: ' + step % theWord.length);
	// 		console.log('theWord.length: '+theWord.length);
			
	// 		// if ( step % theWord.length == theWord.length -1) {
	// 		// 	console.log('last letter: '+theWord[step % theWord.length]);
	// 		// }

	// 		// console.log('i is: '+i);
			
	// 		console.log('placing \'' + theWord[step % theWord.length] + '\' at ' + JSON.stringify(current) );

	// 		current = findOpenSpace(current);
			
	// 		if (n == numRepeat - 1 && (step % theWord.length) == theWord.length - 1) {
				
	// 			// fill the rest of the puzzle with random letters
	// 			// randomizeGrid();

	// 			drawGrid();
	// 			// drawGridToConsole();
				
	// 		}
	// 		// i++;
	// 	} while ((step % theWord.length) < theWord.length);

	// }

}


function advanceOneStep() {

	console.log('advanceOneStep()');


	if (current) {
		finishingColumn = current.X;


		// repeat the word so many times
		// for (var rNum = 0; rNum < numRepeat; rNum++){

		// if (rNum < numRepeat) {

		// do this when the last letter is placed in the bottom row
		if ((current.Y != gridHeight - 1) || (step % theWord.length != theWord.length)) {
			

			// for (var i = 0; i < theWord.length; i++) {
			
			// while (i < theWord.length) {
			// do {
			if ((step % theWord.length) < theWord.length) {

				console.log('\n\n\n\n\n\nstep: '+step);
				console.log('step % theWord.length: ' + step % theWord.length);
				console.log('theWord.length: '+theWord.length);
				
				// if ( step % theWord.length == theWord.length -1) {
				// 	console.log('last letter: '+theWord[step % theWord.length]);
				// }

				// console.log('i is: '+i);
				
				console.log('placing \'' + theWord[step % theWord.length] + '\' at ' + JSON.stringify(current) );

				current = findOpenSpace(current);
				
				if (rNum == numRepeat - 1 && (step % theWord.length) == theWord.length - 1) {
					
					// fill the rest of the puzzle with random letters
					// randomizeGrid();

					drawGrid();
					// drawGridToConsole();
					
				}
				// i++;
			} // while ((step % theWord.length) < theWord.length);

			// rNum++;
			drawGrid();
		}
		else {
			theGrid[current.X][current.Y].letter = theWord[step % theWord.length].toUpperCase();
			// drawGrid();
			// placeExitPoint(current.X);
		}

		// drawGrid();
	}
	else {
		randomizeGrid();
		drawGrid();
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

		// make the puzzle
		fitWordPath();

	}); 

	e.preventDefault();

});


// pressing enter while focussed on .userLabel or .color inputs clicks the addLabel button
$(document).on('keydown','#userInputArea input', function(event) {
  if (event.keyCode == 13) {
    $('#userInputArea button.createButton').click();
  }
});



// pressing the right arrow will advance to the next step for debugging
$(document).on('keydown', function(event) {
  if (event.keyCode == 39) {
    advanceOneStep();
  }
});














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

