
import React from 'react';

interface LoadingSpinnerProps {
  size?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 40 }) => {
  return (
    <div className="flex items-center justify-center p-4">
      <div 
        className="animate-spin rounded-full border-4 border-gray-200 border-t-primary" 
        style={{ width: size, height: size }}
      />
    </div>
  );
};

export default LoadingSpinner;
