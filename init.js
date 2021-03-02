

class GameManager {
  rows = [];
  colums = [];
  cubes = [];
  sorter = (a,b) => a - b;
  constructor(target, cubeSize, callback) {
    this.target = target;
    this.cubeSize = cubeSize;
    for (let idx = 0; idx < cubeSize * cubeSize; idx++) {
      this.rows.push(new Array([]));
      this.colums.push(new Array([]));
      this.cubes.push(new Array([]));
    }
    this.drawCube(target);
    this.subscribeForChanges(callback);
  }

  drawCube(target) {
    target.innerHTML = "";
    let rowHTML = "";
    let colJump, rowJump;
    for (let cubeNumber = 0; cubeNumber < (this.cubeSize * this.cubeSize); cubeNumber++) {
      let tableHTML = "";
      rowJump = Math.floor(cubeNumber / this.cubeSize) * this.cubeSize;
      colJump = (cubeNumber % this.cubeSize) * this.cubeSize;
      let cellNumber = 0;
      for (let idxRow = 0; idxRow < this.cubeSize; idxRow++) {
        tableHTML += `<tr>`
        for (let idxCol = 0; idxCol < this.cubeSize; idxCol++) {
          tableHTML += 
            `<td>
              <input 
                  type="text" 
                  col="${idxCol + colJump + 1}"
                  row="${idxRow + rowJump + 1}"
                  cube-num="${cubeNumber + 1}"
                  cell-num="${cellNumber + 1}"
              />
            </td>`;
            cellNumber++;
        }
        tableHTML = `${tableHTML}</tr>`;
      }
      rowHTML += `<table>
        ${tableHTML}
      </table>`;
      if ((cubeNumber % this.cubeSize) == (this.cubeSize - 1)) {
        rowHTML = `<div class="row">
          ${rowHTML}
        </div>`;
        target.innerHTML += rowHTML;
        rowHTML = "";
      }
    }
  }

  subscribeForChanges(callback) {
    // subscribe for changes
    Array.from(this.target.querySelectorAll(".row table input")).forEach(element => {
      element.onkeyup = callback;
    });
  }

  isRowValid(rowNumber) {
      const row = [...this.rows[rowNumber - 1]].sort(this.sorter);
      for (let idx = 0; idx < this.cubeSize; idx++) {
        if (row[idx] != (idx + 1)) {
          return false;
        }
      }
      return true; 
  }

  isColumnValid(colNumber) {
      const col = [...this.colums[colNumber - 1]].sort(this.sorter);
      for (let idx = 0; idx < this.cubeSize; idx++) {
        if (col[idx] != (idx + 1)) {
          return false;
        }
      }
      return true; 
  }

  isCubeValid(cubeNumber) {
      const cube = [...this.cubes[cubeNumber - 1]].sort(this.sorter);
      for (let idx = 0; idx < this.cubeSize; idx++) {
        if (cube[idx] != (idx + 1)) {
          return false;
        }
      }
      return true; 
  }

  isBoardValid() {
    for(let idx = 1; idx <= this.cubeSize * this.cubeSize; idx++) {
      let res = this.isRowValid(idx);
      res = res && this.isColumnValid(idx);
      res = res && this.isCubeValid(idx);
      if (!res) {
        return false;
      }
      return true;
    }
  }

  updateRow(row, col, val) {
      this.rows[row][col] = val;
  }

  updateColum(col, row, val) {
      this.colums[col][row] = val;
  }

  updateCube(cubeNumber, cellNumber, val) {
      this.cubes[cubeNumber][cellNumber] = val;
  }

  generateNumbers(howManyNumbers) {
    while(howManyNumbers) {
      let cubeNumber = Math.floor(Math.random() * this.cubeSize * this.cubeSize) + 1;
      let cellNumber = Math.floor(Math.random() * (this.cubeSize * this.cubeSize)) + 1;
      const value = Math.floor(Math.random() * (this.cubeSize * this.cubeSize)) + 1;
      const inputElement = this.target.querySelector(`input[cube-num='${cubeNumber}'][cell-num='${cellNumber}']`);
      debugger;
      if (inputElement.value) {
        continue;
      }
      const colNumber = +inputElement.getAttribute("col") - 1;
      const rowNumber = +inputElement.getAttribute("row") - 1;
      cubeNumber--;
      cellNumber--
      let checkValidation = true;
      checkValidation = checkValidation && this.rows[rowNumber].indexOf(value) == -1;
      checkValidation = checkValidation && this.colums[colNumber].indexOf(value) == -1;
      checkValidation = checkValidation && this.cubes[cubeNumber].indexOf(value) == -1;
      if (checkValidation) {
        this.updateRow(rowNumber, colNumber, value);
        this.updateColum(colNumber, rowNumber, value);
        this.updateCube(cubeNumber, cellNumber, value);
        inputElement.value = +value;
        howManyNumbers--;
      }
    }
  }
}

const changeCallback = (event) => {
  const cubeNumber = +event.target.getAttribute("cube-num") - 1;
  const cellNumber = +event.target.getAttribute("cell-num") - 1;
  const colNumber = +event.target.getAttribute("col") -1;
  const rowNumber = +event.target.getAttribute("row") - 1;
  const value = +event.target.value;
  gameManager.updateRow(rowNumber, colNumber, value);
  gameManager.updateColum(colNumber, rowNumber, value);
  gameManager.updateCube(cubeNumber, cellNumber, value);
}


const CUBE_SIZE = prompt("Please enter the size of the cube: ", 3);
const gameManager = new GameManager(
  document.getElementById('target'), 
  +CUBE_SIZE,
  changeCallback
);


document.getElementById("checkGame").addEventListener("click", () => {
  if (gameManager.isBoardValid()) {
    window.alert("You solve the game !");
  } else {
    window.alert("You have a problem, try again");
  }
});

document.getElementById("easy").addEventListener("click", () => {
  let myGameManager = new GameManager(
    document.getElementById('target'), 
    +CUBE_SIZE,
    changeCallback
  );
  myGameManager.generateNumbers(10);
});
document.getElementById("medium").addEventListener("click", () => {
  let myGameManager = new GameManager(
    document.getElementById('target'), 
    +CUBE_SIZE,
    changeCallback
  );
  myGameManager.generateNumbers(20);
});

document.getElementById("hard").addEventListener("click", () => {
  let myGameManager = new GameManager(
    document.getElementById('target'), 
    +CUBE_SIZE,
    changeCallback
  );
  myGameManager.generateNumbers(30);
});







