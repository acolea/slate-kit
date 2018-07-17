import React from "react";
import { shallow } from "enzyme";

import Image, { resetForm, bytesToMb } from "../src/components/Image";

describe("translates bytes to megabytes", () => {
  it("translates 0 to string MB", () => {
    const zero = 0;
    expect(bytesToMb(zero)).toEqual("0.0 MB");
  });
  it("translates a 5 or less digit number of MB to string MB", () => {
    const fraction = 104857;
    expect(bytesToMb(fraction)).toEqual("0.1 MB");
  });
  it("translates to 6 digit number to string MB", () => {
    const oneDigit = 1048576;
    expect(bytesToMb(oneDigit)).toEqual("1.0 MB");
  });
  it("translates to 6+ digit number to string MB", () => {
    const twoDigit = 10485760;
    expect(bytesToMb(twoDigit)).toEqual("10.0 MB");
  });
});

describe("reset input form value", () => {
  let input;
  beforeEach(() => {
    input = document.createElement("input");
  });
  it("resets string", () => {
    input.value = "first";
    expect(input.value).toEqual("first");
    resetForm(input);
    expect(input.value).toEqual("");
  });
  it("resets file", () => {
    input.value = new File([""], "new-file");
    expect(input.value).toEqual("[object File]");
    resetForm(input);
    expect(input.value).toEqual("");
  });
});

// Default props for Image
const attributes = {
  "data-key": "1"
};
const editor = {
  change: () => {},
  props: { isReadOnly: false }
};
const node = {
  data: new Map(),
  key: attributes["data-key"]
};
const options = {};

describe("<Image /> component's onImgLoad method", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(
      <Image
        attributes={attributes}
        readOnly={false}
        isSelected={false}
        editor={editor}
        options={options}
        node={node}
      />
    );
  });
  it("should not change loading when src is a blob", () => {
    const initialLoadingState = true;
    wrapper.setState({
      loading: initialLoadingState,
      src: "blob:http://localhost:6006/07b3b520-7aab-4ff8-9a84-b090f3cc4351"
    });
    wrapper.instance().onImgLoad();
    expect(wrapper.state("loading")).toEqual(initialLoadingState);
  });
  it("should set loading to false when src is NOT a blob", () => {
    wrapper.setState({
      loading: true,
      src: "http://localhost:6006/07b3b520-7aab-4ff8-9a84-b090f3cc4351"
    });
    wrapper.instance().onImgLoad();
    expect(wrapper.state("loading")).toEqual(false);
  });
});

describe("attemptBlobUpload", () => {});
describe("attemptUpload", () => {});
describe("updateError", () => {});
describe("updateSrc", () => {});
describe("invalidImageFile", () => {});
describe("exceedsMaxFileSize", () => {});
describe("handleInsertImage", () => {});
describe("deleteImage", () => {});
describe("selectFile", () => {});
describe("createInput", () => {});

describe("<Image /> component", () => {
  it("should render <Image /> component correctly", () => {
    const wrapper = shallow(
      <Image
        attributes={attributes}
        readOnly={false}
        isSelected={false}
        editor={editor}
        options={options}
        node={node}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
