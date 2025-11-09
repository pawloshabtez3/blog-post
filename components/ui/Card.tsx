import React from 'react';

export type CardVariant = 'default' | 'bordered' | 'elevated';

interface CardProps {
  variant?: CardVariant;
  className?: string;
  children: React.ReactNode;
}

interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

interface CardContentProps {
  className?: string;
  children: React.ReactNode;
}

interface CardFooterProps {
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-white',
  bordered: 'bg-white border border-gray-200',
  elevated: 'bg-white shadow-lg',
};

export function Card({ variant = 'default', className = '', children }: CardProps) {
  const baseStyles = 'rounded-lg overflow-hidden';
  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`;

  return (
    <div className={combinedClassName}>
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children }: CardHeaderProps) {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ className = '', children }: CardContentProps) {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ className = '', children }: CardFooterProps) {
  return (
    <div className={`px-6 py-4 border-t border-gray-200 bg-gray-50 ${className}`}>
      {children}
    </div>
  );
}

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;
