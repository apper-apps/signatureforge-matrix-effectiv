import React, { useState } from "react";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import FileUpload from "@/components/molecules/FileUpload";
import PasteArea from "@/components/molecules/PasteArea";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const UploadSection = ({ onSignatureParsed, className }) => {
  const [activeTab, setActiveTab] = useState("upload");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = async (file) => {
    if (!file) return;

    setIsProcessing(true);
    
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const htmlContent = e.target.result;
        processHtml(htmlContent);
      };
      reader.readAsText(file);
    } catch (error) {
      toast.error("Failed to read file");
      console.error("File reading error:", error);
      setIsProcessing(false);
    }
  };

  const handleHtmlPaste = (htmlContent) => {
    processHtml(htmlContent);
  };

  const processHtml = async (htmlContent) => {
    if (!htmlContent || !htmlContent.includes("<")) {
      toast.error("Invalid HTML content");
      setIsProcessing(false);
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Parse the HTML content
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, "text/html");
      
      // Extract editable elements
      const elements = [];
      let elementId = 1;

// Find text nodes and common elements
      const textNodes = [];
      
      // Check if NodeFilter is available (browser environment)
      if (typeof NodeFilter !== 'undefined' && document.createTreeWalker) {
        const walker = document.createTreeWalker(
          doc.body || doc.documentElement,
          NodeFilter.SHOW_TEXT,
          null,
          false
        );

        let node;
        while (node = walker.nextNode()) {
          const text = node.textContent?.trim();
          if (text && text.length > 2) {
            textNodes.push({
              text,
              element: node.parentElement
            });
          }
        }
      } else {
        // Fallback for environments where NodeFilter is not available
        const getAllTextNodes = (element) => {
          const nodes = [];
          if (element.nodeType === 3) { // Text node
            const text = element.textContent?.trim();
            if (text && text.length > 2) {
              nodes.push({
                text,
                element: element.parentElement
              });
            }
          } else {
            const children = element.childNodes || [];
            for (let i = 0; i < children.length; i++) {
              nodes.push(...getAllTextNodes(children[i]));
            }
          }
          return nodes;
        };
        
        textNodes.push(...getAllTextNodes(doc.body || doc.documentElement));
      }

      // Common patterns for email signature elements
      const patterns = [
        { type: "name", regex: /^[A-Za-z\s]{2,40}$/, label: "Full Name" },
        { type: "title", regex: /^[A-Za-z\s\-,&]{3,50}$/, label: "Job Title" },
        { type: "email", regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, label: "Email Address" },
        { type: "phone", regex: /^[\+]?[\d\s\-\(\)]{10,20}$/, label: "Phone Number" },
        { type: "website", regex: /^(https?:\/\/)?(www\.)?[a-zA-Z0-9\-]+\.[a-zA-Z]{2,}/, label: "Website" }
      ];

      textNodes.forEach(({ text, element }) => {
        patterns.forEach(pattern => {
          if (pattern.regex.test(text) && !elements.find(el => el.value === text)) {
            elements.push({
              Id: elementId++,
              type: pattern.type,
              label: pattern.label,
              value: text,
              xpath: getXPath(element),
              validation: pattern.type
            });
          }
        });
      });

      // Find images
      const images = [];
      const imgElements = doc.querySelectorAll("img");
      imgElements.forEach((img, index) => {
        images.push({
          Id: index + 1,
          type: img.alt?.toLowerCase().includes("logo") ? "logo" : "profile",
          src: img.src,
          base64: img.src,
          dimensions: {
            width: img.width || 100,
            height: img.height || 100
          }
        });
      });

      const parsedSignature = {
        Id: Date.now(),
        htmlContent: htmlContent,
        elements: elements,
        images: images,
        styles: extractStyles(htmlContent),
        metadata: {
          parsed: new Date().toISOString(),
          elementCount: elements.length,
          imageCount: images.length
        }
      };

      onSignatureParsed(parsedSignature);
      toast.success(`Found ${elements.length} editable elements`);
      
    } catch (error) {
      toast.error("Failed to parse HTML signature");
      console.error("HTML parsing error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getXPath = (element) => {
    const parts = [];
    while (element && element.nodeType === 1) {
      let index = 1;
      let sibling = element.previousSibling;
      while (sibling) {
        if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
          index++;
        }
        sibling = sibling.previousSibling;
      }
      parts.unshift(`${element.tagName.toLowerCase()}[${index}]`);
      element = element.parentElement;
    }
    return "/" + parts.join("/");
  };

  const extractStyles = (html) => {
    const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    return styleMatch ? styleMatch[1] : "";
  };

  return (
    <Card className={cn("p-6", className)}>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold gradient-text mb-2">
            SignatureForge
          </h1>
          <p className="text-gray-600">
            Transform your HTML email signature with intelligent editing
          </p>
        </div>

        <div className="flex bg-gray-100 rounded-lg p-1">
          <Button
            variant={activeTab === "upload" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("upload")}
            className="flex-1 rounded-md"
          >
            <ApperIcon name="Upload" size={16} />
            Upload File
          </Button>
          <Button
            variant={activeTab === "paste" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("paste")}
            className="flex-1 rounded-md"
          >
            <ApperIcon name="ClipboardPaste" size={16} />
            Paste HTML
          </Button>
        </div>

        {isProcessing ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <ApperIcon name="Zap" size={32} className="text-primary-600 animate-bounce" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Parsing Signature
            </h3>
            <p className="text-gray-600">
              Analyzing HTML structure and identifying editable elements...
            </p>
          </div>
        ) : (
          <div className="min-h-[300px]">
            {activeTab === "upload" && (
              <FileUpload onFileSelect={handleFileSelect} />
            )}
            {activeTab === "paste" && (
              <PasteArea onHtmlPaste={handleHtmlPaste} />
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default UploadSection;