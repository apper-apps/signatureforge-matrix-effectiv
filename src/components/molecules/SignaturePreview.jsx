import React from "react";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const SignaturePreview = ({ html, className }) => {
  if (!html) {
    return (
      <Card className={cn("p-8 text-center", className)}>
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
            <ApperIcon name="Eye" size={32} className="text-gray-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Preview</h3>
            <p className="text-gray-500">
              Upload or paste an HTML signature to see the preview
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("", className)}>
      <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-xl">
        <div className="flex items-center gap-2">
          <ApperIcon name="Eye" size={16} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Live Preview</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
      </div>
      
      <div className="p-6 bg-white signature-frame rounded-b-xl">
        <div 
          className="signature-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </Card>
  );
};

export default SignaturePreview;