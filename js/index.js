var board = null
var $board = $('#board')
var game = new Chess()
var squareToHighlight = null
var squareClass = 'square-55d63'
var whiteSquareGrey = "#a9a9a9";
var blackSquareGrey = "#696969";

function removeGreySquares() {
	$("#board .square-55d63").css("background", "");
}

function greySquare(square) {
	var $square = $("#board .square-" + square);

    var background = whiteSquareGrey;
    if ($square.hasClass("black-3c85d")) {
        background = blackSquareGrey;
    }
    $square.css("background", background);
}

function removeHighlights (color) {
  $board.find('.' + squareClass)
    .removeClass('highlight-' + color)
}

function onDragStart (source, piece, position, orientation) {
  if (game.game_over()) return false

  if (piece.search(/^b/) !== -1) return false
}

function onDrop (source, target) {
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })

  if (move === null) return 'snapback'

  removeHighlights('white')
  $board.find('.square-' + source).addClass('highlight-white')
  $board.find('.square-' + target).addClass('highlight-white')

  window.setTimeout(makeRandomMove, 250)
}

function onMouseoverSquare(square, piece) {
    // get list of possible moves for this square
    var moves = game.moves({
        square: square,
        verbose: true,
    });

    // exit if there are no moves available for this square
    if (moves.length === 0) return;

    // highlight the square they moused over
    greySquare(square);

    // highlight the possible squares for this piece
    for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to);
    }
}

function onMouseoutSquare(square, piece) {
    removeGreySquares();
}

function onSnapEnd() {
    board.position(game.fen());
}

function makeRandomMove () {
  var possibleMoves = game.moves({
    verbose: true
  })

  if (possibleMoves.length === 0) return

  var randomIdx = Math.floor(Math.random() * possibleMoves.length)
  var move = possibleMoves[randomIdx]
  game.move(move.san)

  removeHighlights('black')
  $board.find('.square-' + move.from).addClass('highlight-black')
  squareToHighlight = move.to

  board.position(game.fen())
}

function onMoveEnd () {
  $board.find('.square-' + squareToHighlight)
    .addClass('highlight-black')
}

function onSnapEnd () {
  board.position(game.fen())
}

var config = {
    draggable: true,
    position: "start",
	dropOffBoard: "snapback",
	moveSpeed: "slow",
	snapbackSpeed: 500,
	snapSpeed: 100,
	showNotation: false,
	onDragStart: onDragStart,
    onDrop: onDrop,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare,
	onMoveEnd: onMoveEnd,
    onSnapEnd: onSnapEnd,
};

board = Chessboard("board", config);
