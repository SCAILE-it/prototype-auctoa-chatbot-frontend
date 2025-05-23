
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Paperclip } from 'lucide-react';
import FileBubble from './FileBubble';

type FileUploadBarProps = {
  files: File[];
  onFilesAdded: (files: File[]) => void;
  onFileRemove: (index: number) => void;
};

const FileUploadBar = ({ files, onFilesAdded, onFileRemove }: FileUploadBarProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesAdded(acceptedFiles);
  }, [onFilesAdded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  });

  return (
    <div className="mb-4">
      <div 
        {...getRootProps()} 
        className={`border border-dashed rounded-lg p-2 cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-border'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex items-center justify-center p-2">
          <Paperclip size={18} className="mr-2" />
          <p className="text-sm text-muted-foreground">
            {isDragActive
              ? "Drop the files here"
              : "Drag & drop files, or click to select"}
          </p>
        </div>
      </div>
      
      {files.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {files.map((file, index) => (
            <FileBubble
              key={index}
              fileName={file.name}
              onRemove={() => onFileRemove(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploadBar;
