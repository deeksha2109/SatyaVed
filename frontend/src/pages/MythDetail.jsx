import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Eye, User, Calendar, Share2, BookOpen, Heart } from 'lucide-react';
import MythCard from '../components/MythCard';
import toast from 'react-hot-toast';

const MythDetail = () => {
  const { id } = useParams();
  const [myth, setMyth] = useState(null);
  const [relatedMyths, setRelatedMyths] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/myths/${id}`);
      if (!res.ok) return;
      const m = await res.json();
      const mapped = {
        id: m._id,
        title: m.title,
        category: m.category || 'General',
        image: m.image || '',
        shortDescription: m.excerpt || (m.content ? String(m.content).slice(0, 140) + '…' : ''),
        fullStory: m.content || '',
        author: m.createdBy?.fullName || m.createdBy?.email || 'Unknown',
        dateAdded: m.createdAt || new Date().toISOString(),
        views: m.views || 0,
      };
      setMyth(mapped);
      setRelatedMyths([]);
    };
    load();
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: myth.title,
        text: myth.shortDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (!myth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-golden-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading myth...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      {/* Header */}
      <div className="container mx-auto px-4 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            to="/myths"
            className="inline-flex items-center text-golden-600 dark:text-golden-400 hover:text-golden-700 dark:hover:text-golden-300 mb-6 transition-colors duration-300"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Myths
          </Link>
        </motion.div>
      </div>

      {/* Hero Image and Title */}
      <section className="container mx-auto px-4 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-xl">
            <img
              src={myth.image || 'https://via.placeholder.com/1200x600?text=No+Image'}
              alt={myth.title}
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/1200x600?text=No+Image'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            
            {/* Category Badge */}
            <div className="absolute top-6 left-6">
              <span className="px-4 py-2 bg-golden-600/90 text-white rounded-full backdrop-blur-sm font-semibold">
                {myth.category}
              </span>
            </div>

            {/* Share Button */}
            <div className="absolute top-6 right-6">
              <button
                onClick={handleShare}
                className="p-3 bg-white/10 backdrop-blur-sm text-white rounded-full hover:bg-white/20 transition-colors duration-300"
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Title and Meta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6" style={{ fontFamily: 'Cinzel' }}>
              {myth.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400 mb-6">
              <div className="flex items-center space-x-2">
                <User size={16} />
                <span>{myth.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={16} />
                <span>{new Date(myth.dateAdded).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye size={16} />
                <span>{myth.views} views</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock size={16} />
                <span>8 min read</span>
              </div>
            </div>

            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
              {myth.shortDescription}
            </p>
          </motion.div>

          {/* Full Story */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-lg border border-golden-100 dark:border-gray-700 mb-12"
          >
            <div className="flex items-center space-x-2 mb-6">
              <BookOpen className="text-golden-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white" style={{ fontFamily: 'Cinzel' }}>
                The Full Story
              </h2>
            </div>
            
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {String(myth.fullStory || '').split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Engagement Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700 mt-8">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors duration-300">
                  <Heart size={20} />
                  <span>Like this story</span>
                </button>
              </div>
              
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-4 py-2 bg-golden-600 text-white rounded-lg hover:bg-golden-700 transition-colors duration-300"
              >
                <Share2 size={16} />
                <span>Share</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Myths */}
      {relatedMyths.length > 0 && (
        <section className="bg-gradient-to-br from-cream-50 to-golden-50 dark:from-gray-800 dark:to-gray-700 py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4" style={{ fontFamily: 'Cinzel' }}>
                Related Stories
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Explore more fascinating myths and cultural traditions
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedMyths.map((relatedMyth, index) => (
                <MythCard key={relatedMyth.id} myth={relatedMyth} index={index} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                to="/myths"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-maroon-600 to-maroon-700 text-white font-semibold rounded-xl hover:from-maroon-700 hover:to-maroon-800 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Explore All Myths
                <ArrowLeft size={20} className="ml-2 rotate-180" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default MythDetail;