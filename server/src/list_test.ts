import * as assert from 'assert';
import {
    nil, cons, len, equal, concat, rev, at, remove, prefix,
    compact_list, explode_array
  } from './list';

// Note: the tests provided here exceed the minimum number required by our
// course guidelines

describe('list', function() {

  it('len', function() {
    assert.deepStrictEqual(len(nil), 0n);

    assert.deepStrictEqual(len(cons(1n, nil)), 1n);
    assert.deepStrictEqual(len(cons(2n, nil)), 1n);

    assert.deepStrictEqual(len(cons(1n, cons(2n, nil))), 2n);
    assert.deepStrictEqual(len(cons(3n, cons(2n, cons(1n, cons(0n, nil))))), 4n);
  });

  it('equal', function() {
    assert.deepStrictEqual(equal(nil, nil), true);
    assert.deepStrictEqual(equal(nil, cons(1n, nil)), false);
    assert.deepStrictEqual(equal(cons(1n, nil), nil), false);
    assert.deepStrictEqual(equal(cons(1n, cons(2n, nil)), nil), false);
    assert.deepStrictEqual(equal(cons(1n, nil), cons(2n, nil)), false);
    assert.deepStrictEqual(equal(cons(7n, nil), cons(1n, cons(2n, nil))), false);

    assert.deepStrictEqual(equal(cons(3n, nil), cons(3n, nil)), true);
    assert.deepStrictEqual(equal(cons(5n, nil), cons(5n, cons(1n, nil))), false);
    assert.deepStrictEqual(equal(cons(4n, cons(1n, nil)), cons(4n, nil)), false);
    assert.deepStrictEqual(
        equal(cons(6n, cons(1n, cons(2n, nil))), cons(6n, nil)), false);
    assert.deepStrictEqual(
        equal(cons(5n, cons(1n, nil)), cons(5n, cons(2n, nil))), false);
    assert.deepStrictEqual(
        equal(cons(9n, cons(3n, nil)), cons(9n, cons(4n, cons(2n, nil)))), false);

    assert.deepStrictEqual(
        equal(cons(4n, cons(3n, nil)), cons(4n, cons(3n, nil))), true);
    assert.deepStrictEqual(
        equal(cons(7n, cons(6n, cons(1n, cons(4n, nil)))), cons(7n, cons(6n, cons(1n, cons(4n, nil))))), true);
    assert.deepStrictEqual(
        equal(cons(4n, cons(3n, cons(2n, nil))), cons(4n, cons(3n, cons(1n, cons(2n, nil))))), false);
  });

  it('concat', function() {
    assert.deepStrictEqual(concat(nil, nil), nil);
    assert.deepStrictEqual(concat(nil, cons(1n, nil)), cons(1n, nil));
    assert.deepStrictEqual(concat(nil, cons(1n, cons(2n, nil))), cons(1n, cons(2n, nil)));

    assert.deepStrictEqual(concat(cons(1n, nil), nil), cons(1n, nil));
    assert.deepStrictEqual(concat(cons(1n, nil), cons(2n, nil)), cons(1n, cons(2n, nil)));
    assert.deepStrictEqual(concat(cons(1n, nil), cons(2n, cons(3n, nil))),
        cons(1n, cons(2n, cons(3n, nil))));

    assert.deepStrictEqual(concat(cons(1n, cons(2n, nil)), nil), cons(1n, cons(2n, nil)));
    assert.deepStrictEqual(concat(cons(1n, cons(2n, nil)), cons(3n, nil)),
        cons(1n, cons(2n, cons(3n, nil))));
    assert.deepStrictEqual(concat(cons(1n, cons(2n, nil)), cons(3n, cons(4n, nil))),
        cons(1n, cons(2n, cons(3n, cons(4n, nil)))));
  });

  it('rev', function() {
    assert.deepStrictEqual(rev(nil), nil);

    assert.deepStrictEqual(rev(cons(1n, nil)), cons(1n, nil));
    assert.deepStrictEqual(rev(cons(2n, nil)), cons(2n, nil));

    assert.deepStrictEqual(rev(cons(1n, cons(2n, nil))), cons(2n, cons(1n, nil)));
    assert.deepStrictEqual(rev(cons(1n, cons(2n, cons(3n, nil)))),
        cons(3n, cons(2n, cons(1n, nil))));
  });

  it('at', function() {
    const L0 = nil;
    const L1 = cons(5n, nil);
    const L2 = cons(4n, cons(5n, nil));
    const L3 = cons(1n, cons(2n, cons(3n, nil)));
    const L4 = cons(9n, cons(8n, cons(7n, cons(6n, nil))));
  
    assert.throws(() => at(-1n, L0));
    assert.throws(() => at(0n, L0));
    assert.throws(() => at(-1n, L1));
    assert.throws(() => at(1n, L1));
  
    assert.deepStrictEqual(at(0n, L1), 5n);
    assert.deepStrictEqual(at(0n, L3), 1n);
  
    assert.throws(() => at(1n, L0));
    assert.throws(() => at(1n, cons(7n, nil)));
  
    assert.deepStrictEqual(at(1n, L2), 5n);
    assert.deepStrictEqual(at(1n, L3), 2n);
  
    assert.deepStrictEqual(at(2n, L3), 3n);
    assert.deepStrictEqual(at(2n, L4), 7n);
    assert.deepStrictEqual(at(3n, L4), 6n);
    assert.throws(() => at(3n, L3));
    assert.throws(() => at(4n, L4));
  });

  it('prefix', function() {
    const l5 = cons(1n, cons(2n, cons(3n, cons(4n, cons(5n, nil)))));

    assert.deepStrictEqual(prefix(0n, nil), nil);
    assert.deepStrictEqual(prefix(0n, cons(3n, nil)), nil);

    assert.deepStrictEqual(prefix(1n, cons(3n, nil)), cons(3n, nil));
    assert.deepStrictEqual(prefix(1n, l5), cons(1n, nil));

    assert.deepStrictEqual(prefix(2n, l5), cons(1n, cons(2n, nil)));
    assert.deepStrictEqual(prefix(4n, l5), cons(1n, cons(2n, cons(3n, cons(4n, nil)))));
    assert.deepStrictEqual(prefix(5n, l5), l5);

    // Error case branch: not enough elements for prefix
    assert.throws(() => prefix(6n, l5), Error);
    assert.throws(() => prefix(1n, nil), Error);
  });

  it('explode_array', function() {
    assert.deepStrictEqual(explode_array([]), nil);
    assert.deepStrictEqual(explode_array([1]), cons(1, nil));
    assert.deepStrictEqual(explode_array([8]), cons(8, nil));
    assert.deepStrictEqual(explode_array([1, 2]), cons(1, cons(2, nil)));
    assert.deepStrictEqual(explode_array([1, 2, 3]), cons(1, cons(2, cons(3, nil))));
  });


  it('compact_list', function() {
    assert.deepStrictEqual(compact_list(nil), []);

    assert.deepStrictEqual(compact_list(cons(1n, nil)), [1n]);
    assert.deepStrictEqual(compact_list(cons(8n, nil)), [8n]);

    assert.deepStrictEqual(compact_list(cons(1n, cons(2n, nil))), [1n, 2n]);
    assert.deepStrictEqual(compact_list(cons(3n, cons(2n, cons(1n, nil)))), [3n, 2n, 1n]);
  });


  it('remove', function() {
    assert.deepStrictEqual(remove(1n, nil), nil);
    assert.deepStrictEqual(remove(2n, nil), nil);

    assert.deepStrictEqual(remove(1n, cons(1n, nil)), nil);
    assert.deepStrictEqual(remove(1n, cons(2n, nil)), cons(2n, nil));

    assert.deepStrictEqual(remove(2n, cons(1n, cons(2n, nil))), cons(1n, nil));
    assert.deepStrictEqual(remove(1n, cons(1n, cons(2n, cons(3n, nil)))),
        cons(2n, cons(3n, nil)));
  });
});
