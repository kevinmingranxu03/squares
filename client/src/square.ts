import { List } from './list';


export type Color = "white" | "pink" | "orange" | "yellow" | "green" | "blue" | "purple";

/**
 * Converts a string to a color (or throws an exception if not a color).
 * @param s string to convert to color
 */
export const toColor = (s: string): Color => {
  switch (s) {
    case "white": case "pink": case "orange": case "yellow":
    case "green": case "blue": case "purple":
      return s;

    default:
      throw new Error(`unknown color "${s}"`);
  }
};

export type Square =
    | {readonly kind: "solid", readonly color: Color}
    | {readonly kind: "split", readonly nw: Square, readonly ne: Square,
       readonly sw: Square, readonly se: Square};

/**
 * Returns a solid square of the given color.
 * @param color of square to return
 * @returns square of given color
 */
export const solid = (color: Color): Square => {
  return {kind: "solid", color: color};
};

/**
 * Returns a square that splits into the four given parts.
 * @param nw square in nw corner of returned square
 * @param ne square in ne corner of returned square
 * @param sw square in sw corner of returned square
 * @param se square in se corner of returned square
 * @returns new square composed of given squares
 */
export const split =
    (nw: Square, ne: Square, sw: Square, se: Square): Square => {
  return {kind: "split", nw: nw, ne: ne, sw: sw, se: se};
};

export type Dir = "NW" | "NE" | "SE" | "SW";

/** Describes how to get to a square from the root of the tree. */
export type Path = List<Dir>;


/**
 * Returns the subtree at the given path from the root.
 * @param path from the root to the square in question
 * @param root top-most part of the square
 * @requires path must not include directions with no corresponding sub-square
 * @returns find(path, root), where
 *  find : (Path, Square) -> Square
 *    find(nil, Sq)                        := S
 *    find(x :: L, solid(c))               := undefined
 *    find(NW :: L, split(nw, ne, sw, se)) := find(L, nw)
 *    find(NE :: L, split(nw, ne, sw, se)) := find(L, ne)
 *    find(SW :: L, split(nw, ne, sw, se)) := find(L, sw)
 *    find(SE :: L, split(nw, ne, sw, se)) := find(L, se)
 */
export const findSquare = (path: Path, root: Square): Square => {
  // TODO: implement straight from the spec
  if (path.kind === "nil") {
    return root;
  } else {
    if (root.kind === "solid") {
      throw new Error("Invalid path: cannot pass in a path for a solid square");
    }

    const dir = path.hd;
    if (dir === "NW") {
      return findSquare(path.tl, root.nw);
    } else if (dir === "NE") {
      return findSquare(path.tl, root.ne);
    } else if (dir === "SW") {
      return findSquare(path.tl, root.sw);
    } else {
      return findSquare(path.tl, root.se);
    }
  }
};

/**
 * Returns the square that results from replacing the square at the given path
 * within the root square with the given new square, sq.
 * @param path from the root to the square in question
 * @param sq square to put at this path (replacing what was there)
 * @param root top-most part of the square to replace within
 * @requires path must not include directions with no corresponding sub-square
 * @returns replace(path, sq, root), where
 *   TODO: copy your mathematical definition for replace() here as you defined
 *         in HW8 written Task 1(a)
 * replace : (Path, Square, Square) → Square
 * replace(nil, S1, S2) := S1
 * replace(x :: L, S1, solid(c)) := undefined
 * replace(NW :: L, S1, split(nw, ne, sw, se)) := split(replace(L, S1, nw), ne, sw, se)
 * replace(NE :: L, S1, split(nw, ne, sw,se)) := split(nw, replace(L, S1, ne), sw, se)
 * replace(SW :: L, S1, split(nw, ne, sw, se)) := split(nw, ne, replace(L, S1, sw), se)
 * replace(SE :: L, S1, split(nw, ne, sw, se)) := split(nw, ne, sw, replace(L, S1, se))
 */
export const replaceSquare = (path: Path, sq: Square, root: Square): Square => {
  // TODO: implement straight from the spec
  if (path.kind === "nil") {
    return sq;
  } else {
    if (root.kind === "solid") {
      throw new Error("Invalid path: cannot descend into a solid square");
    }

    const dir = path.hd;
    if (dir === "NW") {
      return split(replaceSquare(path.tl, sq, root.nw), root.ne, root.sw, root.se);
    } else if (dir === "NE") {
      return split(root.nw, replaceSquare(path.tl, sq, root.ne), root.sw, root.se);
    } else if (dir === "SW") {
      return split(root.nw, root.ne, replaceSquare(path.tl, sq, root.sw), root.se);
    } else {
      return split(root.nw, root.ne, root.sw, replaceSquare(path.tl, sq, root.se));
    }
  }
};


/**
 * Creats a JSON representation of given Square.
 * @param sq to convert to JSON
 * @returns JSON describing the given square
 */
export const toJson = (sq: Square): unknown => {
  if (sq.kind === "solid") {
    return sq.color;
  } else {
    return [toJson(sq.nw), toJson(sq.ne), toJson(sq.sw), toJson(sq.se)];
  }
};

/**
 * Converts a JSON description to the Square it describes.
 * @param data in JSON form to try to parse as Square
 * @returns a Square parsed from given data
 */
export const fromJson = (data: unknown): Square => {
  if (typeof data === 'string') {
    return solid(toColor(data))
  } else if (Array.isArray(data)) {
    if (data.length === 4) {
      return split(fromJson(data[0]), fromJson(data[1]),
                   fromJson(data[2]), fromJson(data[3]));
    } else {
      throw new Error('split must have 4 parts');
    }
  } else {
    throw new Error(`type ${typeof data} is not a valid square`);
  }
}
