import { type LucideProps } from 'lucide-react';

export function Rugby(props: LucideProps) {
  const { size = 24, strokeWidth = 2, ...rest } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      <ellipse cx="12" cy="12" rx="10" ry="5" transform="rotate(-45 12 12)" />
    </svg>
  );
}
