import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, DollarSign, Calendar, Briefcase } from 'lucide-react';
import { Job } from '../types';

interface JobDetailsModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (job: Job) => void;
}

export function JobDetailsModal({ job, isOpen, onClose, onApply }: JobDetailsModalProps) {
  if (!job) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-white/10 shadow-2xl"
            >
              <div className="sticky top-0 bg-gradient-to-br from-slate-900 to-slate-800 border-b border-white/10 p-6 flex items-start justify-between z-10">
                <div>
                  <h2 className="text-3xl font-bold text-white">{job.title}</h2>
                  <p className="text-cyan-400 font-medium mt-1">{job.company}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-cyan-400" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-cyan-400" />
                    <span>{job.salary || 'Competitive'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Briefcase className="w-5 h-5 text-cyan-400" />
                    <span>{job.type}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-cyan-400" />
                    <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-3">Job Description</h3>
                  <p className="text-gray-300 leading-relaxed">{job.description}</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-3">Requirements</h3>
                  <ul className="space-y-2">
                    {job.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-cyan-400 mt-1">•</span>
                        <span className="text-gray-300">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onApply(job);
                    onClose();
                  }}
                  className="w-full mt-6 px-6 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all"
                >
                  Apply for this Position
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
