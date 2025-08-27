import { List, nil, cons, concat } from './list';

/**
 * Maintains a list of key-value pairs, providing the ability to
 * set a key to a value, check if a key is in the list, get a list
 * of the keys of the list, and get the value associated with a key
 * in the list. These keys will be strings
 */
export interface Map<V> {
  /**
   * Creates a new Map containing the pairs from the given list
   * plus the new pair: (key, value).
   * Replaces any existing pair with given key.
   *
   * @param key to update the value of
   * @param value to set for the given key
   * @modifies obj
   * @effects obj = set-value(k, v, obj_0), where
   *      set-value(k, v, nil)          := (k, v) :: nil
   *      set-value(k, v, (x, y) :: R)  := (k, v) :: R                   if x = k
   *      set-value(k, v, (x, y) :: R)  := (x, y) :: set-value(k, v, R)  if x != k
   *   get-value(k, set-value(k, v, obj)) = v
   *   and contains-key(k, set-value(k, v, obj)) = true
   */
  setValue: (key: string, value: V) => Map<V>;


  /**
   * Determines if the given key is within a pair in the assoc list
   * @param x key to determine if list contains
   * @returns contains-key(x, obj), where
   *  contains-key: (S*, Map<V>) -> B
   *      contains-key(x, nil)          := false
   *      contains-key(x, (y, v) :: R)  := true                if x = y
   *      contains-key(x, (y, v) :: R)  := contains-key(x, R)  if x != y
   */
  containsKey: (x: string) => boolean;


  /**
   * Gets set of keys in the assoc list
   * @returns get-keys(obj) compacted into an array, where
   *  get-keys: Map<V> -> List<S*>
   *      get-keys(nil)          := nil
   *      get-keys((y, v) :: R)  := y :: get-keys(R)
   */
  getKeys: () => List<string>;

  /**
   * Gets the value paired with the first instance of the given key
   * in the given list
   * @param x key to find the corresponding value for
   * @returns get-value(x, obj), where
   *  get-value: (S*, Map<V>) -> V
   *      get-value(x, (y, v) :: R)  := v                if x = y
   *      get-value(x, (y, v) :: R)  := get-value(x, R)  if x != y
   *  (get-value is only defined on Maps, L, where contains-key(x, L))
   * @throws Error when contains-key(x, obj) = false
   */
  getValue: (x: string) => V;

}

/**
 * An association list is a list of key-value pairs, where keys are strings
 * and values have type V
 */
class AssocList<V> implements Map<V> {
  // RI: noDuplicates(get-keys(obj))), get-keys(obj) = this.keys
  // AF: obj = this.list
  readonly list: List<[string, V]>;
  readonly keys: List<string>;

  /**
   * Construct a new AssocList such that obj = list
   * @param list passed in key-value list to be used as a start for obj
   * @requires noDuplicates(get-keys(list)) = true
   */
  constructor(list: List<[string, V]>) {
    this.list = list;
    this.keys = this.constructKeysHelper(list);
  }

  // @returns get-keys(L) where
  //      get-keys: List<S*, V> -> List<S*>
  //   get-keys(nil)          := nil
  //   get-keys((y, v) :: R)  := y :: get-keys(R)
  constructKeysHelper = (L: List<[string, V]>): List<string> => {
    if (L.kind === "nil") {
      return nil;
    } else {
      const [y, _v]: [string, V] = L.hd;
      return cons(y, this.constructKeysHelper(L.tl));
    }
  }

  setValue = (key: string, value: V): AssocList<V> => {
    return new AssocList(this.setValueHelper(key, value, this.list));
  };

  setValueHelper = (key: string, value: V, L: List<[string, V]>): List<[string, V]> => {
    if (L.kind === "nil") {
      return cons([key, value], nil);
    } else {
      const [x, _y]: [string, V] = L.hd;
      if (key === x) {
        return concat(cons([key, value], nil), L.tl);
      } else {
        return cons(L.hd, this.setValueHelper(key, value, L.tl));
      }
    }
  };


  containsKey = (x: string): boolean => {
    return this.containsKeyHelper(x, this.list);
  };

  containsKeyHelper = (x: string, L: List<[string, V]>): boolean => {
    if (L.kind === "nil") {
      return false;
    } else {
      const [y, _v]: [string, V] = L.hd;
      if (x === y) {
        return true;
      } else {
        return this.containsKeyHelper(x, L.tl);
      }
    }
  };


  getKeys = (): List<string> => {
    return this.keys;
  };

  getValue = (x: string): V => {
    return this.getValueHelper(x, this.list);
  };

  getValueHelper = (x: string, L: List<[string, V]>): V => {
    if (L.kind === "nil") {
      throw new Error("key is not contained in Map");
    } else {
      const [y, v]: [string, V] = L.hd;
      if (x === y) {
        return v;
      } else {
        return this.getValueHelper(x, L.tl);
      }
    }
  };

}

/**
 * Creates a new Map
 * @returns new Map object
 */
export const newAssocMap = <V>(): Map<V> => {
  return new AssocList(nil);
}