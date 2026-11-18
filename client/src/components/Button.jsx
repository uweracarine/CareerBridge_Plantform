import React from 'react';
import { Loader } from 'lucide-react';

const Button = React.forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      disabled = false,
      loading = false,
      className = '',
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2';

    const variantStyles = {
      primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary disabled:bg-disabled',
      secondary: 'bg-white text-primary border border-primary hover:bg-primary hover:text-white focus:ring-primary disabled:border-disabled disabled:text-disabled',
      tertiary: 'text-primary hover:bg-primary hover:bg-opacity-10 focus:ring-primary disabled:text-disabled',
      success: 'bg-success text-white hover:bg-green-600 focus:ring-success disabled:bg-disabled',
      error: 'bg-error text-white hover:bg-red-600 focus:ring-error disabled:bg-disabled',
      warning: 'bg-warning text-white hover:bg-yellow-600 focus:ring-warning disabled:bg-disabled',
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
      xl: 'px-8 py-4 text-xl',
      full: 'w-full px-4 py-2 text-base',
    };

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${
      disabled || loading ? 'opacity-60 cursor-not-allowed' : ''
    } ${className}`;

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={combinedClassName}
        {...props}
      >
        {loading && <Loader size={18} className="animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
