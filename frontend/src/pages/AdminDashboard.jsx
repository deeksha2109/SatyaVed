import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, TrendingUp, Activity, CheckCircle, XCircle, Eye, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user, token } = useAuth();
  const [pendingMyths, setPendingMyths] = useState([]);
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const [subsRes, usersRes, analyticsRes] = await Promise.all([
          fetch('/api/submissions', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/admin/users', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/admin/analytics', { headers: { 'Authorization': `Bearer ${token}` } }),
        ]);
        if (!subsRes.ok) throw new Error('Failed to load submissions');
        if (!usersRes.ok) throw new Error('Failed to load users');
        if (!analyticsRes.ok) throw new Error('Failed to load analytics');

        const subsData = await subsRes.json();
        const usersData = await usersRes.json();
        const analyticsData = await analyticsRes.json();

        const items = (subsData || []).map(s => ({
          id: s._id,
          title: s.title,
          author: s.submittedBy?.name || s.submittedBy?.email || 'Unknown',
          category: s.category || 'General',
          shortDescription: s.content ? String(s.content).slice(0, 140) + '…' : '',
          submittedDate: s.createdAt || new Date().toISOString(),
          status: s.status?.toLowerCase() || 'pending'
        }));
        const pending = items.filter(i => i.status === 'pending');
        setPendingMyths(pending);

        const userItems = (usersData?.data || []).map(u => ({
          id: u._id,
          name: u.name,
          email: u.email,
          status: u.status,
          mythsCount: u.mythsCount,
          joinDate: u.joinDate,
          role: u.role,
        }));
        setUsers(userItems);

        const totalUsers = userItems.length;
        const activeUsers = userItems.filter(u => u.status === 'active').length;
        setAnalytics({
          totalMyths: analyticsData.totalMyths,
          approvedMyths: analyticsData.approvedMyths,
          pendingMyths: analyticsData.pendingMyths,
          totalUsers,
          activeUsers,
          totalViews: analyticsData.totalViews,
          thisMonthMyths: 0,
          thisMonthUsers: 0
        });
      } catch (e) {
        setPendingMyths([]);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const handleApproveMyth = async (id) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/submissions/${id}/review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: 'approved' })
      });
      if (!res.ok) throw new Error('Failed to approve');
      setPendingMyths(prev => prev.filter(myth => myth.id !== id));
      toast.success('Myth approved successfully!');
    } catch (e) {
      toast.error('Approve failed');
    }
  };

  const handleRejectMuth = async (id) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/submissions/${id}/review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: 'rejected' })
      });
      if (!res.ok) throw new Error('Failed to reject');
      setPendingMyths(prev => prev.filter(myth => myth.id !== id));
      toast.success('Myth rejected');
    } catch (e) {
      toast.error('Reject failed');
    }
  };

  const toggleUserStatus = async (id) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/users/${id}/toggle`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to update status');
      const data = await res.json();
      setUsers(prev => prev.map(user => 
        user.id === id 
          ? { ...user, status: data.status }
          : user
      ));
      toast.success('User status updated');
    } catch (e) {
      toast.error('Could not update user status');
    }
  };

  const adminStats = [
    {
      label: 'Total Myths',
      value: analytics.totalMyths,
      icon: BookOpen,
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
      change: `+${analytics.thisMonthMyths} this month`
    },
    {
      label: 'Active Users',
      value: analytics.activeUsers,
      icon: Users,
      color: 'text-green-600 bg-green-100 dark:bg-green-900/30',
      change: `+${analytics.thisMonthUsers} this month`
    },
    {
      label: 'Pending Reviews',
      value: analytics.pendingMyths,
      icon: Activity,
      color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30',
      change: 'Needs attention'
    },
    {
      label: 'Total Views',
      value: analytics.totalViews?.toLocaleString() || '0',
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30',
      change: 'Across all myths'
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
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Manage myths, users, and platform analytics
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {adminStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <stat.icon size={24} />
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.change}</p>
            </motion.div>
          ))}
        </div>

        {/* Pending Myths Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Pending Myth Reviews</h2>
          
          {pendingMyths.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">All caught up!</h3>
              <p className="text-gray-600 dark:text-gray-400">No myths pending review at the moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingMyths.map((myth, index) => (
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
                        <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-medium rounded-full">
                          Pending Review
                        </span>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-3">{myth.shortDescription}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>By {myth.author}</span>
                        <span>•</span>
                        <span>{myth.category}</span>
                        <span>•</span>
                        <div className="flex items-center space-x-1">
                          <Calendar size={14} />
                          <span>Submitted {new Date(myth.submittedDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleApproveMyth(myth.id)}
                        className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
                      >
                        <CheckCircle size={16} />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleRejectMuth(myth.id)}
                        className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
                      >
                        <XCircle size={16} />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Users Management */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">User Management</h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Myths
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Join Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {users.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.status === 'active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {user.mythsCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {new Date(user.joinDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => toggleUserStatus(user.id)}
                          className={`px-3 py-1 rounded-lg transition-colors duration-300 ${
                            user.status === 'active'
                              ? 'bg-red-600 text-white hover:bg-red-700'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {user.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;