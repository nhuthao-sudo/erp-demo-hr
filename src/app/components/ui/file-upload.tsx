import * as React from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X } from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "../../components/ui/button"

interface FileUploadProps {
  onFileChange: (files: File[]) => void
  accept?: Record<string, string[]>
  maxFiles?: number
  maxSize?: number
  className?: string
}

export function FileUpload({
  onFileChange,
  accept = {
    "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    "application/pdf": [".pdf"],
    "text/plain": [".txt"]
  },
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB
  className
}: FileUploadProps) {
  const [files, setFiles] = React.useState<File[]>([])

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.slice(0, maxFiles - files.length)
      setFiles(prev => [...prev, ...newFiles])
      onFileChange([...files, ...newFiles])
    },
    [files, maxFiles, onFileChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles
  })

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    onFileChange(newFiles)
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragActive && "border-primary bg-primary/5",
          "hover:border-primary hover:bg-primary/5"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <p className="text-sm text-gray-600">
          {isDragActive ? (
            "Thả file vào đây..."
          ) : (
            <>
              Kéo thả file vào đây, hoặc <span className="text-primary">chọn file</span>
            </>
          )}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          PDF, PNG, JPG, GIF tối đa 5MB
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">File đã chọn:</h4>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium truncate max-w-xs">
                  {file.name}
                </span>
                <span className="text-xs text-gray-500">
                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}