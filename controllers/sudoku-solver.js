class SudokuSolver {
  validate(puzzleString) {
    if (!puzzleString) {
      return { error: 'Required field missing' };
    }
    if (puzzleString.length != 81) {
      return {
        error: 'Expected puzzle to be 81 characters long',
      };
    }

    let cleanString = puzzleString.replace(/[^0-9.]/gi, '');
    if (cleanString.length != 81) {
      return { error: 'Invalid characters in puzzle' };
    }

    let splitArr = puzzleString.split('');
    let grid = [];

    for (let i = 0; i < 9; i++) {
      grid.push(splitArr.slice(i * 9, (i + 1) * 9));
    }

    let seenRow = {},
      seenCol = {},
      seenSubBox = {};

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        let value = grid[row][col];
        if (!(value === '.')) {
          let rowKey = `${row}-${value}`,
            colKey = `${col}-${value}`,
            boxKey = `${Math.floor(row / 3)}-${value}-${Math.floor(col / 3)}`;

          if (seenRow[rowKey] || seenCol[colKey] || seenSubBox[boxKey]) {
            return { error: 'Puzzle cannot be solved' };
          }
          seenRow[rowKey] = true;
          seenCol[colKey] = true;
          seenSubBox[boxKey] = true;
        }
      }
    }

    return { valid: true };
  }

  checkRowPlacement(puzzleString, row, column, value) {
    if (row < 1 || row > 9) {
      return { error: 'Invalid coordinate' };
    }
    if (column < 1 || column > 9) {
      return { error: 'Invalid coordinate' };
    }
    if (value < 1 || value > 9) {
      return { error: 'Invalid coordinate' };
    }

    let arr = puzzleString.split('');
    let rowArr = arr.slice((row - 1) * 9, row * 9);

    let currentLetter = rowArr[column - 1];
    if (currentLetter !== value + '' && rowArr.includes(value + '')) {
      return { valid: false };
    }
    return { valid: true };
  }

  checkColPlacement(puzzleString, row, column, value) {
    if (row < 1 || row > 9) {
      return { error: 'Invalid coordinate' };
    }
    if (column < 1 || column > 9) {
      return { error: 'Invalid coordinate' };
    }
    if (value < 1 || value > 9) {
      return { error: 'Invalid coordinate' };
    }

    let arr = puzzleString.split('');
    let colArr = [];
    for (let i = 0; i < 9; i++) {
      colArr.push(arr[i * 9 + column - 1]);
    }
    //console.log(colArr);
    let currentLetter = colArr[row - 1];
    if (currentLetter !== value + '' && colArr.includes(value + '')) {
      return { valid: false };
    }
    return { valid: true };
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    if (row < 1 || row > 9) {
      return { error: 'Invalid coordinate' };
    }
    if (column < 1 || column > 9) {
      return { error: 'Invalid coordinate' };
    }
    if (value < 1 || value > 9) {
      return { error: 'Invalid coordinate' };
    }
    let arr = puzzleString.split('');
    let regionArr = [];
    let rowStart = row < 4 ? 0 : row < 7 ? 3 : 6;
    let colStart = column < 4 ? 0 : column < 7 ? 3 : 6;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let index = (rowStart + i) * 9 + (colStart + j);
        regionArr.push(arr[index]);
      }
    }

    //console.log(regionArr);
    let currentLetter = arr[(row - 1) * 9 + (column - 1)];
    //console.log(regionArr);
    //console.log(currentLetter);
    if (currentLetter !== value + '' && regionArr.includes(value + '')) {
      return { valid: false };
    }
    return { valid: true };
  }

  solve(puzzleString) {
    let splitArr = puzzleString.split('');
    let grid = [];

    for (let i = 0; i < 9; i++) {
      grid.push(splitArr.slice(i * 9, (i + 1) * 9));
    }
    //let rowGrid = [];
    // let colGrid = [];
    // let regionGrid = [];
    // console.log('test');

    // for (let i = 0; i < 9; i++) {
    //   rowGrid.push(splitArr.slice(i * 9, (i + 1) * 9));
    //   for (let j = 0; j < 3; j++) {
    //     for (let k = 0; k < 3; k++) {
    //       if (colGrid[j * 3 + k]) {
    //         colGrid[j * 3 + k].push(splitArr[i * 9 + (j * 3 + k)]);
    //       } else {
    //         colGrid[j * 3 + k] = [splitArr[i * 9 + (j * 3 + k)]];
    //       }

    //       let gridIndex = i < 3 ? 0 : i < 6 ? 3 : 6;

    //       if (regionGrid[gridIndex + j]) {
    //         regionGrid[gridIndex + j].push(splitArr[i * 9 + (j * 3 + k)]);
    //       } else {
    //         regionGrid[gridIndex + j] = [splitArr[i * 9 + (j * 3 + k)]];
    //       }
    //     }
    //   }
    // }

    let continueSolve = true;
    let maxTry = 100;

    while (continueSolve) {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          let value = grid[row][col];
          if (value === '.') {
            let possibleNumbers = [];
            for (let i = 1; i <= 9; i++) {
              if (
                this.checkRowPlacement(splitArr.join(''), row + 1, col + 1, i)
                  .valid &&
                this.checkColPlacement(splitArr.join(''), row + 1, col + 1, i)
                  .valid &&
                this.checkRegionPlacement(
                  splitArr.join(''),
                  row + 1,
                  col + 1,
                  i
                ).valid
              ) {
                possibleNumbers.push(i);
              }
            }
            if (possibleNumbers.length === 1) {
              grid[row][col] = possibleNumbers[0] + '';
              splitArr[row * 9 + col] = possibleNumbers[0] + '';
            }
          }
        }
      }

      if (splitArr.join('').indexOf('.') == -1) {
        continueSolve = false;
      }
      maxTry--;
      if (maxTry == 0) {
        return { error: 'Puzzle cannot be solved' };
      }
    }

    if (this.validate(splitArr.join('')).valid) {
      return { valid: true, solution: splitArr.join('') };
    } else {
      return { error: 'Puzzle cannot be solved' };
    }
  }
}

module.exports = SudokuSolver;
