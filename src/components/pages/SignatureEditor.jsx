import React, { useState } from "react";
import { motion } from "framer-motion";
import UploadSection from "@/components/organisms/UploadSection";
import EditingForm from "@/components/organisms/EditingForm";
import SignaturePreview from "@/components/molecules/SignaturePreview";
import ExportToolbar from "@/components/molecules/ExportToolbar";
import ApperIcon from "@/components/ApperIcon";

const SignatureEditor = () => {
  const [parsedSignature, setParsedSignature] = useState(null);
  const [currentHtml, setCurrentHtml] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleSignatureParsed = (signature) => {
    setParsedSignature(signature);
    setCurrentHtml(signature.htmlContent);
    setIsEditing(true);
  };

  const handleSignatureUpdate = (updatedSignature, updatedHtml) => {
    setParsedSignature(updatedSignature);
    setCurrentHtml(updatedHtml);
  };

  const handleReset = () => {
    setParsedSignature(null);
    setCurrentHtml("");
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {!isEditing ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <UploadSection onSignatureParsed={handleSignatureParsed} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <ApperIcon name="Edit3" size={28} className="text-primary-600" />
                  Signature Editor
                </h1>
                <p className="text-gray-600 mt-1">
                  Customize your email signature elements and preview changes in real-time
                </p>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
              >
                <ApperIcon name="ArrowLeft" size={16} />
                <span className="hidden sm:inline">Start Over</span>
              </button>
            </div>

            {/* Main Editor Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Editor */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-4"
              >
                <EditingForm
                  parsedSignature={parsedSignature}
                  onSignatureUpdate={handleSignatureUpdate}
                />
              </motion.div>

              {/* Right Column - Preview */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-4"
              >
                <SignaturePreview html={currentHtml} />
              </motion.div>
            </div>

            {/* Export Toolbar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <ExportToolbar
                html={currentHtml}
                parsedSignature={parsedSignature}
              />
            </motion.div>

            {/* Stats Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {parsedSignature?.elements?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Text Elements</div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-secondary-600">
                  {parsedSignature?.images?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Images</div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-accent-600">
                  {currentHtml ? Math.round(currentHtml.length / 1024) : 0}kb
                </div>
                <div className="text-sm text-gray-600">File Size</div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  <ApperIcon name="CheckCircle" size={20} className="inline" />
                </div>
                <div className="text-sm text-gray-600">Compatible</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SignatureEditor;