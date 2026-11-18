import React from 'react';

const Input = React.forwardRef(
  (
    {
      label,
      error,
      helperText,
      type = 'text',
      placeholder,
      className = '',
      disabled = false,
      required = false,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary focus:ring-opacity-20 transition-all';

    const errorStyles = error ? 'border-error focus:border-error focus:ring-error' : '';

    const disabledStyles = disabled ? 'bg-disabled bg-opacity-20 cursor-not-allowed' : '';

    const combinedClassName = `${baseStyles} ${errorStyles} ${disabledStyles} ${className}`;

    return (
      <div className="w-full">
        {label && (
          <label className="form-label">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={combinedClassName}
          {...props}
        />
        {error && <p className="error-message">{error}</p>}
        {helperText && !error && <p className="text-sm text-text-light mt-1">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
