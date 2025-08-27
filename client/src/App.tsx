import React, { Component } from "react";
import { fromJson, Square, toJson, solid, split } from './square';
import { FileEditor } from "./FileEditor";
import { FileList } from "./FileList";
import { isRecord } from "./record";


/** Describes set of possible app page views */
// TODO: Replace with a Page type that keeps track of the necessary data
type Page = { kind: "file-list"}
          | { kind: "file-editor"; name: string; pre: Square}
          | { kind: "loading-files"; name: string };

type AppState = {
  show: Page;   // Stores state for the current page of the app to show
  files: string[];
};

/**
 * Displays the square application containing either a list of files names
 * to pick from or an editor for files files
 */
export class App extends Component<{}, AppState> {

  constructor(props: {}) {
    super(props);

    // TODO: change to correct starting view once it's implemented
    this.state = {
      show: {kind: "file-list"},
      files: [],
    };
  }

  componentDidMount = (): void => {
    this.doLoadListsClick();
  }

  doLoadListsClick = (): void => {
    fetch('/api/list')
    .then(this.doListFilesResp)
    .catch((ex) => this.doListFilesError(`failed to connect ${ex}`));
  }

  doListFilesResp = (res: Response): void => {
      if (res.status === 200) {
        res.json()
        .then(this.doListFileJson)
        .catch((msg) => this.doListFilesError(`Error parsing 200 response. ${msg}`))
      } else {
        this.doListFilesError(`bad status code: ${res.status}`);
      }
    }
  
    doListFileJson = (data: unknown): void => {
      if (!isRecord(data)) {
        throw new Error(`data is not a record: ${typeof data}`);
      }
      const files: string[] = this.doParseDataFocus(data);
      this.setState({ show: {kind: "file-list"}, files: files});
    }
  
    doParseDataFocus = (d: unknown): string[] => {
      if (!isRecord(d)) {
        throw new Error(`data is not a record: ${typeof d}`);
      }
  
      if (!Array.isArray(d.files)) {
        throw new Error(`data is not an array: ${typeof d}`);
      }
  
      const files: string[] = [];
      for (const name of d.files) {
        if (typeof name === "string") {
          files.push(name);
        } else {
          throw new Error(`file name is a string: ${name}`);
        }
      }
      return files;
    }
  
    doListFilesError = (msg: string) : void => {
      console.error(`fetch of listing files failed. ${msg}`)
    }

  render = (): JSX.Element => {
    // TODO: Render a loading screen if app is accessing data from the server
    //       or display file list page or editor page appropraitely
    if (this.state.show.kind === "file-list") {
      return <FileList files={this.state.files} onCreate={this.doCreateClick}
      onFile={this.doOnFileClick}></FileList>;
    } else if (this.state.show.kind === "file-editor") {
      return <FileEditor name={this.state.show.name} onSave={this.doSaveClick}
      onBack={this.doBackClick} pre={this.state.show.pre}></FileEditor>;
    } else {
      return <div>loading...</div>
    }
  };

  // TODO: write functions here to handle switching between app pages and
  //       for accessing the server
  doCreateClick = (name: string): void => {
    this.setState({ show: {kind: "file-editor", name: name, pre: this.doDefaultRootChange()}});
  }

  doOnFileClick = (name: string): void => {
    this.setState({ show: {kind: "loading-files", name: name}});

    fetch(`/api/load?name=${name}`)
    .then(this.doLoadResp)
    .catch((ex) => this.doLoadError(`failed to connect ${ex}`))
  }

  doLoadResp = (res: Response): void => {
    if (res.status === 200) {
      res.json()
      .then(this.doLoadJson)
      .catch((msg) => this.doLoadError(`Error parsing 200 response. ${msg}`))
    } else {
      this.doLoadError(`bad status code: ${res.status}`);
    }
  }

  doLoadJson = (data: unknown): void => {
    if (!isRecord(data)) {
      throw new Error(`data is not a record: ${typeof data}`);
    }
    // if data.contents === null, need to have a default square
    // split(solid("blue"), solid("orange"), solid("purple"), solid("pink"));
    const contents = data.contents;
    const pre : Square = (contents === null || contents === undefined) ? this.doDefaultRootChange() : fromJson(contents);
    const name = this.doParseDataNameFocus(data);
    this.setState({show: {kind: "file-editor", name: name, pre: pre}});
  }

  doDefaultRootChange = (): Square => {
    return split(solid("blue"), solid("orange"), solid("purple"), solid("pink"));
  }

  doParseDataNameFocus = (d: unknown): string => {
      if (!isRecord(d)) {
        throw new Error(`data is not a record: ${typeof d}`);
      }
  
      if (typeof d.name !== 'string') {
        throw new Error(`data.name is not a string: ${typeof d.name}`);
      }
      return d.name;
    }

  doLoadError = (msg: string): void => {
    console.error(`fetch of loading given file's content failed. ${msg}`)
  }

  doSaveClick = (name: string, root: Square): void => {
    fetch("/api/save", {
      method: "POST",
      body: JSON.stringify({name: name, contents: toJson(root)}),
      headers: {"Content-Type": "application/json"},
    })
    .then(this.doSaveClickResp)
    .catch((ex) => this.doSaveClickError(`failed to connect ${ex}`))
  }

  doSaveClickResp = (res: Response): void => {
    if (res.status === 200) {
      res.json()
      .then(this.doSaveClickJson)
      .catch((msg) => this.doSaveClickError(`Error parsing 200 response. ${msg}`))
    } else {
      this.doSaveClickError(`bad status code: ${res.status}`);
    }
  }

  doSaveClickJson = (data: unknown): void => {
    if (!isRecord(data)) {
      throw new Error(`data is not a record: ${typeof data}`);
    }
  }

  doSaveClickError = (msg: string): void => {
    console.error(`fetch of saving file failed. ${msg}`)
  }

  doBackClick = (): void => {
    this.doLoadListsClick();
  }
}
