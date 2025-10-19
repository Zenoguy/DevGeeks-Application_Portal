import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ScrollProgress } from './components/ScrollProgress';
import { Hero } from './components/Hero';
import { Explore } from './components/Explore';
import { AuthModal } from './components/AuthModal';
import { Admin } from './components/Admin';
import { useAuth } from './hooks/useAuth';
import { useJobs } from './hooks/useJobs';
import { supabase } from './lib/supabase';
import { Job } from './types';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const { user, profile, loading: authLoading, isAdmin, signOut } = useAuth();
  const { jobs, loading: jobsLoading } = useJobs();

  const handleApply = async (job: Job) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      const { error } = await supabase
        .from('applications')
        .insert({
          job_id: job.id,
          user_id: user.id,
        });

      if (error) {
        if (error.code === '23505') {
          alert('You have already applied to this job!');
        } else {
          throw error;
        }
      } else {
        alert('Application submitted successfully!');
      }
    } catch (err: any) {
      alert('Failed to submit application: ' + err.message);
    }
  };

  const handleAdminClick = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!isAdmin) {
      alert('You need admin privileges to access this area.');
      return;
    }

    setIsAdminView(true);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAdminView) {
    return <Admin onBack={() => setIsAdminView(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <ScrollProgress />
      <Navbar
        onAuthClick={() => {
          if (user) {
            if (confirm('Are you sure you want to sign out?')) {
              signOut();
            }
          } else {
            setIsAuthModalOpen(true);
          }
        }}
        onAdminClick={handleAdminClick}
        user={user}
        profile={profile}
      />
      <Hero />
      <Explore jobs={jobs} onApply={handleApply} />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          alert('Welcome to DevGeeks!');
        }}
      />

      {jobsLoading && jobs.length === 0 && (
        <div className="fixed bottom-4 right-4 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-300">Loading jobs...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
