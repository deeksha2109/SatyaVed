import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, Clock, CheckCircle, XCircle, Upload } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, token } = useAuth();
  const [userMyths, setUserMyths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMyth, setEditingMyth] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    shortDescription: '',
    fullStory: '',
    image: ''
  });

  const categories = ['Daily Rituals', 'Festivals', 'Superstitions'];
  const statuses = {
    pending: { label: 'Pending Review', icon: Clock, color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30' },
    approved: { label: 'Approved', icon: CheckCircle, color: 'text-green-600 bg-green-100 dark:bg-green-900/30' },
    rejected: { label: 'Rejected', icon: XCircle, color: 'text-red-600 bg-red-100 dark:bg-red-900/30' }
  };

  useEffect(() => {
    const load = async () => {
      if (!user?._id) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/myths?createdBy=${encodeURIComponent(user._id)}`);
        if (!res.ok) throw new Error('Failed to fetch your myths');
        const json = await res.json();
        const items = (json.data || []).map(m => ({
          id: m._id,
          title: m.title,
          category: m.category || 'General',
          shortDescription: m.excerpt || (m.content ? String(m.content).slice(0, 140) + '…' : ''),
          fullStory: m.content || '',
          image: m.image || '',
          status: m.status || 'pending',
          dateAdded: m.createdAt || new Date().toISOString(),
          views: m.views || 0,
        }));
        setUserMyths(items);
      } catch (e) {
        setUserMyths([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?._id]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('Please login again');
      return;
    }
    try {
      if (editingMyth) {
        toast.error('Editing is restricted');
        setEditingMyth(null);
      } else {
        const payload = {
          title: formData.title,
          category: formData.category,
          imageUrl: formData.image,
          shortDescription: formData.shortDescription,
          fullStory: formData.fullStory
        };
        const res = await fetch('/api/myths', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Failed to submit myth');
        const created = await res.json();
        const mapped = {
          id: created._id,
          title: created.title,
          category: created.category || 'General',
          shortDescription: created.excerpt || (created.content ? String(created.content).slice(0, 140) + '…' : ''),
          fullStory: created.content || '',
          image: created.image || '',
          status: created.status || 'pending',
          dateAdded: created.createdAt || new Date().toISOString(),
          views: created.views || 0,
        };
        setUserMyths(prev => [mapped, ...prev]);
        toast.success('Myth submitted successfully! It will be reviewed by our team.');
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to submit myth');
    } finally {
      setFormData({ title: '', category: '', shortDescription: '', fullStory: '', image: '' });
      setShowAddForm(false);
    }
  };

  const handleEdit = (myth) => {
    setEditingMyth(myth);
    setFormData({
      title: myth.title,
      category: myth.category,
      shortDescription: myth.shortDescription,
      fullStory: myth.fullStory || '',
      image: myth.image || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this myth?')) {
      setUserMyths(prev => prev.filter(myth => myth.id !== id));
      toast.success('Myth deleted successfully');
    }
  };

  const stats = [
    {
      label: 'Total Myths',
      value: userMyths.length,
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30'
    },
    {
      label: 'Approved',
      value: userMyths.filter(m => m.status === 'approved').length,
      color: 'text-green-600 bg-green-100 dark:bg-green-900/30'
    },
    {
      label: 'Pending',
      value: userMyths.filter(m => m.status === 'pending').length,
      color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30'
    },
    {
      label: 'Total Views',
      value: userMyths.reduce((sum, myth) => sum + myth.views, 0),
      color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30'
    }
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4" style={{ fontFamily: 'Cinzel' }}>
            Welcome back, {user?.fullName || user?.name || user?.email}!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Manage your contributed myths and share your cultural heritage
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <div className="w-6 h-6 bg-current opacity-20 rounded"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <button
            onClick={() => {
              setShowAddForm(true);
              setEditingMyth(null);
              setFormData({
                title: '',
                category: '',
                shortDescription: '',
                fullStory: '',
                image: ''
              });
            }}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-golden-600 to-golden-700 text-white font-semibold rounded-xl hover:from-golden-700 hover:to-golden-800 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <Plus className="mr-2" size={20} />
            Add New Myth
          </button>
        </motion.div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {editingMyth ? 'Edit Myth' : 'Add New Myth'}
              </h2>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingMyth(null);
                }}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-golden-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    placeholder="Enter myth title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-golden-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-golden-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Short Description *
                </label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-golden-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="A brief description of the myth (2-3 sentences)"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Full Story *
                </label>
                <textarea
                  name="fullStory"
                  value={formData.fullStory}
                  onChange={handleInputChange}
                  required
                  rows="8"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-golden-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="Tell the complete story, including its origins, cultural significance, and practical explanations..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-golden-600 to-golden-700 text-white font-semibold rounded-xl hover:from-golden-700 hover:to-golden-800 transition-all duration-300"
                >
                  {editingMyth ? 'Update Myth' : 'Submit Myth'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingMyth(null);
                  }}
                  className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-xl hover:bg-gray-700 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Myths List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Your Submitted Myths</h2>
          
          {loading ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">Loading...</div>
          ) : userMyths.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <Upload className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">No myths yet</h3>
              <p className="text-gray-600 dark:text-gray-400">Start sharing your cultural heritage by adding your first myth!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userMyths.map((myth, index) => {
                const Status = statuses[myth.status];
                return (
                  <motion.div
                    key={myth.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                            {myth.title}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${Status.color}`}>
                            <Status.icon size={12} />
                            <span>{Status.label}</span>
                          </span>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-300 mb-3">{myth.shortDescription}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <span>{myth.category}</span>
                          <span>•</span>
                          <span>Added {new Date(myth.dateAdded).toLocaleDateString()}</span>
                          <span>•</span>
                          <div className="flex items-center space-x-1">
                            <Eye size={14} />
                            <span>{myth.views} views</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleEdit(myth)}
                          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-300"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(myth.id)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-300"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;