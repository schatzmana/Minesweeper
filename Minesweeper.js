var height, width, numMines, nonMines;
var minesLeft;
var rightClicks = 0;
var safeClicks = 0;   // count of clicked squares that aren't mines
var sqCount = 0;
var squares = []; // assign each square in position: (width * y) +x


function squareObj(id){
  this.id = id;
  this.rightClickCount = 0;
  this.markedMine = false; // by user
  this.isMine = false;
  this.neighborCount = 0; // no neighbors ARE mines initially (keeps track of how many neighbors have mines)
  this.isCleared = false; // equivalent to saying at initialization no buttons are clicked
  this.numMarkedMines = 0; // initially no neighbors are MARKED AS mines
  // this.clicked = false;  // initially nothing is clickedOn or marked

  var yxArr = id.split("v");
  var y = yxArr[0];
  var x = yxArr[1];

  // the indexes of the neighbor square:
  var n1id = (width *(parseInt(y)-1)) + (parseInt(x)-1);
  var n2id = (width *(parseInt(y)-1)) + parseInt(x);
  var n3id = (width *(parseInt(y)-1)) + (parseInt(x)+1);
  var n4id = (width * parseInt(y)) + (parseInt(x)+1);
  var n5id = (width * (parseInt(y)+1) ) + (parseInt(x)+1);
  var n6id = (width * (parseInt(y)+1) ) + parseInt(x);
  var n7id = (width * (parseInt(y)+1) ) + (parseInt(x)-1);
  var n8id = (width * parseInt(y)) + (parseInt(x)-1);

  this.neighbors = [
    n1id,
    n2id,
    n3id,
    n4id,
    n5id,
    n6id,
    n7id,
    n8id
  ];

  if (y==0) {
    this.neighbors[0] = -1;
    this.neighbors[1] = -1;
    this.neighbors[2] = -1;
  }
  else if (y==(height-1)) {
    this.neighbors[4] = -1;
    this.neighbors[5] = -1;
    this.neighbors[6] = -1;
  }
  if (x==0) {
    this.neighbors[0] = -1;
    this.neighbors[7] = -1;
    this.neighbors[6] = -1;
  }
  else if (x==(width-1)) {
    this.neighbors[2] = -1;
    this.neighbors[3] = -1;
    this.neighbors[4] = -1;
  }
}

function validateUserInputs() {
  while ((height < 8 || width < 8) == true) {
    alert("Height and width must be at least 8. Please re-enter appropriate dimensions.");
    if (height < 8) {
      height = prompt("Enter height:");
      $('#height').val(height);
    }
    if (width < 8) {
      width = prompt("Enter width:");
      $('#width').val(width);
    }
    if ( (height == 'Q') || (width == 'Q') == true) {
      break;
    }
  }

  while ( (height > 30)|| (width > 40) == true) {
    alert("Height cannot be greater than 30 and width cannot be greater than 40. Please re-enter appropriate dimensions");
    if (height > 30 ) {
      height = prompt("Enter height:");
      $('#height').val(height);
    }
    if (width > 40) {
      width = prompt("Enter width:");
      $('#width').val(width);
    }
    if ( (height == 'Q') || (width == 'Q') == true) {
      break;
    }
  }
  // alert("Minefield dimensions are valid.");

  var maxMines = (height * width) -1;

  while ( ((numMines < 1) || (numMines > maxMines)) == true ) {
    alert("There must be at least 1 mine, but there can be no more than "+maxMines+". Please re-enter an appropriate number of mines.");
    numMines = prompt("Enter number of mines:");
    $('#numMines').val(numMines);
    if (numMines == 'Q') {
      break;
    }
  }
  // alert("Num mines is valid.");
}

function createTable(){
  $("#minesLeft").val(minesLeft);
  for (j = 0; j < height; j++) { // y coordinate
    row = "<tr>";

    for (i = 0; i < width; i++) { // x coordinate
      var xy = j+"v"+i; //yx actually
      row = row+'<td><button type="button" class="none" id="';
      row = row+xy+'"></button></td>';
            //row = row+xy+'" onclick=clickedSq("'+xy+'")></button></td>';
            //row = row+"sq"+sqCount+'" onclick=clickedSq("'+sqCount+'")></button></td>';

      squares[(width*j)+i] = new squareObj(xy);
      sqCount++;
    }
    row = row+'</tr>';

    $('#minefield').append(row);
        //$('#minefield button').on('click',clickedSq);
  }
  $('#minefield button').mousedown(
    function(event){
        //alert("clicked button's ID: "+this.id);
      if (event.shiftKey) {
          //alert("shift + click");
        markSq(this.id);
      }
      else {
        //alert("left click");
        clickedSq(this.id);
      }
      if ( (minesLeft == 0) && (nonMines == 0) ) {
          wonGame();
      }
    });
    //$('#minefield button').on('click',clickedSq);
    //alert("total squares made: "+sqCount);
}

function makeMines(count) {
  var x, y;
  for (var i=0; i<count; i++){
    //make mines using randomly generated x & y values:
    x = Math.floor( Math.random() * width );
    y = Math.floor( Math.random() * height );

    var mineID = '#'+y+'v'+x;
    var mineIDclass = $(mineID).attr("class");
    if ( mineIDclass == "mine") {
      //alert("already a mine");
      i--;
    }
    else {
      $(mineID).attr("class","mine");
      var squaresloc = (width * y)+x;
      squares[squaresloc].isMine = true;
    }
  }
}

function countNeighbors(sqLoc){
  // sends in value for where to find square in squares[]
  var sq = squares[sqLoc];
  var neighborsSum = 0;
  //var neighborsMarkedSum = 0;
  var neighborsResultsArray = [8];  //nResArr

  /*
  for (var x=0; x<8; x++){
    alert(sq.neighbors[x]);
  }
  */

  for (var i=0; i<8; i++) {
    // count up neighbors with true values
    if (sq.neighbors[i] !== -1) {
      if (squares[sq.neighbors[i]].isMine == true) {
        neighborsSum++;
      }
    }
  }

  /*
  WHERE TO PUT THIS SO IT UPDATES each square's markedneighborssum thing at the appropriate time
  var neighborsMarkedSum = 0;
  for (var i=0; i<8; i++) {
    if (sq.neighbors[i] !== -1) {
      if (squares[sq.neighbors[i]].markedMine == true) {
        neighborsMarkedSum++;
      }
    }
  }
  sq.numMarkedMines = neighborsMarkedSum;
  */
  sq.neighborCount = neighborsSum;

}

function clickedSq(id) {
  // check if it has already been marked
  var idsplit = id.split("v"); // y: [0], x:[1]
  var index = ( width * parseInt(idsplit[0]) ) + parseInt( idsplit[1] ) ;
  var mineQ = squares[index].markedMine;

  if (mineQ == true) {
    // alert("previously marked mine");
    // don't do anything
  }

  else if (squares[index].isCleared == true) {
    clearNeighbors(index);
  }

  else { // not marked mine
    // $("#"+id).attr("disabled", "disabled");

    var buttonClass = $('#'+id).attr("class");

    if( buttonClass == "mine") {
      $("#"+id).text("X");   // mine = !
       clickedMine();
    }
    else { // not a mine
      $('#'+id).attr('class','clickedSq');
      squares[index].isCleared = true;
      nonMines--;
      safeClicks++;
      $("#gameScore").val(safeClicks);

      countNeighbors(index);
      var surroundingTotal = squares[index].neighborCount;

      if (surroundingTotal == 0) {
        clearChunks(index);
        // want to uncover button and all surrounding buttons with zero surrounding totals
      }
      $("#"+id).text(surroundingTotal);
    }
  }
}

function clearChunks(sqLoc) {
  var stack = [];
  stack[0] = squares[sqLoc];
  stack[0].isCleared = true;
  $("#"+stack[0].id).attr("disabled", "disabled");

  while (stack.length != 0) {
    for (var q=0; q<8; q++){ // for all neighbors
      var neighborLoc = stack[0].neighbors[q];
      if (neighborLoc != -1){ // dummy neighbor
        var neighbor = squares[ neighborLoc ];
        // check if neighbor has no mines
        countNeighbors(neighborLoc);
        if ( (neighbor.isCleared == false) && (neighbor.neighborCount == 0)) {
          //neighbor.isCleared = true;
          stack[stack.length] = neighbor;  // adds to array stack at end position
          $("#"+neighbor.id).attr("disabled", "disabled");
        }
        if (neighbor.isCleared == false) {
          neighbor.isCleared = true;
          nonMines--;
        }
        //alert(stack[0].neighborCount);
        $("#"+neighbor.id).text(neighbor.neighborCount);


      }
    } // gone through all neighbors
    stack.shift();
  } // end while
}

function clearNeighbors(squareIndex) {
  // if a squares's neighbor count == that square's num mines marked
  // unclick ALL 8 surrounding squares
  var sq = squares[squareIndex];
  var neighborsMarkedSum = 0;

  for (var i=0; i<8; i++) {
    if (sq.neighbors[i] !== -1) {
      if (squares[sq.neighbors[i]].markedMine == true) {
        neighborsMarkedSum++;
      }
    }
  }
  sq.numMarkedMines = neighborsMarkedSum;
  //alert(neighborsMarkedSum);

  if ( squares[squareIndex].neighborCount == neighborsMarkedSum ) {
    for (var p=0; p<8; p++) {
      if(squares[squareIndex].neighbors[p] != -1){
        if ( squares[ squares[squareIndex].neighbors[p] ].isCleared == false ){
        //alert("");
          clickedSq( squares[ squares[squareIndex].neighbors[p] ].id );
        }
      }
    }
  }
}

function markSq(id){
  var idsplit = id.split("v"); // y: [0], x:[1]
  var index = ( width * parseInt(idsplit[0]) ) + parseInt(idsplit[1]) ;
  if (squares[index].isCleared == false){
    squares[index].rightClickCount++;
    var clkcnt = squares[index].rightClickCount;

    if (clkcnt == 1) {
      $("#"+id).text("!");  // marked as mine
      squares[index].markedMine = true;
      minesLeft--;
      $("#minesLeft").val(minesLeft);
    }
    else if (clkcnt == 2) {
      $("#"+id).text(" "); // does some weird slight downward shift on the whole square
      squares[index].markedMine = false;
      minesLeft++;
      $("#minesLeft").val(minesLeft);
      squares[index].rightClickCount = 0;
    }
  }
}

function surroundingMineCount(id, sqLoc) {
  neighborCount(sqLoc);
  var surroundingTotal = squares[sqLoc].neighborCount;
  $("#"+id).text(surroundingTotal);
}

function wonGame() {
  alert('GAME OVER : YOU WIN!');
  $('#minefield button').off('mousedown');
  // $('#minefield button').off('click');
}

function clickedMine(){
  $('#statusFace').attr("src","crying-emoji.png");
  alert("GAME OVER : YOU LOSE");
  $('#minefield button').off('mousedown');
  //$('#minefield button').off('click');
}

$(document).ready( function(){
  //alert("before getting user inputs: "+height+", "+width+", "+numMines);

  $('#setup').click( function() {
    $("#setup").attr("disabled", "disabled");
    $("#gameScore").val(0);

    height = document.getElementById('height').value;
    width = document.getElementById('width').value;
    numMines = document.getElementById('numMines').value;
    minesLeft = numMines;

    validateUserInputs();
    nonMines = (height*width) - numMines;   // total number of squares that are not mines
    createTable();
    makeMines(numMines);

  });

  $('#redraw').click( function() {
    $("#minefield").empty();
    $('#statusFace').attr("src","smiling-emoji.png");
    $("#gameScore").val(0);
    safeClicks = 0;
    rightClicks = 0;
    sqCount = 0;
    squares = [];
    nonMines = (height*width) - numMines;

    createTable();
    makeMines(numMines);


  });

  $('#restart').click( function() {
    window.location.reload();
  });

});
