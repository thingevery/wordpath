// wordPath.js
// Generates a Word Path puzzle given the word, grid size, and difficulty level.

/////////////////////////////////////////////////

// ToDo:
//
// Step backwards from dead ends, eliminating the previous direction from directionOptions.


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


var gridHeight = 20,
	gridWidth = 6;

var theWord = 'wordpath';
var letterIndex;	

var theGrid = [];	

var startingColumn;

var numRepeat = 6;	// how many times the word will be repeated along the path
// This will be removed later.  
// As long as the last word ends at the bottom on the last letter, we don't care about how many times it was repeated.

var directionPath = [];






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



// initialize the grid with dots
function initializeGrid(){
	console.log('initializeGrid()');
	for (var w = 0; w<gridWidth; w++) {
		theGrid.push([]);
		for (var h = 0; h<gridHeight; h++) {
			theGrid[w].push('.');
		}
	}	
}

// fill the grid with random numbers
function randomizeGrid(){
	console.log('randomizeGrid()');

	for (var w = 0; w<gridWidth; w++) {		
		for (var h = 0; h<gridHeight; h++) {
			var randomLetter = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 1);
			if (theGrid[w][h] == '.') {
				theGrid[w][h] = randomLetter.toUpperCase();
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
			output.push(stripHTML(theGrid[w][h]));
		}
		output.push('\n');
	}
	console.log(output.join(''));	
}



// draw the grid on the page
function drawGrid(){
	var output = [];
	for (var h = 0; h<gridHeight; h++) {
		for (var w = 0; w<gridWidth; w++) {
			output.push('<span>'+theGrid[w][h]+'</span>');
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
		theGrid[space.X][space.Y] == '.') {
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



// calculate word path
function fitWordPath(){

	// determine starting point
	startingColumn = Math.floor((Math.random() * gridWidth) + 0);

	var current = {X: startingColumn, Y: 0};

	// repeat the word so many times
	for (var n = 0; n < numRepeat; n++){
		
		// console.log('n: '+n);

		for (var i = 0; i < theWord.length; i++) {
			
			console.log(theWord[i]);
			console.log('current: '+JSON.stringify(current));

			theGrid[current.X][current.Y] = theWord[i].toUpperCase();
			// theGrid[current.X][current.Y] = '<span>'+theWord[i].toUpperCase()+'</span>';

			// find next square
			var next = {};
			var tries = 0;

			var directionOptions = ['up', 'right', 'down', 'left'];
			var direction;
			
			// check for edges
			if (current.Y == 0) {

				console.log('at the top');
				console.log('removing up from options');
				directionOptions.splice(directionOptions.indexOf('up'), 1);
				// directionOptions[0] = 'blocked';

				if (current.X < startingColumn) {
					console.log('removing right from options');
					directionOptions.splice(directionOptions.indexOf('right'), 1);
					console.log('now, directionOptions: '+directionOptions);
					// directionOptions[1] = 'blocked';
				}
				else if (current.X > startingColumn) {
					console.log('removing left from options');
					directionOptions.splice(directionOptions.indexOf('left'), 1);
					console.log('now, directionOptions: '+directionOptions);
					// directionOptions[3] = 'blocked';
				}
			}
			if (current.X == gridWidth -1){
				console.log('right edge');
				console.log('removing up and right from options');
				// Check that 'up' is still in directionOptions before removing
				// because an index of -1 will remove the last item.
				if (directionOptions.indexOf('up') != -1) directionOptions.splice(directionOptions.indexOf('up'), 1);
				if (directionOptions.indexOf('right') != -1) directionOptions.splice(directionOptions.indexOf('right'), 1);
			}
			if (current.X == 0) {
				console.log('left edge');
				console.log('removing up and left from options');
				if (directionOptions.indexOf('up') != -1) directionOptions.splice(directionOptions.indexOf('up'), 1);
				if (directionOptions.indexOf('left') != -1) directionOptions.splice(directionOptions.indexOf('left'), 1);
			}

			while (!isOpen(next) && directionOptions.length) {
				// pick a 'random' direction to go next (0 - 3)
				direction = Math.floor((Math.random() * directionOptions.length) + 0);

				console.log('directionOptions: '+directionOptions);
				console.log('direction: ' + directionOptions[direction]+' ('+direction+')');

				switch(directionOptions[direction]) {
					case 'up' :
						next.X = current.X;
						next.Y = current.Y - 1; 
						if (!isOpen(next)) {
							console.log('removing up as an option');
							if (directionOptions.indexOf('up') != -1) directionOptions.splice(directionOptions.indexOf('up'), 1);
							console.log('now, directionOptions: '+directionOptions);
						}
						break;
					case 'right' :
						next.X = current.X + 1;
						next.Y = current.Y;
						if (!isOpen(next)) {
							console.log('removing right as an option');
							if (directionOptions.indexOf('right') != -1) directionOptions.splice(directionOptions.indexOf('right'), 1);
							console.log('now, directionOptions: '+directionOptions);
						}
						break;
					case 'down' :  
						next.X = current.X;
						next.Y = current.Y + 1;
						if (!isOpen(next)) {
							console.log('removing down as an option');
							// There was no chance of removing 'down' before now,
							// so no need to check for a -1 index in this case.
							directionOptions.splice(directionOptions.indexOf('down'), 1);
							console.log('now, directionOptions: '+directionOptions);
						}
						break;
					case 'left' :
						next.X = current.X - 1;
						next.Y = current.Y;
						if (!isOpen(next)) {
							console.log('removing left as an option');
							if (directionOptions.indexOf('left') != -1) directionOptions.splice(directionOptions.indexOf('left'), 1);
							console.log('now, directionOptions: '+directionOptions);
						}
						break;
					default : // this will never happen 
				}	
				// tries++;
			}

			// if (tries > 4) {
			console.log('finally, '+directionOptions);
			if (directionOptions.length == 0) {
				i = theWord.length;
				n = numRepeat;
				console.log('dead end');
				console.log(directionPath.join(','));

				// // remove last letter
				// theGrid[current.X][current.Y] = '.';

				// while (directionOptions.length == 0) {

				// 	// get and remove last step from directionPath
				// 	var lastStep = directionPath.pop(directionPath.length-1);
				// 	console.log('last step was: '+lastStep);

				// 	switch(lastStep) {
				// 		case 'up' :
				// 			next.X = current.X;
				// 			next.Y = current.Y + 1; 
				// 			if (!isOpen(next)) {
				// 				console.log('removing up as an option');
				// 				if (directionOptions.indexOf('up') != -1) directionOptions.splice(directionOptions.indexOf('up'), 1);
				// 				console.log('now, directionOptions: '+directionOptions);
				// 			}
				// 			break;
				// 		case 'right' :
				// 			next.X = current.X - 1;
				// 			next.Y = current.Y;
				// 			if (!isOpen(next)) {
				// 				console.log('removing right as an option');
				// 				if (directionOptions.indexOf('right') != -1) directionOptions.splice(directionOptions.indexOf('right'), 1);
				// 				console.log('now, directionOptions: '+directionOptions);
				// 			}
				// 			break;
				// 		case 'down' :  
				// 			next.X = current.X;
				// 			next.Y = current.Y - 1;
				// 			if (!isOpen(next)) {
				// 				console.log('removing down as an option');
				// 				// There was no chance of removing 'down' before now,
				// 				// so no need to check for a -1 index in this case.
				// 				directionOptions.splice(directionOptions.indexOf('down'), 1);
				// 				console.log('now, directionOptions: '+directionOptions);
				// 			}
				// 			break;
				// 		case 'left' :
				// 			next.X = current.X + 1;
				// 			next.Y = current.Y;
				// 			if (!isOpen(next)) {
				// 				console.log('removing left as an option');
				// 				if (directionOptions.indexOf('left') != -1) directionOptions.splice(directionOptions.indexOf('left'), 1);
				// 				console.log('now, directionOptions: '+directionOptions);
				// 			}
				// 			break;
				// 		default : // this will never happen 
				// 	}	
				// }

			}
			else {
				// add direction to directionPath
				directionPath.push(directionOptions[direction]);
				// set current to next
				current = next;	
			}
			
		}

	}
	
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
	initializeGrid();
	
	fitWordPath();

	// randomizeGrid();	

	drawGrid();
	// drawGridToConsole();
});

