import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Eye, ThumbsUp, ThumbsDown } from 'lucide-react';

const MythCard = ({ myth, index = 0 }) => {
  const [votes, setVotes] = useState(myth.votes || 0);

  const handleVote = (type) => {
    setVotes((prev) => type === 'up' ? prev + 1 : prev > 0 ? prev - 1 : 0);
    // 🔗 Here you can later call an API to store votes in DB
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-golden-100 dark:border-gray-700"
    >
      <div className="relative">
        <img
          src={myth.image || 'https://via.placeholder.com/800x400?text=No+Image'}
          alt={myth.title}
          className="w-full h-48 object-cover"
          onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/800x400?text=No+Image'; }}
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-golden-600/90 text-white text-sm rounded-full backdrop-blur-sm">
            {myth.category}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3
          className="text-xl font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2"
          style={{ fontFamily: 'Cinzel' }}
        >
          {myth.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed">
          {myth.shortDescription}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock size={14} />
              <span>5 min read</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye size={14} />
              <span>{myth.views || Math.floor(Math.random() * 500) + 100}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {/* Read More Button */}
          <Link
            to={`/myth/${myth.id}`}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-golden-600 to-golden-700 text-white rounded-lg hover:from-golden-700 hover:to-golden-800 transition-all duration-300 transform hover:scale-105"
          >
            Read More
            <svg
              className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>

          {/* Voting Section */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleVote('up')}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 transition"
            >
              <ThumbsUp size={16} />
            </button>
            <span className="text-gray-700 dark:text-gray-200 font-medium">{votes}</span>
            <button
              onClick={() => handleVote('down')}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 transition"
            >
              <ThumbsDown size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MythCard;
