import React, { forwardRef, useState } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ className, label, error, type = "text", ...props }, ref) => {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(props.value || props.defaultValue || false);

  const handleFocus = (e) => {
    setFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e) => {
    setFocused(false);
    setHasValue(e.target.value !== "");
    props.onBlur?.(e);
  };

  const handleChange = (e) => {
    setHasValue(e.target.value !== "");
    props.onChange?.(e);
  };

  return (
    <div className="relative">
      {label && (
        <label
          className={cn(
            "absolute left-3 text-gray-500 pointer-events-none transition-all duration-200 floating-label",
            (focused || hasValue) && "active"
          )}
          style={{
            top: focused || hasValue ? "4px" : "12px",
            fontSize: focused || hasValue ? "12px" : "14px"
          }}
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={cn(
          "w-full px-3 py-3 border-2 border-gray-200 rounded-lg bg-white transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none",
          label && (focused || hasValue) && "pt-6 pb-2",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
          className
        )}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;