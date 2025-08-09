import React from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data available", 
  message = "Get started by adding some content", 
  actionLabel = "Get Started",
  onAction,
  icon = "FileX",
  className 
}) => {
  return (
    <Card className={cn("p-8 text-center", className)}>
      <div className="space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} size={32} className="text-gray-500" />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {title}
          </h3>
          <p className="text-gray-600 mb-4">
            {message}
          </p>
          
          {onAction && (
            <Button onClick={onAction} variant="primary">
              <ApperIcon name="Plus" size={16} />
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default Empty;