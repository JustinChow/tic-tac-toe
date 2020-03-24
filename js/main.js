"use strict"

const tictactoe = function(doc) {
  const gameBoard = function() {
    let _board = [["","",""],
      ["","",""],
      ["","",""],];
  
    const getBoard = function() {
      return _board;
    }
    
    const isGridOccupied = function(r, c) {
      if (_board[r][c] !== "") {
        return true;
      }
      else {
        return false;
      }
    }
    
    const play = function(player, r, c) {
      _board[r][c] = player.marker;
    }

    const resetBoard = function() {
      for (let r = 0; r < _board.length; r++) {
        for (let c = 0; c < _board[0].length; c++) {
          _board[r][c] = "";
        }
      }
    }
  
    return {isGridOccupied, play, getBoard, resetBoard};
  }();

  const displayHandler = function(board) {
    const updateBoard = function() {
      const gridElements = doc.querySelectorAll("#container div");
      let gridCounter = 0;
      for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[0].length; c++) {
          gridElements[gridCounter].textContent = board[r][c];
          gridCounter++;
        }
      }
    }

    const updateMessage = function(message) {
      const messageElement = doc.querySelector("#message");
      messageElement.textContent = message;
    }

    const setPlayerTurn = function(player) {
      updateMessage(`Current Turn: ${player.name}`);
    }

    const setWinner = function(player) {
      updateMessage(`Game over! ${player.name} wins!`);
    }

    const setTie = function() {
      updateMessage("It's a tie!");
    }

    return {updateBoard, setPlayerTurn, setWinner, setTie};
  }(gameBoard.getBoard());
  
  const playerFactory = function(name, marker) {
    return {name, marker};
  };

  const game = function() {
    let currPlayer = null;
    let player1 = null;
    let player2 = null;
    let isGameStarted = false;

    const startGame = function(p1, p2) {
      player1 = p1;
      player2 = p2;
      isGameStarted = true;
      gameBoard.resetBoard();
      displayHandler.updateBoard();

      if (Math.random() < 0.5) {
        currPlayer = player1;
      }
      else {
        currPlayer = player2;
      }
      displayHandler.setPlayerTurn(currPlayer);
    };

    const setWinner = function(player) {
      isGameStarted = false;
      displayHandler.setWinner(player);
    }

    const setTie = function() {
      isGameStarted = false;
      displayHandler.setTie();
    }

    const updateGameStatus = function() {
      const board = gameBoard.getBoard();

      let winner = false;
      //Check horizontal wins
      for(let r = 0; r < board.length; r++) {
        if (board[r][0] !== "" && board[r][0] === board[r][1] && board[r][1] === board[r][2]) {
          winner = true;
          break;
        }
      }

      //Check vertical wins
      for(let c = 0; c < board.length; c++) {
        if (board[0][c] !== "" && board[0][c] === board[1][c] && board[1][c] === board[2][c]) {
          winner = true;
          break;
        }
      }

      //Check diagonal wins
      if (board[0][0] !== "" && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
        winner = true;
      }
      else if (board[0][2] !== "" && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
        winner = true;
      }

      if (winner) {
        setWinner(currPlayer);
      }
      else {
        //Check if moves are still available
        let movesAvailable = false;
        for (let r = 0; r < board.length; r++) {
          for (let c = 0; c < board[0].length; c++) {
            if (board[r][c] === "") {
              movesAvailable = true;
              break;
            }
          }
        }
        if (!movesAvailable) {
          setTie();
        }
        else {
          //No tie or winner, so change turn to next player
          if (currPlayer === player1) {
            currPlayer = player2;
            displayHandler.setPlayerTurn(player2);
          }    
          else {
            currPlayer = player1;
            displayHandler.setPlayerTurn(player1);
          }
        } 
      }
    }

    const playerMove = function(player, r, c) {
      if (gameBoard.isGridOccupied(r,c)) {
        alert("Can't play there!");
        return
      }
      
      gameBoard.play(currPlayer, r, c);
      displayHandler.updateBoard();
      updateGameStatus();
    }
  
    const initializeGame = function() {
      const startButton = doc.querySelector('#buttonStartGame');
      const p1NameElement = doc.querySelector("#p1-name");
      const p2NameElement = doc.querySelector("#p2-name");
      const p1Markers = doc.querySelectorAll("input[name=p1-marker]");
      const p2Markers = doc.querySelectorAll("input[name=p2-marker]");

      const gridClickHandler = function(e) {
        if (isGameStarted) {
          let row = parseInt(this.getAttribute("data-row"));
          let col = parseInt(this.getAttribute("data-col"));
          playerMove(currPlayer, row, col);
        }
      }
  
      displayHandler.updateBoard();


      startButton.addEventListener('click', event => {
        if (p1NameElement.value === "") {
          alert("Player 1 name can't be empty");
          return;
        }
        if (p2NameElement.value === "") {
          alert("Player 2 name can't be empty");
          return;
        }
        
        let p1Marker = null;
        for (let i = 0; i < p1Markers.length; i++) {
          if (p1Markers[i].checked) {
            p1Marker = p1Markers[i].value;
          }
        }
  
        let p2Marker = null;
        for (let i = 0; i < p2Markers.length; i++) {
          if (p2Markers[i].checked) {
            p2Marker = p2Markers[i].value;
          }
        }
  
        if (p1Marker === p2Marker) {
          alert("Player 1 and Player 2 cannot have the same marker");
          return;
        }
  
        const p1 = playerFactory(p1NameElement.value, p1Marker);
        const p2 = playerFactory(p2NameElement.value, p2Marker);
        startGame(p1, p2);
  
      });

      const gridElements = doc.querySelectorAll("#container div");
      for (let i = 0; i < gridElements.length; i++) {
        gridElements[i].addEventListener('click', gridClickHandler);
      }
    }

    return {initializeGame}
  }();

  


  return {game}
}(document);


tictactoe.game.initializeGame();