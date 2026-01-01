import React from 'react';
import { Button } from './button';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  actionLabel,
  className = '' 
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      {Icon && (
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon className="w-12 h-12 text-gray-400" />
        </div>
      )}
      
      {title && (
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {title}
        </h3>
      )}
      
      {description && (
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {description}
        </p>
      )}
      
      {action && actionLabel && (
        <Button onClick={action}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;