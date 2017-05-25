// wordPath.js
// Generates a Word Path puzzle given the word, grid size, and difficulty level.

/////////////////////////////////////////////////


// restructuring is needed.  

// get starting coordinates
// place first letter on the grid

// until last letter of the word is placed on the bottom row, repeat the following:	
// 	get list of blocked directions for current space
// 		check for top row, side columns, and eventually bottom rows
// 	get list of available directions
// 		check each available direction for an open space
// 	if: there are available directions
// 		pick one and move there
// 		place the next letter of the word in the current space
// 		add the direction moved to directionPath
// 	else: there are no more available options
// 		this is a dead end
// 		find out which was the previous space
// 		remove letter from previous space, replace with dot
// 		move back to previous space
// 		move back to previous letter
// 		block direction that led to dead end


// ToDo:

// Get rid of blockedDirections list and just remove blocked directions
// from directionOptions, like before.

// Make sure to stay on the correct letter when stepping back from a dead end.

// Make sure console output matches letters being drawn to grid.

// Write function to ensure last letter is placed on bottom row.




















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
	gridWidth = 10,
	theWord = 'abcdefghijklmnopqrstuvwxyz';

var letterIndex;	

var theGrid = [];	

var startingColumn;

var numRepeat = 5;	// how many times the word will be repeated along the path
// This will be removed later.  
// As long as the last word ends at the bottom on the last letter, we don't care about how many times it was repeated.

var gridPath = [];
var step = 0;


























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
}

// fill the grid with random numbers
function randomizeGrid(){
	console.log('randomizeGrid()');

	for (var w = 0; w<gridWidth; w++) {		
		for (var h = 0; h<gridHeight; h++) {
			var randomLetter = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 1);
			if (theGrid[w][h].letter == '.') {
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
}




// place the starting point
function placeStartingPoint(column) {
	//console.log('placeStartingPoint()');
	
	$('#gridArea').prepend('<div id="start">\u25BE</div>');
	$('#start').css('left' , (column) + '%')
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
	theGrid[currentGridSpace.X][currentGridSpace.Y].letter = theWord[step % theWord.length].toUpperCase() ;

	// then, find the next open space

	// top row
	if (currentGridSpace.Y == 0) {

		console.log('at the top');
		console.log('removing \'up\' from directionOptions');

		// if directionOptions contains 'up', remove it
		if (directionOptions.indexOf('up') != -1) directionOptions.splice(directionOptions.indexOf('up'), 1);
		
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
		if (directionOptions.indexOf('right') != -1) directionOptions.splice(directionOptions.indexOf('right'), 1);

		// if directionOptions contains 'up', remove it
		if (directionOptions.indexOf('up') != -1) directionOptions.splice(directionOptions.indexOf('up'), 1);
	}
	// left edge
	if (currentGridSpace.X == 0) {
		console.log('left edge');
		console.log('removing \'left\' and \'up\' from directionOptions');

		// if directionOptions contains 'left', remove it
		if (directionOptions.indexOf('left') != -1) directionOptions.splice(directionOptions.indexOf('left'), 1);

		// if directionOptions contains 'up', remove it
		if (directionOptions.indexOf('up') != -1) directionOptions.splice(directionOptions.indexOf('up'), 1);
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

		console.log('direction: ' + directionOptions[direction]+' ('+direction+')');

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
					// There was no chance of removing 'down' before now,
					// so no need to check for a -1 index in this case.
					directionOptions.splice(directionOptions.indexOf('down'), 1);
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
		// 		set current to prev
		// 		pre-block the direction that leads to the dead end
		// re-run findOpenSpace() with new pre-block list

		//		step back one letter in the wordpath
		// 		remove the last step in gridPath


		// dead end
		alert('dead end');
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

		step--;

		theGrid[currentGridSpace.X][currentGridSpace.Y].letter = "*";

		return prev; 
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

		return next;
	}
	
	
}



// calculate word path
function fitWordPath() {

	// determine starting point
	startingColumn = Math.floor((Math.random() * gridWidth) + 0);

	var current = {X: startingColumn, Y: 0};


	// later, the conditional below will change to require that the 
	// last letter of the word ends on the bottom row of the puzzle

	// repeat the word so many times
	for (var n = 0; n < numRepeat; n++){
		
		// console.log('n: '+n);

		for (var i = 0; i < theWord.length; i++) {
			
			console.log('\n\n\nplacing ' + theWord[i] + ' at ' + JSON.stringify(current) );

			current = findOpenSpace(current);
			
			if (n == numRepeat - 1 && i == theWord.length - 1) {
				
				// fill the rest of the puzzle with random letters
				// randomizeGrid();

				drawGrid();
				// drawGridToConsole();
				
			}
		}

	}

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

