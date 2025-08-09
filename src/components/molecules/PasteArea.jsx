import React, { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const PasteArea = ({ onHtmlPaste, className }) => {
  const [htmlContent, setHtmlContent] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handlePaste = async (e) => {
    const pastedText = e.clipboardData.getData("text");
    if (pastedText.includes("<") && pastedText.includes(">")) {
      setHtmlContent(pastedText);
      onHtmlPaste(pastedText);
    }
  };

  const handleSubmit = () => {
    if (htmlContent.trim()) {
      onHtmlPaste(htmlContent);
    }
  };

  const handleClear = () => {
    setHtmlContent("");
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="text-center mb-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-secondary-100 to-primary-100 rounded-full flex items-center justify-center mb-3">
          <ApperIcon name="ClipboardPaste" size={32} className="text-secondary-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Paste HTML Code
        </h3>
        <p className="text-gray-600">
          Paste your HTML signature code directly into the text area below
        </p>
      </div>

      <div className="relative">
        <textarea
          value={htmlContent}
          onChange={(e) => setHtmlContent(e.target.value)}
          onPaste={handlePaste}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Paste your HTML signature code here..."
          className={cn(
            "w-full h-48 p-4 border-2 border-gray-200 rounded-lg resize-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none font-mono text-sm",
            isFocused && "border-primary-500"
          )}
        />
        
        {htmlContent && (
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-8 w-8 p-0"
            >
              <ApperIcon name="X" size={14} />
            </Button>
          </div>
        )}
      </div>

      {htmlContent && (
        <div className="flex justify-center">
          <Button onClick={handleSubmit} className="min-w-32">
            <ApperIcon name="Code" size={16} />
            Parse HTML
          </Button>
        </div>
      )}

      <div className="text-center text-xs text-gray-500">
        Tip: Use Ctrl+V to paste HTML content directly
      </div>
    </div>
  );
};

export default PasteArea;