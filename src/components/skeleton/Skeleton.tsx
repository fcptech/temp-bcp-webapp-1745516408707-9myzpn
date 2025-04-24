import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  animation?: 'pulse' | 'wave';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ 
  className = '',
  variant = 'text',
  animation = 'pulse',
  width,
  height
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700';
  const animationClasses = animation === 'pulse' ? 'animate-pulse' : 'animate-shimmer';
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  }[variant];

  const style = {
    width: width,
    height: height
  };

  return (
    <div 
      className={`${baseClasses} ${animationClasses} ${variantClasses} ${className}`}
      style={style}
    />
  );
}