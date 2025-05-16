import React from 'react';

interface SliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  label?: string;
  showValue?: boolean;
}

export const Slider: React.FC<SliderProps> = ({
  min,
  max,
  value,
  onChange,
  step = 1,
  label,
  showValue = true,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
          {showValue && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {value}
            </span>
          )}
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
}; 