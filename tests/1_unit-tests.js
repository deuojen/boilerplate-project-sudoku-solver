const chai = require('chai');
const assert = chai.assert;

const SudokuSolver = require('../controllers/sudoku-solver.js');
let solver;

let validPuzzleString =
  '769235418851496372432178956174569283395842761628713549283657194516924837947381625';

let inValidPuzzleString =
  '7692354188514963724321789561745692833958427616287135492836571945169248379473816aa';

let shortPuzzleString = '123';

let placementPuzzleString =
  '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';

suite('Unit Tests', () => {
  // #1
  test('Logic handles a valid puzzle string of 81 characters', function () {
    solver = new SudokuSolver();
    let result = solver.validate(validPuzzleString);
    assert.isTrue(result.valid);
  });
  // #2
  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function () {
    solver = new SudokuSolver();
    let result = solver.validate(inValidPuzzleString);
    assert.equal(result.error, 'Invalid characters in puzzle');
  });
  // #3
  test('Logic handles a puzzle string that is not 81 characters in length', function () {
    solver = new SudokuSolver();
    let result = solver.validate(shortPuzzleString);
    assert.equal(result.error, 'Expected puzzle to be 81 characters long');
  });
  // #4
  test('Logic handles a valid row placement', function () {
    solver = new SudokuSolver();
    let result = solver.checkRowPlacement(placementPuzzleString, 1, 2, 3);
    assert.isTrue(result.valid);
    result = solver.checkRowPlacement(placementPuzzleString, 1, 1, 1);
    assert.isTrue(result.valid);
  });
  // #5
  test('Logic handles an invalid row placement', function () {
    solver = new SudokuSolver();
    let result = solver.checkRowPlacement(placementPuzzleString, 10, 2, 3);
    assert.equal(result.error, 'Invalid coordinate');

    result = solver.checkRowPlacement(placementPuzzleString, 2, 10, 3);
    assert.equal(result.error, 'Invalid coordinate');

    result = solver.checkRowPlacement(placementPuzzleString, 2, 2, 0);
    assert.equal(result.error, 'Invalid coordinate');

    result = solver.checkRowPlacement(placementPuzzleString, 1, 1, 2);
    assert.isFalse(result.valid);

    result = solver.checkRowPlacement(placementPuzzleString, 1, 2, 1);
    assert.isFalse(result.valid);
  });
  // #6
  test('Logic handles a valid column placement', function () {
    solver = new SudokuSolver();
    let result = solver.checkColPlacement(placementPuzzleString, 1, 2, 3);
    assert.isTrue(result.valid);
    result = solver.checkColPlacement(placementPuzzleString, 1, 1, 1);
    assert.isTrue(result.valid);
  });
  // #7
  test('Logic handles an invalid column placement', function () {
    solver = new SudokuSolver();
    let result = solver.checkColPlacement(placementPuzzleString, 10, 2, 3);
    assert.equal(result.error, 'Invalid coordinate');

    result = solver.checkColPlacement(placementPuzzleString, 2, 10, 3);
    assert.equal(result.error, 'Invalid coordinate');

    result = solver.checkColPlacement(placementPuzzleString, 2, 2, 0);
    assert.equal(result.error, 'Invalid coordinate');

    result = solver.checkColPlacement(placementPuzzleString, 1, 3, 6);
    assert.isFalse(result.valid);

    result = solver.checkColPlacement(placementPuzzleString, 1, 2, 9);
    assert.isFalse(result.valid);
  });
  // #8
  test('Logic handles a valid region (3x3 grid) placement', function () {
    solver = new SudokuSolver();
    let result = solver.checkRegionPlacement(placementPuzzleString, 1, 2, 3);
    assert.isTrue(result.valid);
    result = solver.checkRegionPlacement(placementPuzzleString, 1, 1, 1);
    assert.isTrue(result.valid);
  });
  // #9
  test('Logic handles an invalid region (3x3 grid) placement', function () {
    solver = new SudokuSolver();
    let result = solver.checkRegionPlacement(placementPuzzleString, 10, 2, 3);
    assert.equal(result.error, 'Invalid coordinate');

    result = solver.checkRegionPlacement(placementPuzzleString, 2, 10, 3);
    assert.equal(result.error, 'Invalid coordinate');

    result = solver.checkRegionPlacement(placementPuzzleString, 2, 2, 0);
    assert.equal(result.error, 'Invalid coordinate');

    result = solver.checkRegionPlacement(placementPuzzleString, 1, 3, 1);
    assert.isFalse(result.valid);

    result = solver.checkRegionPlacement(placementPuzzleString, 3, 3, 6);
    assert.isFalse(result.valid);
  });
  // #10
  test('Valid puzzle strings pass the solver', function () {
    solver = new SudokuSolver();
    let result = solver.solve(placementPuzzleString);
    //console.log(result);
    assert.isTrue(result.valid);
  });
  // #11
  test('Invalid puzzle strings fail the solver', function () {
    solver = new SudokuSolver();
    let result = solver.solve(inValidPuzzleString);
    //console.log(result);
    assert.equal(result.error, 'Puzzle cannot be solved');
  });
  // #12
  test('Solver returns the expected solution for an incomplete puzzle', function () {
    solver = new SudokuSolver();
    let result = solver.solve(placementPuzzleString);
    //console.log(result);
    assert.isTrue(result.valid);
  });
});
