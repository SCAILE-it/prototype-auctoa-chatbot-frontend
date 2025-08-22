import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, X, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
}

interface DocumentUploadProps {
  onFilesChange?: (files: UploadedFile[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onFilesChange,
  maxFiles = 5,
  acceptedTypes = [".pdf", ".png", ".jpg", ".jpeg", ".doc", ".docx"]
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') return '📄';
    if (['jpg', 'jpeg', 'png'].includes(extension || '')) return '🖼️';
    if (['doc', 'docx'].includes(extension || '')) return '📝';
    return '📎';
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const newFiles: UploadedFile[] = [];
    const currentFilesCount = uploadedFiles.length;

    for (let i = 0; i < files.length && currentFilesCount + newFiles.length < maxFiles; i++) {
      const file = files[i];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (acceptedTypes.includes(fileExtension)) {
        newFiles.push({
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          file: file
        });
      }
    }

    const updatedFiles = [...uploadedFiles, ...newFiles];
    setUploadedFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  const removeFile = (fileId: string) => {
    const updatedFiles = uploadedFiles.filter(f => f.id !== fileId);
    setUploadedFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          <Upload className="w-5 h-5 text-amber-500" />
          Dokumente hochladen (Optional)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            isDragOver
              ? "border-amber-500 bg-amber-50"
              : "border-gray-300 hover:border-amber-400 hover:bg-gray-50"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium text-amber-600">Klicken Sie hier</span> oder ziehen Sie Dateien hierher
          </p>
          <p className="text-xs text-gray-500">
            PDF, JPG, PNG, DOC, DOCX (max. {maxFiles} Dateien)
          </p>
        </div>

        {/* File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        {/* Upload Button */}
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-amber-500 text-amber-600 hover:bg-amber-50"
        >
          <Upload className="w-4 h-4 mr-2" />
          Dokumente auswählen
        </Button>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700">
                Hochgeladene Dateien ({uploadedFiles.length}/{maxFiles})
              </h4>
              {uploadedFiles.length > 0 && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {uploadedFiles.length} Datei{uploadedFiles.length !== 1 ? 'en' : ''}
                </Badge>
              )}
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-lg">{getFileIcon(file.name)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <h4 className="text-sm font-medium text-blue-900 mb-1">💡 Hilfreiche Dokumente</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Grundrisse und Exposés</li>
            <li>• Energieausweis</li>
            <li>• Mietverträge oder Nebenkostenabrechnungen</li>
            <li>• Rechnungen für Modernisierungen</li>
            <li>• Fotos der Immobilie</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentUpload;
