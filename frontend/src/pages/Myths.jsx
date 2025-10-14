import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MythCard from '../components/MythCard';
import SearchBar from '../components/SearchBar';

const Myths = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [allMyths, setAllMyths] = useState([]);
  const [filteredMyths, setFilteredMyths] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchMyths = async () => {
      try {
        const limit = 50;
        const firstRes = await fetch(`/api/myths?limit=${limit}&page=1`);
        if (!firstRes.ok) throw new Error('Failed to load myths');
        const first = await firstRes.json();
        const pages = first.pages || 1;
        let all = first.data || [];
        if (pages > 1) {
          const pagePromises = [];
          for (let p = 2; p <= pages; p++) {
            pagePromises.push(fetch(`/api/myths?limit=${limit}&page=${p}`).then(r => r.ok ? r.json() : { data: [] }));
          }
          const rest = await Promise.all(pagePromises);
          rest.forEach(chunk => { if (chunk?.data) all = all.concat(chunk.data); });
        }
        const items = all.map(m => ({
          id: m._id,
          title: m.title,
          category: m.category || 'General',
          image: m.image || m.imageUrl || '',
          shortDescription: m.excerpt || (m.content ? String(m.content).slice(0, 140) + '…' : '')
        }));
        setAllMyths(items);
        const uniq = Array.from(new Set(items.map(i => i.category))).filter(Boolean);
        setCategories(uniq);
        setFilteredMyths(items);
      } catch (_) {
        setAllMyths([]);
        setCategories([]);
        setFilteredMyths([]);
      }
    };
    fetchMyths();
  }, []);

  useEffect(() => {
    const q = searchTerm.trim().toLowerCase();
    const results = allMyths.filter(m => {
      const okCat = selectedCategory ? m.category === selectedCategory : true;
      const okQ = q ? (m.title?.toLowerCase().includes(q) || m.shortDescription?.toLowerCase().includes(q)) : true;
      return okCat && okQ;
    });
    setFilteredMyths(results);
  }, [searchTerm, selectedCategory, allMyths]);

  return (
    <div className="min-h-screen py-20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-6" style={{ fontFamily: 'Cinzel' }}>
            Explore Myths
          </h1>
          <div className="w-24 h-1 bg-golden-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            Dive deep into the fascinating world of cultural myths and discover the wisdom 
            hidden within ancient stories and traditions.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
        />
      </section>

      {/* Results Section */}
      <section className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                {searchTerm || selectedCategory ? 'Search Results' : 'All Myths'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {filteredMyths.length} {filteredMyths.length === 1 ? 'myth' : 'myths'} found
                {selectedCategory && ` in ${selectedCategory}`}
                {searchTerm && ` for "${searchTerm}"`}
              </p>
            </div>
            
            {(searchTerm || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                }}
                className="px-4 py-2 text-maroon-600 dark:text-maroon-400 hover:text-maroon-700 dark:hover:text-maroon-300 transition-colors duration-300"
              >
                Clear all filters
              </button>
            )}
          </div>
        </motion.div>

        {/* Myths Grid */}
        {filteredMyths.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredMyths.map((myth, index) => (
              <MythCard key={myth.id} myth={myth} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
          >
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-golden-100 dark:bg-golden-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-golden-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                No myths found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Try adjusting your search terms or browse all categories
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                }}
                className="px-6 py-3 bg-golden-600 text-white rounded-lg hover:bg-golden-700 transition-colors duration-300"
              >
                Show All Myths
              </button>
            </div>
          </motion.div>
        )}
      </section>

      {/* Categories Preview */}
      {!searchTerm && !selectedCategory && (
        <section className="bg-gradient-to-br from-cream-50 to-golden-50 dark:from-gray-800 dark:to-gray-700 py-20 mt-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4" style={{ fontFamily: 'Cinzel' }}>
                Browse by Category
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Explore myths organized by different aspects of cultural life
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <motion.button
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  onClick={() => setSelectedCategory(category)}
                  className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-golden-100 dark:border-gray-700 hover:shadow-xl hover:scale-105 transition-all duration-300 text-left"
                >
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    {category}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Click to explore myths in this category
                  </p>
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Myths;