import React, { useState, useRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { toast } from "react-toastify";

const FileUpload = ({ onFileSelect, accept = ".html", className }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.name.endsWith(".html") || file.type === "text/html") {
        onFileSelect(file);
      } else {
        toast.error("Please upload an HTML file");
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={cn(
        "relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center transition-all duration-300 hover:border-primary-400 hover:bg-primary-50/50 cursor-pointer group",
        isDragOver && "border-primary-500 bg-primary-50 drag-over",
        className
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={openFileDialog}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      
      <div className="space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <ApperIcon 
            name="Upload" 
            size={32} 
            className="text-primary-600 group-hover:text-primary-700" 
          />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Upload HTML Signature
          </h3>
          <p className="text-gray-600 mb-4">
            Drag and drop your HTML signature file here, or click to browse
          </p>
          <Button variant="outline" size="sm">
            <ApperIcon name="FileUp" size={16} />
            Choose File
          </Button>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        Supports: .html files
      </div>
    </div>
  );
};

export default FileUpload;