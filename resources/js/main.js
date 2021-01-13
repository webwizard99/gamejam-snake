const GridController = (function(){
  let gridSize = {
    width: 30,
    height: 30
  }

  const entityTypes = {
    snake: 'snake',
    apple: 'apple'
  }

  let gameGrid = [];

  let directionCheck = {
    left: [],
    right: [],
    up: [],
    down: []
  }

  const checkTile = (r, c, typeToCheck) => {
    // if tile has type return true
    if (gameGrid[r - 1][c - 1] === typeToCheck) {
      return true;
    } else {
        return false;
    }
  }

  const initializeGameGrid = () => {
    for (let col = 0; col < gridSize.width; col++) {
      gameGrid[col] = [];
      for (let row = 0; row < gridSize.height; row++) {
        gameGrid[col][row] = '';
      }
    }
  }

  const initializeDirectionChecks = () => {
    for (let col = 0; col < 3; col++) {
      directionCheck.left[col] = [];
      directionCheck.right[col] = [];
      directionCheck.up[col] = [];
      directionCheck.down[col] = [];
      for (let row = 0; row < 3; row++) {

      }
    }
  }

  return {
    setGridSize: function(h, w) {
      // if grid dimensions aren't numbers
      // above zero, quit
      if (!(h > 0 && w > 0)) {
          return;
      } else {
          gridSize.height = h;
          gridSize.width = w;
      }
    },
        
    getGridSize: function() {
        return gridSize;
    },

    checkTileForApple: function(r, c) {
        return checkTile(r, c, entityTypes.apple);
    },
    
    checkTileForSnake: function(r, c) {
      return checkTile(r, c, entityTypes.snake);
    },

    setTileToEntity: function(r, c, entity) {
      gameGrid[r -1][c -1] = entityTypes[entity];
    },

    clearTile: function(r, c) {
      gameGrid[r][c] = '';
    },

    getGameGrid: function() {
      return gameGrid;
    },

    getEntityTypes: function() {
      return entityTypes;
    },

    init: function() {
      initializeGameGrid();
    }
  }
}());

const SnakeController = (function(){
  let snake = [];

  let remainingGrowth = 0;

  const directions = {
    left: 'left',
    right: 'right',
    up: 'up',
    down: 'down'
  }

  let direction = directions.right;

  const addToSnake = (r, c) => {
    snake.push({row: r, col: c});
  }

  return {
    init: function(r, c) {
      addToSnake(r, c -2);
      addToSnake(r, c -1);
      addToSnake(r,c);
    },

    getSnake: function() {
      return snake;
    },

    getSnakeEnd: function() {
      return snake[0];
    },

    getSnakeHead: function() {
      return snake[snake.length -1];
    },

    moveSnake: function() {
      // if remainingGrowth > 0, add to snake only
      // and subtract remainingGrowth by 1

      // if remainingGroth === 0, add to snake based on direction
      // and remove snake[0]

      // don't forget to check if new snake head is out of bounds!
    },

    checkOverlap: function() {
      // check if snake head coordinates are contained
      // in any other tile of the snake

      // if so return true, and this means it's game over

      // also check if any snake coordinate is out of bounds
    },

    setRemainingGrowth: function(value) {
      remainingGrowth = value;
    }
  }
}());

const UIController = (function(){
  const DOMStrings = {
    snakeBoard: '#snake-board',
    tile: '.tile',
    snake: 'snakeTile',
    apple: 'appleTile'
  }

  const tileTemplate = `
    <div class="tile" data-index="%r%-%c%">
    </div>
  `;
  
  const rowBegin = `
    <div class="row snake-row">
  `;

  const rowEnd = `
    </div>
  `;

  return {
    drawGrid: function(h, w) {
      let board = document.querySelector(DOMStrings.snakeBoard);
      board.innerHTML = null;

      let boardT = '';

      // iterate over number of rows (h)
      for (let rowN = 0; rowN < h; rowN++) {
        boardT += rowBegin;

        // iterate over number of columns to create a tile for each
        for (let colN = 0; colN < w; colN++) {
          let Ttile = tileTemplate;
          Ttile = Ttile.replace('%r%', (rowN + 1).toString());
          Ttile = Ttile.replace('%c%', (colN + 1).toString());

          boardT += Ttile;
        }

        boardT += rowEnd;
      }

      board.innerHTML = boardT;
    },

    getDomStrings: function() {
      return DOMStrings;
    },

    clearTile: function(r, c) {
      let tile = document.querySelector(`[data-index="${r}-${c}"]`);
      tile.innerHTML = null;
    },

    setTileToEntity: function(r, c, entity) {
      let tile = document.querySelector(`[data-index="${r}-${c}"]`);
      console.log(tile);
      if (DOMStrings[entity]) {
        tile.innerHTML = `<div class=${DOMStrings[entity]}></div>`;
      }
    }
  }
}());

const Controller = (function(GridCtrl, SnakeCtrl, UICtrl){
  const updateFrames = 3;

  let playing = false;

  const growthAmount = 2;

  const update = () => {
    if (!playing) return;
  }

  const gameOver = () => {
    playing = false;
  }

  return {
    init: function() {
      playing = true;
      GridCtrl.init();
      const gridSize = GridCtrl.getGridSize();
      UICtrl.drawGrid(gridSize.height, gridSize.width);
      const startR = Math.floor(Math.random() * gridSize.height / 3) + Math.floor(gridSize.height / 3);
      const startC = Math.floor(Math.random() * gridSize.width / 3) + Math.floor(gridSize.width / 3);
      SnakeCtrl.init(startR, startC);
      const initSnake = SnakeCtrl.getSnake();
      const entyTypes = GridCtrl.getEntityTypes();
      initSnake.forEach(snakePiece => {
        UICtrl.setTileToEntity(snakePiece.row, snakePiece.col, entyTypes.snake);
      });
      const startRApple = Math.floor(Math.random() * gridSize.height / 2) + Math.floor(gridSize.height / 4);
      const startCApple = Math.floor(Math.random() * gridSize.width / 2) + Math.floor(gridSize.width / 4);
      GridCtrl.setTileToEntity(startRApple, startCApple, entyTypes.apple);
      UICtrl.setTileToEntity(startRApple, startCApple, entyTypes.apple);
      window.setInterval(update, (1000 / updateFrames));
    }
  }
}(GridController, SnakeController, UIController));

Controller.init();
