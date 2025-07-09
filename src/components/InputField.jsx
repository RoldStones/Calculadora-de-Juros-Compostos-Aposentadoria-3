import React from 'react';

const InputField = ({ label, value, onChange, type = 'number', min, max, step = 'any' }) => {
  const handleChange = (e) => {
    const inputValue = e.target.value;
    
    if (type === 'currency' || type === 'number') {
      const numValue = parseFloat(inputValue) || 0;
      onChange(numValue);
    } else if (type === 'percentage') {
      const numValue = parseFloat(inputValue) || 0;
      onChange(Math.max(0, Math.min(100, numValue)));
    } else {
      onChange(inputValue);
    }
  };

  const formatValue = () => {
    if (type === 'currency') {
      return value.toLocaleString('pt-BR');
    }
    return value;
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type="number"
        value={formatValue()}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
      />
    </div>
  );
};

export default InputField;