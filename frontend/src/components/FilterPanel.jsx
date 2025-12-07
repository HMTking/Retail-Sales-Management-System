import { useState } from "react";
import { ChevronDown, X } from "lucide-react";

const FilterPanel = ({ filters, filterOptions, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleMultiSelect = (filterKey, value) => {
    const newValues = localFilters[filterKey].includes(value)
      ? localFilters[filterKey].filter((v) => v !== value)
      : [...localFilters[filterKey], value];

    const updatedFilters = { ...localFilters, [filterKey]: newValues };
    setLocalFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleInputChange = (filterKey, value) => {
    const updatedFilters = { ...localFilters, [filterKey]: value };
    setLocalFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      customerRegion: [],
      gender: [],
      minAge: "",
      maxAge: "",
      productCategory: [],
      tags: [],
      paymentMethod: [],
      startDate: "",
      endDate: "",
    };
    setLocalFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const hasActiveFilters =
    localFilters.customerRegion.length > 0 ||
    localFilters.gender.length > 0 ||
    localFilters.productCategory.length > 0 ||
    localFilters.tags.length > 0 ||
    localFilters.paymentMethod.length > 0 ||
    localFilters.minAge ||
    localFilters.maxAge ||
    localFilters.startDate ||
    localFilters.endDate;

  if (!filterOptions) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
          >
            <X size={16} />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Customer Region */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Customer Region
        </label>
        <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-hide">
          {filterOptions.customerRegions?.map((region) => (
            <label
              key={region}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={localFilters.customerRegion.includes(region)}
                onChange={() => handleMultiSelect("customerRegion", region)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {region}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Gender
        </label>
        <div className="space-y-2">
          {filterOptions.genders?.map((gender) => (
            <label
              key={gender}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={localFilters.gender.includes(gender)}
                onChange={() => handleMultiSelect("gender", gender)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {gender}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Age Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Age Range
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={localFilters.minAge}
            onChange={(e) => handleInputChange("minAge", e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
          />
          <input
            type="number"
            placeholder="Max"
            value={localFilters.maxAge}
            onChange={(e) => handleInputChange("maxAge", e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
          />
        </div>
      </div>

      {/* Product Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Product Category
        </label>
        <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-hide">
          {filterOptions.productCategories?.map((category) => (
            <label
              key={category}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={localFilters.productCategory.includes(category)}
                onChange={() => handleMultiSelect("productCategory", category)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tags
        </label>
        <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-hide">
          {filterOptions.tags?.slice(0, 10).map((tag) => (
            <label
              key={tag}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={localFilters.tags.includes(tag)}
                onChange={() => handleMultiSelect("tags", tag)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {tag}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Payment Method
        </label>
        <div className="space-y-2">
          {filterOptions.paymentMethods?.map((method) => (
            <label
              key={method}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={localFilters.paymentMethod.includes(method)}
                onChange={() => handleMultiSelect("paymentMethod", method)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {method}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Date Range
        </label>
        <div className="space-y-2">
          <input
            type="date"
            value={localFilters.startDate}
            onChange={(e) => handleInputChange("startDate", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
          />
          <input
            type="date"
            value={localFilters.endDate}
            onChange={(e) => handleInputChange("endDate", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
