import React from "react";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";

const Loading = ({ className, type = "default" }) => {
  if (type === "form") {
    return (
      <Card className={cn("p-6", className)}>
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded shimmer"></div>
          <div className="space-y-3">
            <div className="h-12 bg-gray-200 rounded-lg shimmer"></div>
            <div className="h-12 bg-gray-200 rounded-lg shimmer"></div>
            <div className="h-12 bg-gray-200 rounded-lg shimmer"></div>
            <div className="h-12 bg-gray-200 rounded-lg shimmer"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (type === "preview") {
    return (
      <Card className={cn("p-6", className)}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-6 w-24 bg-gray-200 rounded shimmer"></div>
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-gray-200 rounded-full shimmer"></div>
              <div className="w-3 h-3 bg-gray-200 rounded-full shimmer"></div>
              <div className="w-3 h-3 bg-gray-200 rounded-full shimmer"></div>
            </div>
          </div>
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg shimmer"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200 rounded shimmer"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded shimmer"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded shimmer"></div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;