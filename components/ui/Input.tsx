import React from 'react';

export type InputVariant = 'default' | 'error' | 'success';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: InputVariant;
}

const variantStyles: Record<InputVariant, string> = {
  default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
  error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
  success: 'border-green-500 focus:border-green-500 focus:ring-green-500',
};

export function Input({
  label,
  error,
  helperText,
  variant = 'default',
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const effectiveVariant = error ? 'error' : variant;
  
  const baseStyles = 'block w-full rounded-md border px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors';
  const combinedClassName = `${baseStyles} ${variantStyles[effectiveVariant]} ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={combinedClassName}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
}
