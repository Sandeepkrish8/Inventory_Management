import React from 'react';
import { Calendar } from 'lucide-react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const DateInput: React.FC<Props> = ({ label, className = '', ...props }) => {
  return (
    <div className={`relative ${className}`}>
      {label && <label className="text-xs text-slate-600 mb-1 block">{label}</label>}
      <div className="relative">
        <input
          {...props}
          type="date"
          className="w-full pr-10 pl-3 py-2 border rounded-md bg-white text-sm shadow-sm focus:outline-none"
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <Calendar className="w-4 h-4" />
        </span>
      </div>
    </div>
  );
};

export default DateInput;
