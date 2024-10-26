const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let validPuzzleString =
  '769235418851496372432178956174569283395842761628713549283657194516924837947381625';

let inValidCharPuzzleString =
  'a.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';

let shortPuzzleString = '123';

let placementPuzzleString =
  '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';

let expectedValid =
  '135762984946381257728459613694517832812936745357824196473298561581673429269145378';

let noSolvePuzzleString =
  '9.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';

suite('Functional Tests', () => {
  //this.timeout(5000);
  // #1
  test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function (done) {
    chai
      .request(server)
      .post('/api/solve')
      .send({
        puzzle: placementPuzzleString,
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'valid', true);
        assert.property(res.body, 'solution', expectedValid);
        done();
      });
  });
  // #2
  test('Solve a puzzle with missing puzzle string: POST request to /api/solve', function (done) {
    chai
      .request(server)
      .post('/api/solve')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error', 'Required field missing');
        done();
      });
  });
  // #3
  test('Solve a puzzle with invalid characters: POST request to /api/solve', function (done) {
    chai
      .request(server)
      .post('/api/solve')
      .send({
        puzzle: inValidCharPuzzleString,
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error', 'Invalid characters in puzzle');
        done();
      });
  });
  // #4
  test('Solve a puzzle with incorrect length: POST request to /api/solve', function (done) {
    chai
      .request(server)
      .post('/api/solve')
      .send({
        puzzle: shortPuzzleString,
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(
          res.body,
          'error',
          'Expected puzzle to be 81 characters long'
        );
        done();
      });
  });
  // #5
  test('Solve a puzzle that cannot be solved: POST request to /api/solve', function (done) {
    chai
      .request(server)
      .post('/api/solve')
      .send({
        puzzle: noSolvePuzzleString,
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error', 'Puzzle cannot be solved');
        done();
      });
  });
  // #6
  test('Check a puzzle placement with all fields: POST request to /api/check', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: placementPuzzleString,
        coordinate: 'A1',
        value: 3,
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'valid', 'true');
        done();
      });
  });
  // #7
  test('Check a puzzle placement with single placement conflict: POST request to /api/check', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: placementPuzzleString,
        coordinate: 'A1',
        value: 4,
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'valid', 'false');
        assert.property(res.body, 'conflict', '[ "row" ]');
        done();
      });
  });
  // #8
  test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: placementPuzzleString,
        coordinate: 'A2',
        value: 1,
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'valid', 'false');
        assert.property(res.body, 'conflict', '[ "row", "region" ]');
        done();
      });
  });
  // #9
  test('Check a puzzle placement with all placement conflicts: POST request to /api/check', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: placementPuzzleString,
        coordinate: 'A2',
        value: 2,
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'valid', 'false');
        assert.property(res.body, 'conflict', '[ "row", "column", "region" ]');
        done();
      });
  });
  // #10
  test('Check a puzzle placement with missing required fields: POST request to /api/check', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: placementPuzzleString,
        coordinate: 'A2',
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error', 'Required field(s) missing');
        done();
      });
  });
  // #11
  test('Check a puzzle placement with invalid characters: POST request to /api/check', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: inValidCharPuzzleString,
        coordinate: 'A2',
        value: 2,
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error', 'Invalid characters in puzzle');
        done();
      });
  });
  // #12
  test('Check a puzzle placement with incorrect length: POST request to /api/check', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: shortPuzzleString,
        coordinate: 'A2',
        value: 2,
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(
          res.body,
          'error',
          'Expected puzzle to be 81 characters long'
        );
        done();
      });
  });
  // #13
  test('Check a puzzle placement with invalid characters: POST request to /api/check', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: inValidCharPuzzleString,
        coordinate: 'AA',
        value: 2,
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error', 'Invalid coordinate');
        done();
      });
  });
  // #14
  test('Check a puzzle placement with invalid characters: POST request to /api/check', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: inValidCharPuzzleString,
        coordinate: 'A2',
        value: 0,
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error', 'Invalid value');
        done();
      });
  });
});
