//All this function is doing is creating hexcodes for us
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

//grabbing the header and assigning the color value to the header property
function changeHeaderColor(){
  var color = getRandomColor();
  // var myHeader = document.querySelector("h2");
  // myHeader.style.color = getRandomColor();
  $("h2").css('color',color);
}

//performing color change action  over intervals of time (milliseconds)
setInterval("changeHeaderColor()", 500)



// --------------------------Game logic ------------------------------



// We need to use jQuery for the following:

var player1 = prompt("Player One: Enter Your Name , you will be Blue");
var player1Color = 'rgb(77, 198, 232)';

var player2 = prompt("Player Two: Enter Your Name, you will be Red");
var player2Color = 'rgb(232, 77, 77)';

var game_on = true;
var table = $('table tr');   //--> [ tr1[td,td,td], tr2[td,td,td], tr3[td,td,td]]

// Note when we use jQuery to change the color actual color of the buttons it
// expects a string in the form of RGB
// On click, which cell to change, what is the color of current cell, how to change


function reportWin(rowNum,colNum) {
  console.log("You won starting at this row,col");
  console.log(rowNum);
  console.log(colNum);
}

//how to change - function that can change the color of a button on click
function changeColor(rowNum,colNum,color)
{
  return table.eq(rowNum).find('td').eq(colNum).find('button').css('background-color',color);
}


//function to figure out what is the current color of the cell
function returnColor(rowNum,colNum)
{
  return table.eq(rowNum).find('td').eq(colNum).find('button').css('background-color');
}


// function to figure out which cell to be filled from the bottom
// (if i click on a particular col,row index, then the corresponding
// columns 1st availability from the bottom has to be filled)
// Take in column index, returns the bottom row that is still gray
function checkBottom(colIndex) {
  var colorReport = returnColor(5,colIndex);  //starting at the
  for (var row = 5; row > -1; row--) {
    colorReport = returnColor(row,colIndex);  //initializing variable with the last row's color
    if (colorReport === 'rgb(128, 128, 128)') { // that means this cell is empty
      return row   // fill at this row
    }
  }
}


// // function that checks to see if 4 inputs matched in a row
function colorMatchCheck(one,two,three,four){
  return (one===two && one===three && one===four && one !== 'rgb(128, 128, 128)' && one !== undefined);
}

// Check for Horizontal Wins
function horizontalWinCheck() {
  for (var row = 0; row < 6; row++) {
    for (var col = 0; col < 4; col++) {
      if (colorMatchCheck(returnColor(row,col), returnColor(row,col+1) ,returnColor(row,col+2), returnColor(row,col+3))) {
        console.log('horiz');
        reportWin(row,col); // just for debugging purpose
        return true;
      }else {
        continue;
      }
    }
  }
}

// Check for Vertical Wins
function verticalWinCheck() {
  for (var col = 0; col < 7; col++) {
    for (var row = 0; row < 3; row++) {
      if (colorMatchCheck(returnColor(row,col), returnColor(row+1,col) ,returnColor(row+2,col), returnColor(row+3,col))) {
        console.log('vertical');
        reportWin(row,col); // just for debugging purpose
        return true;
      }else {
        continue;
      }
    }
  }
}

// Check for Diagonal Wins
function diagonalWinCheck() {
  for (var col = 0; col < 5; col++) {
    for (var row = 0; row < 7; row++) {
      if (colorMatchCheck(returnColor(row,col), returnColor(row+1,col+1) ,returnColor(row+2,col+2), returnColor(row+3,col+3))) {
        console.log('diag');
        reportWin(row,col);
        return true;
      }else if (colorMatchCheck(returnColor(row,col), returnColor(row-1,col+1) ,returnColor(row-2,col+2), returnColor(row-3,col+3))) {
        console.log('diag');
        reportWin(row,col); // just for debugging purpose
        return true;
      }else {
        continue;
      }
    }
  }
}

// Game End
function gameEnd(winningPlayer) {
  for (var col = 0; col < 7; col++) {
    for (var row = 0; row < 7; row++) {
      $('h3').fadeOut('fast');
      $('h2').fadeOut('fast');
      $('h1').text(winningPlayer+" has won! Refresh your browser to play again!").css("fontSize", "50px")
    }
  }
}


// game logic that will allow all the above code to happen on a click
// Start with Player One
var currentPlayer = 1;
var currentName = player1;
var currentColor = player1Color;

// Start with Player One
$('h3').text(player1+": it is your turn, please pick a column to drop your blue chip.");

$('.board button').on('click',function() {

  // Recognize what column was chosen
  var col = $(this).closest("td").index(); //finding the index of click column


  // Get back bottom available row to change
  var bottomAvail = checkBottom(col); //finding the cell


  // Drop the chip in that column at the bottomAvail Row
  changeColor(bottomAvail,col,currentColor);  // assigning current color to the cell

  // Check for a win or a tie.
  // everytime one entry is filled, we need to keep checking if that is a win case. If it is, then end game.
  if (horizontalWinCheck() || verticalWinCheck() || diagonalWinCheck()) {
    gameEnd(currentName);
  }


  // if we are still continuing, i.e., if we reach this point, that means there is no win in previous case :
  // If no win or tie, continue to next player
  currentPlayer = currentPlayer * -1 ;

  // Re-Check who the current Player is.
  if (currentPlayer === 1) {
    currentName = player1;
    $('h3').text(currentName+": it is your turn, please pick a column to drop your blue chip.");
    currentColor = player1Color;
  }else {
    currentName = player2
    $('h3').text(currentName+": it is your turn, please pick a column to drop your red chip.");
    currentColor = player2Color;
  }

})
