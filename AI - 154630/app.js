var tablero;
const player1 = 'O';
const player2 = 'X';
const combos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
startGame();

//Funcion para volver empezar la partida con el boton "restart"
function startGame() {
	document.querySelector(".endgame").style.display = "none";
	tablero = Array.from(Array(9).keys());
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}
//
function turnClick(square) {
	if (typeof tablero[square.target.id] == 'number') {
		turn(square.target.id, player1)
		if (!checkWin(tablero, player1) && !checkTie()) turn(bestSpot(), player2);
	}
}
//FUNCION que recibe 2 parametros y se encarga de que se pueda seleccionar
//en el tablero los 9 cuadros y que puedan hacer la acción
//ya que cada cuadro esta identificado con un id en la clase "cell" en el index.html
function turn(cellsId, player) {
	tablero[cellsId] = player;
	document.getElementById(cellsId).innerText = player;
	let gameWon = checkWin(tablero, player)
	if (gameWon) gameOver(gameWon)
}

// esta funcion se encarga  de usar el metodo reduce para recorrer cada elemento de la matriz
//por ejemplo a es el acomulador, e el elemento en el board, e i es el indice
//decimos que si el elemento es igual al jugador utilizamos la funcion concat lo cual nos hace tomar
//el arrary de la matriz del acomulador y añadimos el indice, esto nos hace saber que posiciones ha jugado el jugador y detectar el ganador
function checkWin(board, player) {
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of combos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

//Funcion que se encarga iluminar los cuadritos cuando se acompletan los 3 caracteres de forma diagonal
//horizontal o vertical y asi acabar el juego
function gameOver(gameWon) {
	for (let index of combos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == player1 ? "blue" : "red";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == player1 ? "Ganaste!" : "Perdiste!");
}

//Funcion para detectar ganador
function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
	return tablero.filter(s => typeof s == 'number');
}

function bestSpot() {
	return minimax(tablero, player2).index;
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Fin del juego!")
		return true;
	}
	return false;
}


//En la funcion minimax si player1  osea O gana debe de devolver un valor de -10 y si X cambia devuelve 10
//pero si la longitud de availSpots es igual a 0 significa que no hay mas espacio para jugar
function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, player1)) {
		return {score: -10};
	} else if (checkWin(newBoard, player2)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}

  //Despues se hace una matriz para los movimientos y se recorren los espacios vacios mientras se recopila
  //el indice y la puntuacon de cada movimiento
  //se establece el numero del indice que se almaceno como un numero en tablero, despues se agrega a"newBoard"
  //al jugador actual y se llama la funcion minimax, si la funcion no encuentra un estado terminal
  //sigue avanzando de forma recursiva nivel por nivel.
  //Finalmente la funcion minimax restablece "newBoard" y empuja el objeto de movimiento a la matriz "moves"
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == player2) {
			var result = minimax(newBoard, player1);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, player2);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}


//Aqui se encarga de evaluar el mejor movimiento en la matriz "moves" debera de elegir la puntuacion mas
//alta cuando se este jugando con player2 , y la puntuacion mas baja cuando nosotros estemos jugando
//por ejemplo "bestScore" en un numero muy bajo recorre la matriz de movimientos, si hay un movimiento con
// una puntuacion mas alta que "bestScore" el algoritmo guarda el movimiento
//Al final se devuelve el obejto almacenado en "besMove"

	var bestMove;
	if(player === player2) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}
