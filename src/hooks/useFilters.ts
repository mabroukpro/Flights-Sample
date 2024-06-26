import { useState } from "react";

interface Filters {
  page: number;
}

export function useFilters<T extends Filters>(defaultValues: T) {
  const [filters, setFilters] = useState<T>(defaultValues);

  // Function to handle changes to filters
  const handleFiltersChange = <K extends keyof T>(
    key: K,
    value: T[K],
    options: { action?: string } = {}
  ) => {
    const { action } = options;
    setFilters((prevFilters) => {
      const changes: Partial<T> = {};
      const isPageChange = key === "page";

      if (isPageChange) {
        changes.page = value as number;
      } else {
        const isClearingFilter = action === "clear";
        changes.page = isClearingFilter ? 1 : prevFilters.page;
      }
      changes[key] = value;

      return { ...prevFilters, ...changes };
    });
  };

  return [filters, handleFiltersChange] as const;
}
