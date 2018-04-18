import React, { Component } from "react";
import { Editor } from "slate-react";
import { storiesOf } from "@storybook/react";
import { Value } from "slate";
import Debug from "debug";
import BasicTextFormat from "@vericus/slate-kit-basic-text-formatting";
import HistoryPlugin from "@vericus/slate-kit-history";
import PluginsWrapper from "@vericus/slate-kit-plugins-wrapper";
import initialState from "../states/richText.json";
import Toolbar from "../support/components/toolbar";

const debug = Debug("slate-kit:stories:RichText");

const pluginsWrapper = new PluginsWrapper();

const pluginOpts = [
  {
    label: "history",
    createPlugin: HistoryPlugin
  },
  {
    label: "basic-text-format",
    createPlugin: BasicTextFormat
  }
];

const plugins = pluginsWrapper.makePlugins(pluginOpts);

class RichTextStory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: Value.fromJSON(initialState)
    };
  }

  onChange = ({ value }) => {
    this.setState({
      value
    });
  };

  renderToolbar = () => (
    <Toolbar
      pluginsWrapper={pluginsWrapper}
      value={this.state.value}
      onChange={this.onChange}
    />
  );

  render() {
    return (
      <div>
        {this.renderToolbar()}
        <Editor
          placeholder={"Enter some text..."}
          plugins={plugins}
          value={this.state.value}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

storiesOf("plugins/features", module).add("Rich Text", () => {
  return <RichTextStory />;
});
