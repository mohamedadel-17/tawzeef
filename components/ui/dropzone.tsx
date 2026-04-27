"use client"

import * as React from "react"
import { useDropzone, type DropzoneOptions } from "react-dropzone"
import { CloudUpload, FileIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface DropzoneProps extends DropzoneOptions {
  className?: string
  containerClassName?: string
}

export function Dropzone({ 
  className, 
  containerClassName, 
  ...props 
}: DropzoneProps) {
  const [files, setFiles] = React.useState<File[]>([])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    ...props,
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles)
      if (props.onDrop) props.onDrop(acceptedFiles, [], {} as any)
    },
  })

  const removeFile = () => setFiles([])

  return (
    <div className={cn("grid w-full gap-4", containerClassName)}>
      <div
        {...getRootProps()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/25 px-6 py-10 text-center transition hover:bg-muted/25",
          isDragActive && "border-primary bg-muted/50",
          className
        )}
      >
        <input {...getInputProps({ name: 'cv' })} />
        <div className="rounded-full border border-dashed p-3">
          <CloudUpload className="size-7 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">
            {isDragActive ? "Drop the files here" : "Click or drag files to upload"}
          </p>
          <p className="text-xs text-muted-foreground">
            Maximum file size 5MB (PDF only)
          </p>
        </div>
      </div>

      {/* File Preview Section */}
      {files.length > 0 && (
        <div className="flex items-center justify-between rounded-md border p-2 px-4">
          <div className="flex items-center gap-2">
            <FileIcon className="size-5 text-blue-500" />
            <span className="text-sm font-medium truncate max-w-[200px]">
              {files[0].name}
            </span>
            <span className="text-xs text-muted-foreground">
              ({(files[0].size / 1024 / 1024).toFixed(2)} MB)
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={removeFile}
          >
            <X className="size-4" />
          </Button>
        </div>
      )}
    </div>
  )
}