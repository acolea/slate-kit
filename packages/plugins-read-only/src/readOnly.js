import React from "react";
import isHotKey from "is-hotkey";
import PropTypes from "prop-types";

export default function ReadOnly(opts = { readOnlyClass: "slate-read-only" }) {
  const { readOnlyClass } = opts;
  const COPY = isHotKey("mod+c");

  function onKeyDown(e) {
    if (COPY(e)) return undefined;

    e.preventDefault();
    e.stopPropagation();
    return true;
  }

  function onBeforeInput(e) {
    e.preventDefault();
    e.stopPropagation();
    return true;
  }

  function renderEditor(props) {
    return <div className={readOnlyClass}>{props.children}</div>;
  }

  renderEditor.propTypes = {
    children: PropTypes.node.isRequired
  };

  function onDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    return true;
  }

  function onInput(e) {
    e.preventDefault();
    e.stopPropagation();
    return true;
  }

  return {
    onInput,
    onDrop,
    onKeyDown,
    onBeforeInput,
    renderEditor
  };
}