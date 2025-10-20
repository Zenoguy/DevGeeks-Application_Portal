import { motion } from 'framer-motion';
import { MapPin, DollarSign, Calendar, Star, ArrowRight, Eye } from 'lucide-react';
import { Job } from '../types';

interface JobCardProps {
  job: Job;
  onApply: (job: Job) => void;
  onViewDetails: (job: Job) => void;
  index: number;
}

export function JobCard({ job, onApply, onViewDetails, index }: JobCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />

      <div className="relative p-6 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl hover:shadow-2xl transition-all">
        {job.featured && (
          <div className="absolute -top-3 -right-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="p-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/50"
            >
              <Star className="w-4 h-4 text-white fill-white" />
            </motion.div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
              {job.title}
            </h3>
            <p className="text-cyan-400 font-medium mt-1">{job.company}</p>
          </div>

          <p className="text-gray-400 line-clamp-2">{job.description}</p>

          <div className="flex flex-wrap gap-3 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign className="w-4 h-4" />
              <span>{job.salary || 'Competitive'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(job.postedDate).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="pt-2">
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-medium">
              {job.type}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {job.requirements.slice(0, 3).map((req, idx) => (
              <span
                key={idx}
                className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-xs"
              >
                {req}
              </span>
            ))}
            {job.requirements.length > 3 && (
              <span className="px-2 py-1 rounded-lg text-gray-500 text-xs">
                +{job.requirements.length - 3} more
              </span>
            )}
          </div>

          <div className="flex gap-3 mt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onViewDetails(job)}
              className="flex-1 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all flex items-center justify-center space-x-2 group"
            >
              <Eye className="w-4 h-4" />
              <span>View Details</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onApply(job)}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all flex items-center justify-center space-x-2 group"
            >
              <span>Apply Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
