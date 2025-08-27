import React, { Component, ChangeEvent, MouseEvent } from "react";
import { Square, Path, split, solid, findSquare, Color, toColor, replaceSquare } from './square';
import { SquareElem } from "./square_draw";
import { len, prefix } from './list';
import "./FileEditor.css";


type FileEditorProps = {
  // TODO: may want to add some props
  name: string;
  onSave: (name: string, content: Square) => void;
  onBack: () => void;
  pre: Square;
};


type FileEditorState = {
  /** The root square of all squares in the design */
  root: Square;

  /** Path to the square that is currently clicked on, if any */
  selected?: Path;
};


/** UI for editing square design page. */
export class FileEditor extends Component<FileEditorProps, FileEditorState> {

  constructor(props: FileEditorProps) {
    super(props);

    this.state = { // TODO: probably want to change this
      root: this.props.pre,
      selected: undefined,
    };
  }

  componentDidUpdate = (prevProps: FileEditorProps): void => {
    if (this.props.name !== prevProps.name || this.props.pre !== prevProps.pre) {
      this.setState({root: this.props.pre, selected: undefined})
    }
  }
  render = (): JSX.Element => {
    // TODO: add some editing tools here
    const root = this.state.root;
    const selected = this.state.selected;

    const selectedSquare = (selected !== undefined) ? findSquare(selected, root) : undefined;
    const isSelected = (selectedSquare !== undefined);
    const currentColor: Color | undefined = (selectedSquare && selectedSquare.kind === "solid") ? selectedSquare.color : undefined;

    return <div className="editor-wrap">
      <div className="canvas">
        <SquareElem
          width={600n}
          height={600n}
          square={root}
          selected={selected}
          onClick={this.doSquareClick}
        />
      </div>

      <aside className="tools">
        <h1>Tools</h1>

        <div className="tool-row">
          <button className="btn btn-split" onClick={this.doSplitClick}>Split</button>
          <button className="btn btn-merge" onClick={this.doMergeClick}>Merge</button>
        </div>

        {isSelected && (
          <>
            <div className="tool-row">
              <span className="label">Color:</span>
              <select className="sel" value={currentColor} onChange={this.doColorChange}>
                <option value="white">White</option>
                <option value="pink">Pink</option>
                <option value="orange">Orange</option>
                <option value="yellow">Yellow</option>
                <option value="green">Green</option>
                <option value="blue">Blue</option>
                <option value="purple">Purple</option>
              </select>
            </div>
            <hr className="hr" />
          </>
        )}

        <div className="tool-row">
          <button className="btn btn-save" onClick={this.doSaveClick}>Save</button>
          <button className="btn btn-back" onClick={this.doBackClick}>Back</button>
        </div>
      </aside>
    </div>;
  };

  doSquareClick = (path: Path): void => {
    // TODO: remove this code, do something with the path to the selected square
    this.setState({selected: path});
  }

  doSplitClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    // TODO: implement
    const root = this.state.root;
    const selected = this.state.selected;

    if (!selected) {
      return;
    }

    const sq = findSquare(selected, root);
    if (sq.kind !== "solid") {
      return;
    }

    const fourPieces = split(solid(sq.color), solid(sq.color), solid(sq.color), solid(sq.color));
    const updatedRoot = replaceSquare(selected, fourPieces, root);
    this.setState({root: updatedRoot});
  };

  doMergeClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    // TODO: implement
    const root = this.state.root;
    const selected = this.state.selected;

    if (!selected) {
      return;
    }

    const sq = findSquare(selected, root);
    if (sq.kind !== "solid") {
      return;
    }

    if (selected.kind === "nil") {
      return;
    }

    const parents = this.doFindParentsFocus(selected);
    if (!parents) {
      return;
    }

    const updatedRoot = replaceSquare(parents, solid(sq.color), root);
    this.setState({root: updatedRoot, selected: parents});
  };

  // Calculate the all parents of the selected square as a new path used
  // in Merge function
  private doFindParentsFocus = (p: Path): Path | undefined => {
    if (p.kind === "nil") {
      return undefined;
    }

    const n = len(p);
    return prefix(n - 1n, p);
  }

  doColorChange = (evt: ChangeEvent<HTMLSelectElement>): void => {
    // TODO: remove this code, implement
    const root = this.state.root;
    const selected = this.state.selected;

    if (!selected) {
      return;
    }

    const color = toColor(evt.target.value);
    const updatedRoot = replaceSquare(selected, solid(color), root);
    this.setState({root: updatedRoot});
  };

  doSaveClick = (): void => {
    this.props.onSave(this.props.name, this.state.root);
  }
  
  doBackClick = (): void => {
    this.props.onBack();
  }
}
