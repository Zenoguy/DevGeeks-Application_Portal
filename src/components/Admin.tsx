import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { Job } from '../types';
import { useJobs } from '../hooks/useJobs';
import Squares from './Squares';

interface AdminProps {
  onBack: () => void;
}

export function Admin({ onBack }: AdminProps) {
  const { jobs, createJob, updateJob, deleteJob } = useJobs();
  const [isEditing, setIsEditing] = useState(false);
  const [editingJob, setEditingJob] = useState<Partial<Job> & { id?: string }>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddNew = () => {
    setEditingJob({
      title: '',
      company: '',
      location: '',
      type: 'Full-time',
      salary: '',
      description: '',
      requirements: [],
      featured: false,
    });
    setIsEditing(true);
    setError('');
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setIsEditing(true);
    setError('');
  };

  const handleSave = async () => {
    setError('');
    setLoading(true);

    try {
      if (!editingJob.title || !editingJob.company || !editingJob.location || !editingJob.description) {
        setError('Please fill in all required fields');
        return;
      }

      if (editingJob.id) {
        await updateJob(editingJob.id, editingJob);
      } else {
        await createJob(editingJob as Omit<Job, 'id' | 'postedDate'>);
      }

      setIsEditing(false);
      setEditingJob({});
    } catch (err: any) {
      setError(err.message || 'Failed to save job');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      await deleteJob(jobId);
    } catch (err: any) {
      alert('Failed to delete job: ' + err.message);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-900 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <Squares
        speed={0.2}
        squareSize={60}
        direction='right'
        borderColor='rgba(139, 92, 246, 0.08)'
        hoverFillColor='rgba(139, 92, 246, 0.05)'
        className="absolute inset-0"
      />
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-400">Manage job postings and opportunities</p>
            </div>

            {!isEditing && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddNew}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/30"
              >
                <Plus className="w-5 h-5" />
                <span>Add New Job</span>
              </motion.button>
            )}
          </div>
        </motion.div>

        {isEditing ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingJob?.id ? 'Edit Job' : 'Create New Job'}
            </h2>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center space-x-2 text-red-400"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Job Title *"
                  value={editingJob?.title || ''}
                  onChange={(e) => setEditingJob(prev => ({...prev, title: e.target.value}))}
                  required
                  disabled={loading}
                  className="px-4 py-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50"
                />
                <input
                  type="text"
                  placeholder="Company *"
                  value={editingJob?.company || ''}
                  onChange={(e) => setEditingJob(prev => ({...prev, company: e.target.value}))}
                  required
                  disabled={loading}
                  className="px-4 py-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Location *"
                  value={editingJob?.location || ''}
                  onChange={(e) => setEditingJob(prev => ({...prev, location: e.target.value}))}
                  required
                  disabled={loading}
                  className="px-4 py-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50"
                />
                <select
                  value={editingJob?.type || 'Full-time'}
                  onChange={(e) => setEditingJob(prev => ({...prev, type: e.target.value as Job['type']}))}
                  disabled={loading}
                  className="px-4 py-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                </select>
                <input
                  type="text"
                  placeholder="Salary"
                  value={editingJob?.salary || ''}
                  onChange={(e) => setEditingJob(prev => ({...prev, salary: e.target.value}))}
                  disabled={loading}
                  className="px-4 py-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50"
                />
              </div>

              <textarea
                placeholder="Job Description *"
                value={editingJob?.description || ''}
                onChange={(e) => setEditingJob(prev => ({...prev, description: e.target.value}))}
                rows={4}
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50"
              />

              <input
                type="text"
                placeholder="Requirements (comma separated)"
                value={editingJob?.requirements?.join(', ') || ''}
                onChange={(e) => setEditingJob(prev => ({...prev, requirements: e.target.value.split(',').map(r => r.trim()).filter(r => r)}))}
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50"
              />

              <div className="flex items-center gap-4 pt-4">
                <label className="flex items-center space-x-2 text-gray-300">
                  <input
                    type="checkbox"
                    checked={editingJob?.featured || false}
                    onChange={(e) => setEditingJob(prev => ({...prev, featured: e.target.checked}))}
                    disabled={loading}
                    className="w-4 h-4 rounded border-gray-300 text-cyan-500 focus:ring-cyan-500 disabled:opacity-50"
                  />
                  <span>Featured Job</span>
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <motion.button
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  <span>{loading ? 'Saving...' : 'Save Job'}</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setIsEditing(false);
                    setEditingJob({});
                    setError('');
                  }}
                  disabled={loading}
                  className="px-6 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold hover:bg-white/20 transition-all disabled:opacity-50"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl hover:shadow-2xl transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">{job.title}</h3>
                    <p className="text-cyan-400 font-medium mb-2">{job.company}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>{job.type}</span>
                      <span>•</span>
                      <span>{job.salary || 'Competitive'}</span>
                      <span>•</span>
                      <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(job)}
                      className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(job.id)}
                      className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
