import { Button as MuiButton } from '@mui/material';
import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ComponentProps<typeof MuiButton> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    const variantMap = {
      primary: 'contained',
      secondary: 'outlined',
      danger: 'contained',
      ghost: 'text',
    } as const;

    const colorMap = {
      primary: 'primary',
      secondary: 'primary',
      danger: 'error',
      ghost: 'primary',
    } as const;

    const sizeMap = {
      sm: 'small',
      md: 'medium',
      lg: 'large',
    } as const;

    return (
      <MuiButton
        ref={ref}
        variant={variantMap[variant]}
        color={colorMap[variant]}
        size={sizeMap[size]}
        className={cn(className)}
        {...props}
      >
        {children}
      </MuiButton>
    );
  },
);

Button.displayName = 'Button';
