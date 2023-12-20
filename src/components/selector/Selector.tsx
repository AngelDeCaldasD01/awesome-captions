'use client';

interface SelectorProps {
  options?: any[];
  name: string;
}

export default function Selector({ options, name }: SelectorProps) {
  return (
    <div>
      <select
        className='w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md appearance-none'
        name={name}
        id={name}
      >
        <option value=''>--Please choose an option--</option>
        {options &&
          options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
      </select>
    </div>
  );
}
