import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string; // e.g., 'border-blue-500'
  className?: string; // Allow additional classes
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'medium', color = 'border-white', className = '' }) => {
  const sizeClasses = {
    small: 'w-5 h-5 border-2',
    medium: 'w-8 h-8 border-[3px]', // Use arbitrary value for non-standard border width
    large: 'w-12 h-12 sm:w-16 sm:h-16 border-4',
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`animate-spin rounded-full ${sizeClasses[size]} ${color} border-t-transparent`}
        // Tailwind's border-t-transparent should work.
      ></div>
    </div>
  );
};

export default LoadingSpinner;
