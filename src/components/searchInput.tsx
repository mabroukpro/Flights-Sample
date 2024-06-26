import React, { useState, useCallback } from "react";
import { Input } from "antd";

interface SearchInputProps {
  placeholder?: string;
  onChange: (value: string) => void;
  initialValue?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = "Search",
  initialValue = "",
  onChange,
}) => {
  const [searchValue, setSearchValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  // Define debounce function
  const debounce = (func: Function, delay: number) => {
    let timer: ReturnType<typeof setTimeout>;
    return function (...args: any[]) {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  // Debounced version of onChange
  const debouncedOnChange = useCallback(
    debounce((value: string) => {
      onChange(value);
    }, 500),
    [onChange]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchValue(value);
    // accept only letters lowercase and uppercase
    const regex = /^[a-zA-Z]*$/;
    if (!regex.test(value)) {
      setError("Only letters allowed");
      return;
    }
    setError(null);
    debouncedOnChange(value);
  };

  return (
    <div className="tw-w-full">
      <Input
        placeholder={placeholder}
        value={searchValue}
        status={error ? "error" : undefined}
        onChange={handleSearchChange}
      />
      {error && <div className="tw-text-red-500">{error}</div>}
    </div>
  );
};

export default SearchInput;
