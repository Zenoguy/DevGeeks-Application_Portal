import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Briefcase, FileText, CheckCircle } from 'lucide-react';
import { Job } from '../types';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface ApplyModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ApplicationData) => void;
}

export interface ApplicationData {
  fullName: string;
  email: string;
  phone: string;
  resume: string;
  coverLetter: string;
}

export function ApplyModal({ job, isOpen, onClose, onSubmit }: ApplyModalProps) {
  const [formData, setFormData] = useState<ApplicationData>({
    fullName: '',
    email: '',
    phone: '',
    resume: '',
    coverLetter: ''
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setUploadError('Please upload a PDF file');
        setResumeFile(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('File size must be less than 5MB');
        setResumeFile(null);
        return;
      }
      setUploadError(null);
      setResumeFile(file);
    }
  };

  const uploadResume = async (): Promise<string | null> => {
    if (!resumeFile) return null;

    setUploading(true);
    setUploadError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || 'anonymous';
      const fileExt = 'pdf';
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('resumes')
        .upload(fileName, resumeFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadError('Failed to upload resume. Please try again.');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resumeFile) {
      setUploadError('Please select a resume file');
      return;
    }

    const resumeUrl = await uploadResume();
    if (!resumeUrl) return;

    const applicationData = {
      ...formData,
      resume: resumeUrl
    };

    onSubmit(applicationData);

    setFormData({
      fullName: '',
      email: '',
      phone: '',
      resume: '',
      coverLetter: ''
    });
    setResumeFile(null);
    setUploadError(null);
    onClose();
  };

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
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-white/10 shadow-2xl"
            >
              <div className="sticky top-0 bg-gradient-to-br from-slate-900 to-slate-800 border-b border-white/10 p-6 flex items-start justify-between z-10">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                    <Briefcase className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Apply for Position</h2>
                    <p className="text-gray-400 text-sm mt-1">{job.title} at {job.company}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Resume/CV (PDF) *
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf"
                      required
                      onChange={handleFileChange}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label
                      htmlFor="resume-upload"
                      className="flex items-center justify-center w-full px-4 py-8 rounded-xl bg-white/5 border-2 border-dashed border-white/10 hover:border-cyan-500/50 transition-all cursor-pointer group"
                    >
                      <div className="text-center">
                        {resumeFile ? (
                          <div className="flex flex-col items-center space-y-2">
                            <CheckCircle className="w-12 h-12 text-green-400" />
                            <div className="flex items-center space-x-2">
                              <FileText className="w-5 h-5 text-cyan-400" />
                              <span className="text-white font-medium">{resumeFile.name}</span>
                            </div>
                            <span className="text-xs text-gray-400">
                              {(resumeFile.size / 1024).toFixed(2)} KB
                            </span>
                            <span className="text-xs text-cyan-400">Click to change file</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center space-y-2">
                            <Upload className="w-12 h-12 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                            <div>
                              <span className="text-white font-medium">Click to upload</span>
                              <span className="text-gray-400"> or drag and drop</span>
                            </div>
                            <span className="text-xs text-gray-500">PDF (MAX. 5MB)</span>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                  {uploadError && (
                    <p className="text-xs text-red-400 mt-2">{uploadError}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cover Letter
                  </label>
                  <textarea
                    value={formData.coverLetter}
                    onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none"
                    placeholder="Tell us why you're interested in this position..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-6 py-3 rounded-xl border border-white/10 text-gray-300 font-semibold hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    disabled={uploading}
                    whileHover={{ scale: uploading ? 1 : 1.02 }}
                    whileTap={{ scale: uploading ? 1 : 0.98 }}
                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? 'Uploading...' : 'Submit Application'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
