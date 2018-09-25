import { Record } from "immutable";

export interface SlateKitRenderer {
  children: () => any;
  node?: JSX.Element;
}

export interface MarksRenderer {
  [key: string]: SlateKitRenderer;
}

export interface NodesRenderer {
  [key: string]: SlateKitRenderer;
}

export type PlaceholderRenderer = () => any;

export interface TypeOptions {
  marks: MarksRenderer;
  nodes: NodesRenderer;
  placeholders: PlaceholderRenderer[];
  toolbars: any[];
}

const defaultOptions = {
  marks: {},
  nodes: {},
  placeholders: [],
  toolbars: []
};

export default class Options extends Record(defaultOptions) {
  marks: MarksRenderer;
  nodes: NodesRenderer;
  placeholders: PlaceholderRenderer[];
  toolbars: any[];
}
