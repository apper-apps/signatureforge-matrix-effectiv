import React, { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const EditingForm = ({ parsedSignature, onSignatureUpdate, className }) => {
  const [formData, setFormData] = useState({});
  const [imageFiles, setImageFiles] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (parsedSignature?.elements) {
      const initialData = {};
      parsedSignature.elements.forEach(element => {
        initialData[element.Id] = element.value;
      });
      setFormData(initialData);
    }
  }, [parsedSignature]);

  const handleInputChange = (elementId, value) => {
    const updatedData = { ...formData, [elementId]: value };
    setFormData(updatedData);
    
    // Update signature in real-time
    updateSignature(updatedData);
  };

const handleImageUpload = (elementId, file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      setImageFiles(prev => ({
        ...prev,
        [elementId]: {
          file,
          base64,
          dimensions: { width: 100, height: 100 }
        }
      }));
    };
    reader.readAsDataURL(file);
  };

  // Trigger signature update when imageFiles changes
  useEffect(() => {
    if (Object.keys(imageFiles).length > 0) {
      updateSignature(formData, imageFiles);
    }
  }, [imageFiles]);

const updateSignature = (data, images = imageFiles) => {
    if (!parsedSignature) return;

    setIsProcessing(true);
    
    setTimeout(() => {
      try {
        let updatedHtml = parsedSignature.htmlContent;

        // Replace text elements
        parsedSignature.elements.forEach(element => {
          if (data[element.Id] !== undefined) {
            const regex = new RegExp(escapeRegExp(element.value), "g");
            updatedHtml = updatedHtml.replace(regex, data[element.Id]);
          }
        });

        // Replace images with improved logic
        parsedSignature.images.forEach(image => {
          if (images[image.Id]?.base64) {
            // Create more robust regex patterns to handle different src formats
            const patterns = [
              new RegExp(`src="${escapeRegExp(image.src)}"`, "g"),
              new RegExp(`src='${escapeRegExp(image.src)}'`, "g"),
              new RegExp(`src="${escapeRegExp(image.base64 || image.src)}"`, "g"),
              new RegExp(`src='${escapeRegExp(image.base64 || image.src)}'`, "g")
            ];
            
            patterns.forEach(regex => {
              updatedHtml = updatedHtml.replace(regex, `src="${images[image.Id].base64}"`);
            });
          }
        });

        const updatedSignature = {
          ...parsedSignature,
          htmlContent: updatedHtml,
          elements: parsedSignature.elements.map(element => ({
            ...element,
            value: data[element.Id] !== undefined ? data[element.Id] : element.value
          })),
          images: parsedSignature.images.map(image => ({
            ...image,
            base64: images[image.Id]?.base64 || image.base64,
            src: images[image.Id]?.base64 || image.src
          }))
        };

        onSignatureUpdate(updatedSignature, updatedHtml);
      } catch (error) {
        console.error("Error updating signature:", error);
        toast.error("Failed to update signature");
      } finally {
        setIsProcessing(false);
      }
    }, 100);
  };

  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

const validateField = (type, value) => {
    const validations = {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      phone: /^[+]?[\d\s\-()]{10,20}$/,
      website: /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/
    };

    if (validations[type]) {
      return validations[type].test(value);
    }
    return true;
  };

  const getFieldError = (element) => {
    const value = formData[element.Id];
    if (value && !validateField(element.type, value)) {
      return `Please enter a valid ${element.label.toLowerCase()}`;
    }
    return null;
  };

  if (!parsedSignature) {
    return (
      <Card className={cn("p-8 text-center", className)}>
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
            <ApperIcon name="Edit3" size={32} className="text-gray-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Smart Editor
            </h3>
            <p className="text-gray-500">
              Upload your signature to start editing
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("", className)}>
      <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ApperIcon name="Edit3" size={20} className="text-gray-700" />
            <h3 className="text-lg font-semibold text-gray-800">
              Smart Editor
            </h3>
          </div>
          <Badge variant="primary">
            {parsedSignature.elements.length} elements found
          </Badge>
        </div>
      </div>

      <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
        {parsedSignature.elements.length === 0 ? (
          <div className="text-center py-8">
            <ApperIcon name="AlertCircle" size={48} className="text-yellow-500 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-700 mb-2">
              No Editable Elements Found
            </h4>
            <p className="text-gray-600">
              The signature format may not be supported. Try a different HTML structure.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              <ApperIcon name="Type" size={16} />
              Text Elements
            </h4>
            
            {parsedSignature.elements.map((element) => (
              <div key={element.Id}>
                <Input
                  label={element.label}
                  value={formData[element.Id] || ""}
                  onChange={(e) => handleInputChange(element.Id, e.target.value)}
                  error={getFieldError(element)}
                  className="transition-all duration-200"
                />
              </div>
            ))}
          </div>
        )}

        {parsedSignature.images.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              <ApperIcon name="Image" size={16} />
              Images
            </h4>
            
            {parsedSignature.images.map((image) => (
              <div key={image.Id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <img
                      src={imageFiles[image.Id]?.base64 || image.src}
                      alt={image.type}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-800 capitalize mb-2">
                      {image.type === "logo" ? "Company Logo" : "Profile Picture"}
                    </h5>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(image.Id, e.target.files[0])}
                      className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isProcessing && (
          <div className="text-center py-4">
            <div className="inline-flex items-center gap-2 text-sm text-primary-600">
              <ApperIcon name="RefreshCw" size={16} className="animate-spin" />
              Updating signature...
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default EditingForm;