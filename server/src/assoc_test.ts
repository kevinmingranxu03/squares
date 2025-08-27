import * as assert from 'assert';
import { nil, cons } from './list';
import { Map, newAssocMap } from './assoc';

// Note: the tests provided here may exceed the minimum number required by our
// course guidelines

describe('assoc', function() {

  it('setValue', function() {
    // Add many new pairs and confirm they are all added
    let L0: Map<number> = newAssocMap();
    L0 = L0.setValue("d", -12);
    L0 = L0.setValue("c", 7);
    L0 = L0.setValue("b", 5);
    L0 = L0.setValue("a", 1);
    assert.strictEqual(L0.getValue("d"), -12);
    assert.strictEqual(L0.getValue("b"), 5);
    assert.strictEqual(L0.getValue("c"), 7);
    assert.strictEqual(L0.getValue("a"), 1);

    // First initialize a list and confirm key's value is retrieved correctly
    const L1: Map<number> = newAssocMap<number>().setValue("b", 2);
    assert.strictEqual(L1.getValue("b"), 2);

    // Change value of key and confirm change occurred
    const L2: Map<number> = L1.setValue("b", 3);
    assert.notStrictEqual(L2.getValue("b"), 2);
    assert.strictEqual(L2.getValue("b"), 3);
    const L3: Map<number> = L2.setValue("b", 2);
    assert.strictEqual(L3.getValue("b"), 2);
  });

  it('containsKey', function() {
    const nilL: Map<number> = newAssocMap();
    assert.strictEqual(nilL.containsKey("a"), false);
    assert.strictEqual(nilL.containsKey("b"), false);

    const L0: Map<number> = newAssocMap<number>().setValue("b", 2);
    assert.strictEqual(L0.containsKey("a"), false);
    assert.strictEqual(L0.containsKey("b"), true);

    const L1: Map<number> = newAssocMap<number>().setValue("c", 3)
                                                 .setValue("b", 2)
                                                 .setValue("a", 1);
    const L2: Map<number> = newAssocMap<number>().setValue("d", 9)
                                                 .setValue("c", 6)
                                                 .setValue("b", 5)
                                                 .setValue("a", 4);
    assert.strictEqual(L1.containsKey("c"), true);
    assert.strictEqual(L1.containsKey("d"), false);
    assert.strictEqual(L2.containsKey("d"), true);
  });

  it('getKeys', function() {
    const nilL: Map<number> = newAssocMap();
    assert.deepStrictEqual(nilL.getKeys(), nil);
    assert.deepStrictEqual(nilL.getKeys(), nil);

    const L0: Map<number> = newAssocMap<number>().setValue("a", 1);
    const L1: Map<number> = newAssocMap<number>().setValue("b", 2);
    assert.deepStrictEqual(L0.getKeys(), cons("a", nil));
    assert.deepStrictEqual(L1.getKeys(), cons("b", nil));

    const L2: Map<number> = newAssocMap<number>().setValue("c", 3)
                                                 .setValue("b", 2)
                                                 .setValue("a", 1);
    const L3: Map<number> = newAssocMap<number>().setValue("d", 9)
                                                 .setValue("c", 6)
                                                 .setValue("b", 5)
                                                 .setValue("a", 4);
    assert.deepStrictEqual(L2.getKeys(), cons("c", cons("b", cons("a", nil))));
    assert.deepStrictEqual(L3.getKeys(), cons("d", cons("c", cons("b", cons("a", nil)))));
  });

  it('getValue', function() {
    const L1: Map<number> = newAssocMap<number>().setValue("c", 3)
                                                 .setValue("b", 2)
                                                 .setValue("a", 1);
    const L2: Map<number> = newAssocMap<number>().setValue("d", 9)
                                                 .setValue("c", 6)
                                                 .setValue("b", 5)
                                                 .setValue("a", 4);

    assert.strictEqual(L1.getValue("a"), 1);
    assert.strictEqual(L2.getValue("a"), 4);

    assert.strictEqual(L1.getValue("b"), 2);
    assert.strictEqual(L2.getValue("b"), 5);

    assert.strictEqual(L1.getValue("c"), 3);
    assert.strictEqual(L2.getValue("d"), 9);
  });

});
