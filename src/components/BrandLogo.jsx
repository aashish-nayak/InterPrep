import React from 'react';

/**
 * BrandLogo - Unified brand mark component for InterPrep
 * 
 * Features:
 * - Geometric Dialogue Monogram (IP.) with 45° speech tail and pink anchor period.
 * - Supports 'symbol' (icon only) and 'lockup' (symbol + typography).
 * - Responsive, scalable, and adheres to brand color tokens.
 */
export function BrandLogo({
  variant = 'symbol',
  size = 32,
  className = '',
  symbolColor = 'currentColor',
  accentColor = '#ff477e',
  title = 'InterPrep Logo',
  ...props
}) {
  if (variant === 'lockup') {
    return (
      <div className={`flex items-center gap-2.5 ${className}`} {...props}>
        <svg
          viewBox="0 0 256 256"
          width={size}
          height={size}
          role="img"
          aria-label={title}
          className="shrink-0 transition-transform duration-200 group-hover:scale-105"
        >
          <g id="symbol">
            <path
              fillRule="evenodd"
              fill={symbolColor}
              d="M 58 48 L 154 48 A 48 48 0 0 1 202 96 A 48 48 0 0 1 176 144 L 194 162 L 154 144 L 88 144 L 88 198 A 10 10 0 0 1 78 208 L 58 208 A 10 10 0 0 1 48 198 L 48 58 A 10 10 0 0 1 58 48 Z M 88 80 L 148 80 A 16 16 0 0 1 148 112 L 88 112 Z"
            />
            <circle cx="186" cy="192" r="16" fill={accentColor} />
          </g>
        </svg>
        <span className="font-display text-lg font-semibold tracking-tight text-ink">
          Inter<span className="text-pink font-bold">Prep</span>
        </span>
      </div>
    );
  }

  // Symbol only
  return (
    <svg
      viewBox="0 0 256 256"
      width={size}
      height={size}
      role="img"
      aria-label={title}
      className={`shrink-0 ${className}`}
      {...props}
    >
      <g id="symbol">
        <path
          fillRule="evenodd"
          fill={symbolColor}
          d="M 58 48 L 154 48 A 48 48 0 0 1 202 96 A 48 48 0 0 1 176 144 L 194 162 L 154 144 L 88 144 L 88 198 A 10 10 0 0 1 78 208 L 58 208 A 10 10 0 0 1 48 198 L 48 58 A 10 10 0 0 1 58 48 Z M 88 80 L 148 80 A 16 16 0 0 1 148 112 L 88 112 Z"
        />
        <circle cx="186" cy="192" r="16" fill={accentColor} />
      </g>
    </svg>
  );
}

export default BrandLogo;
