'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  let solver = new SudokuSolver();

  let validCoordinate = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];

  app.route('/api/check').post((req, res) => {
    if (!req.body.coordinate || !req.body.value || !req.body.puzzle) {
      res.json({ error: 'Required field(s) missing' });
      return;
    }
    //console.log(!req.body.coordinate, !req.body.value);
    let puzzle = req.body.puzzle;
    let response = solver.validate(puzzle);
    if (response.valid) {
      let coordinate = req.body.coordinate;
      let value = parseInt(req.body.value);
      //console.log(value < 1 || value > 9);

      if (isNaN(value) || value < 1 || value > 9) {
        res.json({ error: 'Invalid value' });
        return;
      }

      if (coordinate.length < 1 || coordinate.length > 2) {
        res.json({ error: 'Invalid coordinate' });
        return;
      }
      //console.log(coordinate[0].toLowerCase());
      let row = validCoordinate.indexOf(coordinate[0].toLowerCase());
      if (row < 0) {
        res.json({ error: 'Invalid coordinate' });
        return;
      }
      let column = parseInt(coordinate[1]);
      if (isNaN(column) || column < 1 || column > 9) {
        res.json({ error: 'Invalid coordinate' });
        return;
      }

      let conflicts = [];
      //console.log(puzzle, row, column, value);
      let rowConflict = solver.checkRowPlacement(
        puzzle,
        row + 1,
        column,
        value
      );
      //console.log(rowConflict);
      if (!rowConflict.valid) {
        conflicts.push('row');
      }
      let columnConflict = solver.checkColPlacement(
        puzzle,
        row + 1,
        column,
        value
      );
      if (!columnConflict.valid) {
        conflicts.push('column');
      }
      let regionConflict = solver.checkRegionPlacement(
        puzzle,
        row + 1,
        column,
        value
      );
      if (!regionConflict.valid) {
        conflicts.push('region');
      }

      if (conflicts.length > 0) {
        res.json({ valid: false, conflict: conflicts });
        return;
      }

      res.json({ valid: true });
    } else {
      res.json(response);
      return;
    }
  });

  app.route('/api/solve').post((req, res) => {
    let puzzle = req.body.puzzle;
    let response = solver.validate(puzzle);
    if (response.valid ?? false == true) {
      let solution = solver.solve(puzzle);
      console.log(solution);
      res.json(solution);
    } else {
      res.json(response);
    }
  });
};
