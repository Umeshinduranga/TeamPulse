import { InputHTMLAttributes } from 'react';

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full border rounded-md px-3 py-2 text-sm text-[#0F1115] bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F1115]/10 focus:border-[#0F1115]/30 transition-colors ${className}`}
      {...props}
    />
  );
}
