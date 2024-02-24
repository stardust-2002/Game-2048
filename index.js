const Direction = {
  Left: 'left',
  Right: 'right',
  Up: 'up',
  Down: 'down'
}

const SLIDE_RESULT = {
  NOTHING: -1,
  SLIDE: 0,
  MERGE: 1
}

function createBoard(mainGameBox) {
  this.element = mainGameBox;
  this.cells = [];
  this.freeCells = [];
  const lis = this.element.querySelectorAll('li');
  for (let i = 0; i < 4; i++) {
    let temp = [];
    for (let j = 0; j < 4; j++) {
      temp.push(lis[i * 4 + j]);
    }
    this.cells.push(temp);
  }

  this.clear = function () {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        while (this.cells[i][j].hasChildNodes()) {
          this.cells[i][j].removeChild(this.cells[i][j].firstChild);
        }
      }
    }
    this.updateFreeCells();
  }

  this.updateFreeCells = function () {
    this.freeCells = [];
    for (let i = 0; i < lis.length; i++) {
      if (lis[i].childElementCount === 0)
        this.freeCells.push(lis[i]);
    }
  }
  this.updateFreeCells();

  this.isNotFree = function (cell) {
    for (let i = 0; i < this.freeCells.length; i++) {
      if (this.freeCells[i] === cell) return false;
    }
    return true;
  }

  this.slideUp = function () {
    let result = SLIDE_RESULT.NOTHING;
    //对每一列滑动
    for (let i = 0; i < 4; i++) {
      //连续非空的最后一个
      let lastNotFree = -1;
      for (let j = 0; j < 4; j++) {
        if (this.isNotFree(this.cells[j][i])) {
          if (lastNotFree + 1 !== j) {
            //移动
            result = SLIDE_RESULT.SLIDE;
            this.cells[lastNotFree + 1][i].appendChild(this.cells[j][i].lastChild);
          }
          if (lastNotFree === -1) {
            lastNotFree = 0;
          } else if (this.cells[lastNotFree][i].lastChild.innerHTML === this.cells[lastNotFree + 1][i].lastChild.innerHTML) {
            //合并
            result = SLIDE_RESULT.MERGE;
            this.cells[lastNotFree][i].lastChild.innerHTML *= 2;
            this.cells[lastNotFree + 1][i].lastChild.remove();
          } else {
            lastNotFree++;
          }
        }
      }
    }
    return result;
  }

  this.slideDown = function () {
    let result = SLIDE_RESULT.NOTHING;
    for (let i = 0; i < 4; i++) {
      let lastNotFree = 4;
      for (let j = 3; j > -1; j--) {
        if (this.isNotFree(this.cells[j][i])) {
          if (lastNotFree - 1 !== j) {
            //移动
            result = SLIDE_RESULT.SLIDE;
            this.cells[lastNotFree - 1][i].appendChild(this.cells[j][i].lastChild);
          }
          if (lastNotFree === 4) {
            lastNotFree = 3;
          } else if (this.cells[lastNotFree][i].lastChild.innerHTML === this.cells[lastNotFree - 1][i].lastChild.innerHTML) {
            //合并
            result = SLIDE_RESULT.MERGE;
            this.cells[lastNotFree][i].lastChild.innerHTML *= 2;
            this.cells[lastNotFree - 1][i].lastChild.remove();
          } else {
            lastNotFree--;
          }
        }
      }
    }
    return result;
  }

  this.slideLeft = function () {
    let result = SLIDE_RESULT.NOTHING;
    //对每一行滑动
    for (let i = 0; i < 4; i++) {
      let lastNotFree = -1;
      for (let j = 0; j < 4; j++) {
        if (this.isNotFree(this.cells[i][j])) {
          if (lastNotFree + 1 !== j) {
            //移动
            result = SLIDE_RESULT.SLIDE;
            this.cells[i][lastNotFree + 1].appendChild(this.cells[i][j].lastChild);
          }
          if (lastNotFree === -1) {
            lastNotFree = 0;
          } else if (this.cells[i][lastNotFree].lastChild.innerHTML === this.cells[i][lastNotFree + 1].lastChild.innerHTML) {
            //合并
            result = SLIDE_RESULT.MERGE;
            this.cells[i][lastNotFree].lastChild.innerHTML *= 2;
            this.cells[i][lastNotFree + 1].lastChild.remove();
          } else {
            lastNotFree++;
          }
        }
      }
    }
    return result;
  }

  this.slideRight = function () {
    let result = SLIDE_RESULT.NOTHING;
    //对每一行滑动
    for (let i = 0; i < 4; i++) {
      let lastNotFree = 4;
      for (let j = 3; j > -1; j--) {
        if (this.isNotFree(this.cells[i][j])) {
          if (lastNotFree - 1 !== j) {
            //移动
            result = SLIDE_RESULT.SLIDE;
            this.cells[i][lastNotFree - 1].appendChild(this.cells[i][j].lastChild);
          }
          if (lastNotFree === 4) {
            lastNotFree = 3;
          } else if (this.cells[i][lastNotFree].lastChild.innerHTML === this.cells[i][lastNotFree - 1].lastChild.innerHTML) {
            //合并
            result = SLIDE_RESULT.MERGE;
            this.cells[i][lastNotFree].lastChild.innerHTML *= 2;
            this.cells[i][lastNotFree - 1].lastChild.remove();
          } else {
            lastNotFree--;
          }
        }
      }
    }
    return result;
  }

  this.slide = function (direction) {
    let slideRes;
    switch (direction) {
      //如果向上滑动
      case Direction.Up:
        slideRes = this.slideUp();
        break;
      //向下滑动
      case Direction.Down:
        slideRes = this.slideDown();
        break;
      //左滑  
      case Direction.Left:
        slideRes = this.slideLeft();
        break;
      //右滑  
      case Direction.Right:
        slideRes = this.slideRight();
        break;
      default:
        console.log('error');
    }
    this.updateFreeCells();
    if (slideRes !== SLIDE_RESULT.NOTHING) {
      //出现新的随机数字块
      new createNumberBlock().occur(board.freeCells);
    }
  }
}

function createNumberBlock(value) {
  this.element = document.createElement('div');
  this.value = value ? value : Math.floor(Math.random() + 1.3) * 2;
  this.element.innerHTML = this.value;
  this.element.classList.add('number-block')

  this.occur = function (freeCells) {
    if (freeCells.length === 0) console.log('没有空位');
    const randomNum = Math.floor(Math.random() * freeCells.length);
    freeCells[randomNum].appendChild(this.element);
    freeCells.splice(randomNum, 1);
  }
}

function createGame(board) {
  this.board = board;
  this.element = document.querySelector('body');
  this.failBox = document.querySelector('.curtain');
  this.restartButton = document.querySelector('#restart');

  this.restart = function () {
    this.failBox.classList.add('hide');
    this.board.clear();
    let numberBlock = new createNumberBlock(2);
    numberBlock.occur(this.board.freeCells);
    this.element.addEventListener('keyup', (e) => {
      switch (e.key) {
        case 'ArrowUp':
          this.board.slide(Direction.Up)
          break;
        case 'ArrowDown':
          this.board.slide(Direction.Down)
          break;
        case 'ArrowLeft':
          this.board.slide(Direction.Left)
          break;
        case 'ArrowRight':
          this.board.slide(Direction.Right)
          break;
      }
      if (this.isFail()) {
        this.failBox.classList.remove('hide');
      }
    })
    this.restartButton.addEventListener('click', () => {
      this.restart();
    })
  }

  this.isFail = function () {
    if (this.board.freeCells.length !== 0) {
      return false;
    } else {
      //探查是否还有可合并的数字块
      const cells = this.board.cells;
      for (let i = 0; i < 4; i++) {
        for (let j = 1; j < 4; j++) {
          if (cells[i][j].firstChild.innerHTML === cells[i][j - 1].firstChild.innerHTML
            || cells[j][i].firstChild.innerHTML === cells[j - 1][i].firstChild.innerHTML) {
            return false;
          }
        }
      }
    }
    return true;
  }
}

let mainGameBox = document.querySelector('.main-game-box');
let board = new createBoard(mainGameBox);
let game = new createGame(board);
game.restart();