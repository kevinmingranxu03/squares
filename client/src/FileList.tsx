import React, { Component, ChangeEvent, MouseEvent } from "react";
import "./FileList.css";


type FileListProps = {
  // TODO: may want to add some props
  onFile: (name: string) => void; // jump to file editor
  onCreate: (name: string) => void;
  files: string[];
};


type FileListState = {
  name: string;  // text in the name text box
};


/** Displays the list of created design files. */
export class FileList extends Component<FileListProps, FileListState> {

  constructor(props: FileListProps) {
    super(props);

    this.state = {name: ''};
  }

  render = (): JSX.Element => {
    // TODO: format list of files as links
    return <div className="page-wrap">
      <div className="card">
        <div className="header">
          <h2 className="title">Files</h2>
        </div>

        {this.props.files.length === 0 ? (
          <div className="empty">No files yet. Create one below 👇</div>
        ) : (
          <ul className="file-list">
            {this.renderFiles()}
          </ul>
        )}

        <div className="create">
          <label className="label" htmlFor="newName">Name:</label>
          <input
            id="newName"
            className="input"
            value={this.state.name}
            onChange={this.doNameChange}
            placeholder="e.g. my-design"
          />
          <button className="btn" onClick={this.doCreateClick}>Create</button>
        </div>
      </div>
    </div>;
  };

  renderFiles = (): Array<JSX.Element> => {
    const elems: Array<JSX.Element> = [];
    for (const[i, e] of this.props.files.entries()) {
      elems.push(
        <li className="file-item" key={i}>
          <a href="#" onClick={(evt) => this.doFileClick(evt, e)}>{e}</a>
        </li>
      )
    }
    return elems;
  }

  doFileClick = (evt: React.MouseEvent<HTMLAnchorElement>, fname: string): void => {
    evt.preventDefault();
    this.props.onFile(fname);
  } 

  // Updates our record with the name text being typed in
  doNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    // TODO: remove this code, implement
    this.setState({name: evt.target.value});
  };

  // Updates the UI to show the file editor
  doCreateClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    // TODO: implement
    const fname = this.state.name.trim();
    if (fname.length === 0) {
      return;
    }

    this.props.onCreate(fname);
  };

}
