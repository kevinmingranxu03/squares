import * as assert from 'assert';
import { Square, solid, split, toJson, fromJson, findSquare, Path, replaceSquare } from './square';
import { nil, cons } from './list';


describe('square', function() {

  it('findSquare', function() {
    // TODO: write tests for findSquare() here
    // Statement coverage: executes 1st, 2nd, 3rd, 4th, and 5th branches, respectively
    const sq: Square = solid("white");
    assert.deepStrictEqual(findSquare(nil, sq), sq);

    const p1: Path = cons("NW", nil);
    const p2: Path = cons("NE", nil);
    const p3: Path = cons("SW", nil);
    const p4: Path = cons("SE", nil);
    const nw: Square = solid("blue");
    const ne: Square = solid("green");
    const sw: Square = solid("orange");
    const se: Square = solid("pink");
    const newSq: Square = split(nw, ne, sw, se);
    assert.deepStrictEqual(findSquare(p1, newSq), nw);
    assert.deepStrictEqual(findSquare(p2, newSq), ne);
    assert.deepStrictEqual(findSquare(p3, newSq), sw);
    assert.deepStrictEqual(findSquare(p4, newSq), se);

    // branch coverage: covered above, nil list executes 1st branch,
    // p1 and newSq executes 2nd branch, p2 and newSq executes 3rd branch,
    // p3 and newSq executes 4th branch, p4 and newSq executes 5th branch

    // Looping/recursive coverage: the above tests covered 0 case and 1 case

    // Looping/recursive coverage: many case
    const p5: Path = cons("NE", cons("SW", nil));
    const latestSq1: Square = split(nw, split(nw, ne, sw, se), sw, se);
    const latestSq2: Square = split(nw, split(nw, ne, split(nw, ne, sw, se), se), sw, se);
    assert.deepStrictEqual(findSquare(p5, latestSq1), sw);
    assert.deepStrictEqual(findSquare(p5, latestSq2), split(nw, ne, sw, se));
  });

  it('replaceSquare', function() {
    // TODO: write tests for replaceSquare() here
    // Statement coverage: executes 1st, 2nd, 3rd, 4th, and 5th branches, respectively
    const sq: Square = solid("purple");
    const nw: Square = solid("blue");
    const ne: Square = solid("green");
    const sw: Square = solid("orange");
    const se: Square = solid("pink");
    const root: Square = split(nw, ne, sw, se);
    assert.deepStrictEqual(replaceSquare(nil, sq, root), sq);

    const p1: Path = cons("NW", nil);
    const p2: Path = cons("NE", nil);
    const p3: Path = cons("SW", nil);
    const p4: Path = cons("SE", nil);
    const updatedRoot1: Square = split(sq, ne, sw, se);
    const updatedRoot2: Square = split(nw, sq, sw, se);
    const updatedRoot3: Square = split(nw, ne, sq, se);
    const updatedRoot4: Square = split(nw, ne, sw, sq);
    assert.deepStrictEqual(replaceSquare(p1, sq, root), updatedRoot1);
    assert.deepStrictEqual(replaceSquare(p2, sq, root), updatedRoot2);
    assert.deepStrictEqual(replaceSquare(p3, sq, root), updatedRoot3);
    assert.deepStrictEqual(replaceSquare(p4, sq, root), updatedRoot4);

    // branch coverage: covered above, nil list executes 1st branch,
    // p1, sq, and root executes 2nd branch, p2, sq, and root executes 3rd branch,
    // p3, sq, and root executes 4th branch, p4, sq, and root executes 5th branch

    // Looping/recursive coverage: the above tests covered 0 case and 1 case

    // Looping/recursive coverage: many case
    const p5: Path = cons("NE", cons("SW", nil));
    const newRoot: Square = split(nw, split(nw, ne, sw, se), sw, se);
    const updatedRoot5: Square = split(nw, split(nw, ne, sq, se), sw, se);
    assert.deepStrictEqual(replaceSquare(p5, sq, newRoot), updatedRoot5);
  });

  it('toJson', function() {
    assert.deepStrictEqual(toJson(solid("white")), "white");
    assert.deepStrictEqual(toJson(solid("green")), "green");

    const s1 = split(solid("blue"), solid("orange"), solid("purple"), solid("white"));
    assert.deepStrictEqual(toJson(s1),
      ["blue", "orange", "purple", "white"]);

    const s2 = split(s1, solid("green"), s1, solid("pink"));
    assert.deepStrictEqual(toJson(s2),
      [["blue", "orange", "purple", "white"], "green",
       ["blue", "orange", "purple", "white"], "pink"]);

    const s3 = split(solid("green"), s1, solid("yellow"), s1);
    assert.deepStrictEqual(toJson(s3),
      ["green", ["blue", "orange", "purple", "white"],
       "yellow", ["blue", "orange", "purple", "white"]]);
  });

  it('fromJson', function() {
    assert.deepStrictEqual(fromJson("white"), solid("white"));
    assert.deepStrictEqual(fromJson("green"), solid("green"));

    const s1 = split(solid("blue"), solid("orange"), solid("purple"), solid("white"));
    assert.deepStrictEqual(fromJson(["blue", "orange", "purple", "white"]), s1);

    assert.deepStrictEqual(
        fromJson([["blue", "orange", "purple", "white"], "green",
                 ["blue", "orange", "purple", "white"], "pink"]),
        split(s1, solid("green"), s1, solid("pink")));

    assert.deepStrictEqual(
        fromJson(["green", ["blue", "orange", "purple", "white"],
                  "yellow", ["blue", "orange", "purple", "white"]]),
        split(solid("green"), s1, solid("yellow"), s1));
  });

});
