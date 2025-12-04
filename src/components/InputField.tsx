import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  isLoading?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({ label, error, isLoading, className, ...props }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label htmlFor={`input-${label}`}>{label}</label>
      <div className="relative">
        <input
          id={`input-${label}`}
          className={`w-full transition-all
            ${error
              ? 'text-pink-600'
              : ''}
            ${className}
          `}
          {...props}
        />
        {isLoading && (
          <div className="absolute right-3 top-6">
            <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      {error && <span className="text-xs text-pink-600">{error}</span>}
    </div>
  );
};
