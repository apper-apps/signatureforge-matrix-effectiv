import React, { useState } from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const ExportToolbar = ({ html, parsedSignature, className }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadHtml = async () => {
    if (!html) {
      toast.error("No signature to download");
      return;
    }

    setIsDownloading(true);
    
    try {
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `signature-${new Date().toISOString().split("T")[0]}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Signature downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download signature");
      console.error("Download error:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!html) {
      toast.error("No signature to copy");
      return;
    }

    try {
      await navigator.clipboard.writeText(html);
      toast.success("Signature copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy signature");
      console.error("Copy error:", error);
    }
  };

  const saveTemplate = () => {
    if (!parsedSignature) {
      toast.error("No signature to save");
      return;
    }

    try {
      const savedTemplates = JSON.parse(localStorage.getItem("signatureTemplates") || "[]");
      const templateName = `Template ${savedTemplates.length + 1}`;
      
      const newTemplate = {
        Id: Date.now(),
        name: templateName,
        html: html,
        thumbnail: "",
        lastModified: new Date().toISOString()
      };

      savedTemplates.push(newTemplate);
      localStorage.setItem("signatureTemplates", JSON.stringify(savedTemplates));
      
      toast.success("Template saved successfully!");
    } catch (error) {
      toast.error("Failed to save template");
      console.error("Save error:", error);
    }
  };

  const disabled = !html;

  return (
    <div className={cn("flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg", className)}>
      <div className="flex items-center gap-2 flex-1">
        <ApperIcon name="Download" size={16} className="text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Export Options</span>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={saveTemplate}
          disabled={disabled}
          className="min-w-24"
        >
          <ApperIcon name="Save" size={14} />
          Save
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={copyToClipboard}
          disabled={disabled}
          className="min-w-24"
        >
          <ApperIcon name="Copy" size={14} />
          Copy
        </Button>
        
        <Button
          variant="primary"
          size="sm"
          onClick={downloadHtml}
          disabled={disabled || isDownloading}
          className="min-w-32"
        >
          <ApperIcon name="Download" size={14} />
          {isDownloading ? "Downloading..." : "Download HTML"}
        </Button>
      </div>
    </div>
  );
};

export default ExportToolbar;