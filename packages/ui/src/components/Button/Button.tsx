import { Button as MuiButton } from '@mui/material';
import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends Omit<React.ComponentProps<typeof MuiButton>, 'variant' | 'color'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'medium', className, children, ...props }, ref) => {
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
      small: 'small',
      medium: 'medium',
      large: 'large',
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
