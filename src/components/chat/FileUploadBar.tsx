import React, { useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import FileBubble from "./FileBubble";

type FileUploadBarProps = {
  files: File[];
  onFilesAdded: (files: File[]) => void;
  onFileRemove: (index: number) => void;
  uploadInputRef?: React.RefObject<HTMLInputElement>;
};

const FileUploadBar = ({
  files,
  onFilesAdded,
  onFileRemove,
  uploadInputRef,
}: FileUploadBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const actualRef = uploadInputRef || inputRef;

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesAdded(acceptedFiles);
    },
    [onFilesAdded]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    accept: {
      "application/pdf": [".pdf"],
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
  });

  // Only render if there are files to show
  return files.length > 0 ? (
    <div className="mb-2">
      <div {...getRootProps()}>
        <input {...getInputProps()} ref={actualRef} />
        <div className="flex flex-wrap gap-2">
          {files.map((file, index) => (
            <FileBubble
              key={index}
              fileName={file.name}
              onRemove={() => onFileRemove(index)}
            />
          ))}
        </div>
      </div>

      {/* Hidden input for file selection */}
      <input
        type="file"
        className="hidden"
        ref={actualRef}
        onChange={(e) => {
          if (e.target.files?.length) {
            const filesArray = Array.from(e.target.files);
            onFilesAdded(filesArray);
            // Reset the input value to allow selecting the same file again
            e.target.value = "";
          }
        }}
        multiple
        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
      />
    </div>
  ) : (
    <input
      type="file"
      className="hidden"
      ref={actualRef}
      onChange={(e) => {
        if (e.target.files?.length) {
          const filesArray = Array.from(e.target.files);
          onFilesAdded(filesArray);
          e.target.value = "";
        }
      }}
      multiple
      accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
    />
  );
};

export default FileUploadBar;
