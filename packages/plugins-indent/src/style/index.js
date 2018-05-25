// @flow
import { type typeOptions } from "../options";
import getData from "./getData";

export default function createStyle(opts: typeOptions) {
  return { getData: el => getData(el, opts) };
}