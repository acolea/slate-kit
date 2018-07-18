import React from "react";
import propTypes from "prop-types";
import DefaultImageRenderer from "./DefaultImageRenderer";
import validImageFormats from "../static/validImageFormats";

export const bytesToMb = bytes => `${(bytes / 1048576).toFixed(1)} MB`;

/* eslint no-param-reassign: ["error", { "props": false }] */
export const resetForm = input => {
  if (input) {
    input.value = "";
  }
};

class Image extends React.Component {
  constructor(props) {
    super(props);
    const src = props.node.data.get("src") || "";
    this.state = { src, loading: true, error: "" };
    this.attemptBlobUpload();
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  onImgLoad = () => {
    // Non-blobs onLoad should finish loading
    if (!this.state.src.startsWith("blob:")) {
      this.setState({ loading: false });
    }
  };

  attemptBlobUpload() {
    const { src } = this.state;
    if (src && src.includes("blob")) {
      fetch(src)
        .then(resp => resp.blob())
        .then(blob => {
          const file = new File([blob], `clipboard.png`);
          this.attemptUpload(file);
        });
    }
  }

  attemptUpload(file) {
    this.setState({ loading: true });
    const { uploadImage } = this.props.options;
    if (uploadImage) {
      uploadImage(file)
        .then(newUrl => {
          if (!this.mounted) return;
          this.updateSrc(newUrl);
        })
        .catch(e => {
          if (!this.mounted) return;
          this.updateSrc("");
          this.updateError(`${e}. Failed to upload file to server`);
        });
    } else {
      this.setState({ loading: false });
    }
  }

  updateError = error => {
    this.setState({ error });
  };

  updateSrc = (src = "", record = false) => {
    this.setState({ src, loading: false, error: "" });
    this.props.editor.change(change => {
      if (!record) change.setOperationFlag("save", false);
      change.setNodeByKey(this.props.node.key, { data: { src } });
      if (!record) change.setOperationFlag("save", true);
    });
  };

  validFileType = type => {
    if (validImageFormats.includes(type)) {
      return true;
    }
    this.updateError("Uploaded file is not an image");
    return false;
  };

  validFileSize = size => {
    const defaultMaxFileSize = 10485760;
    const maxFileSize = this.props.options.maxFileSize || defaultMaxFileSize;
    if (size <= maxFileSize) {
      return true;
    }
    this.updateError(
      `The file exceeded the maximum size of ${bytesToMb(maxFileSize)}`
    );
    return false;
  };

  handleInsertImage = (event, input) => {
    const file = event.target.files[0];
    if (
      !file ||
      !this.validFileSize(file.size) ||
      !this.validFileType(file.type)
    ) {
      return;
    }

    const newSrc = URL.createObjectURL(file);
    this.updateSrc(newSrc);

    this.attemptUpload(file);

    resetForm(input);
  };

  deleteImage = e => {
    e.preventDefault();
    e.stopPropagation();

    const { node, readOnly, editor } = this.props;
    if (!readOnly) {
      editor.change(change => {
        change.removeNodeByKey(node.key);
      });
    }
  };

  selectFile = () => {
    this.input.click();
  };

  createInput = () => (
    <input
      type="file"
      accept=".gif, .jpeg, .jpg, .png, image/gif, image/jpeg, image/jpg, image/png"
      ref={ref => {
        this.input = ref;
      }}
      onChange={e => this.handleInsertImage(e, this.input)}
      hidden
    />
  );

  render() {
    const { selectFile, deleteImage, onImgLoad, updateError } = this;
    const { attributes, readOnly, editor, isSelected, options } = this.props;
    const { src, loading, error } = this.state;
    const isReadOnly = readOnly || editor.props.isReadOnly;
    const ImageRenderer = options.renderer || DefaultImageRenderer;
    return (
      <div {...attributes}>
        {!isReadOnly && this.createInput()}
        <ImageRenderer
          actions={{ selectFile, deleteImage }}
          isReadOnly={isReadOnly}
          isSelected={isSelected}
          src={src}
          loading={loading}
          error={error}
          onImgLoad={onImgLoad}
          updateError={updateError}
        />
      </div>
    );
  }
}

Image.propTypes = {
  node: propTypes.shape({
    data: propTypes.isRequired,
    key: propTypes.string.isRequired
  }).isRequired,
  options: propTypes.shape({
    uploadImage: propTypes.func,
    maxFileSize: propTypes.number
  }).isRequired,
  editor: propTypes.shape({
    change: propTypes.func.isRequired,
    props: propTypes.shape({
      isReadOnly: propTypes.bool.isRequired
    }).isRequired
  }).isRequired,
  attributes: propTypes.shape({
    "data-key": propTypes.string.isRequired
  }).isRequired,
  readOnly: propTypes.bool.isRequired,
  isSelected: propTypes.bool.isRequired
};

export default Image;
