import React from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry, className }) => {
  return (
    <Card className={cn("p-8 text-center", className)}>
      <div className="space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertTriangle" size={32} className="text-red-600" />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600 mb-4">{message}</p>
          
          {onRetry && (
            <Button onClick={onRetry} variant="primary">
              <ApperIcon name="RefreshCw" size={16} />
              Try Again
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default Error;