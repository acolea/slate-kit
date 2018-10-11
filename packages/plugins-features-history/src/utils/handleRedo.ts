import { Value, Change } from "slate";
import hasRedo from "./hasRedo";

export default function handleRedo(
  value: Value,
  editorChange: Change | undefined,
  onRedo: (change: Change) => void
) {
  const change = editorChange || value.change();
  const newChange = editorChange || change.value.change();
  let newValue;
  if (!hasRedo(value)) return change;
  if (onRedo && typeof onRedo === "function") {
    newValue = newChange.value;
  } else {
    newValue = change.value;
  }
  newValue.history.redos.some(redo => {
    if (onRedo && typeof onRedo === "function") {
      newChange.redo();
    } else {
      change.redo();
    }
    if (redo.size === 1 && redo.get(0).type === "set_selection") {
      return false;
    }
    return true;
  });
  if (onRedo && typeof onRedo === "function") {
    onRedo(newChange);
  }
  return onRedo ? change : newChange;
}