import React, { Component } from "react";
import { storiesOf } from "@storybook/react";
import { Value } from "slate";
import { withKnobs, boolean } from "@storybook/addon-knobs/react";
import BasicTypography from "@vericus/slate-kit-basic-typhography";
import BasicTextFormat from "@vericus/slate-kit-basic-text-formatting";
import HistoryPlugin from "@vericus/slate-kit-history";
import initialState from "../states/richText.json";
import Editor from "../support/components/editor";

const pluginOpts = [
  {
    label: "history",
    createPlugin: HistoryPlugin
  },
  {
    label: "basic-text-format",
    createPlugin: BasicTextFormat
  },
  {
    label: "basic-typhography",
    createPlugin: BasicTypography
  }
];

storiesOf("plugins/features", module)
  .addDecorator(withKnobs)
  .add("Rich Text", () => {
    return (
      <Editor
        initialState={initialState}
        pluginOpts={pluginOpts}
        isReadOnly={boolean("ReadOnly", false)}
        spellCheck={boolean("SpellCheck", false)}
      />
    );
  });
