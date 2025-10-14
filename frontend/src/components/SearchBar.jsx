import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBar = ({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, categories }) => {
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search myths by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-golden-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-golden-500 focus:border-transparent transition-colors duration-300"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Filter Button */}
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center space-x-2 px-4 py-3 bg-maroon-600 dark:bg-maroon-700 text-white rounded-xl hover:bg-maroon-700 dark:hover:bg-maroon-600 transition-colors duration-300"
          >
            <Filter size={20} />
            <span>Filter</span>
            {selectedCategory && (
              <span className="bg-maroon-800 dark:bg-maroon-500 px-2 py-1 rounded-full text-xs">
                1
              </span>
            )}
          </button>

          {/* Filter Dropdown */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-10"
              >
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Filter by Category</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setSelectedCategory('');
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-300 ${
                        selectedCategory === ''
                          ? 'bg-golden-100 dark:bg-golden-900/30 text-golden-700 dark:text-golden-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-300 ${
                          selectedCategory === category
                            ? 'bg-golden-100 dark:bg-golden-900/30 text-golden-700 dark:text-golden-400'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                  {selectedCategory && (
                    <button
                      onClick={() => {
                        setSelectedCategory('');
                        setIsFilterOpen(false);
                      }}
                      className="mt-3 w-full px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-300"
                    >
                      Clear Filter
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;