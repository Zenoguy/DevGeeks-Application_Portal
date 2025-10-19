import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Job } from '../types';

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('posted_date', { ascending: false });

      if (error) throw error;

      const mappedJobs: Job[] = (data || []).map(job => ({
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.type,
        salary: job.salary || undefined,
        description: job.description,
        requirements: job.requirements,
        postedDate: job.posted_date,
        featured: job.featured,
      }));

      setJobs(mappedJobs);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();

    const channel = supabase
      .channel('jobs_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, () => {
        loadJobs();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const createJob = async (job: Omit<Job, 'id' | 'postedDate'>) => {
    const { data, error } = await supabase
      .from('jobs')
      .insert({
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.type,
        salary: job.salary || null,
        description: job.description,
        requirements: job.requirements,
        featured: job.featured || false,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const updateJob = async (id: string, job: Partial<Job>) => {
    const { data, error } = await supabase
      .from('jobs')
      .update({
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.type,
        salary: job.salary || null,
        description: job.description,
        requirements: job.requirements,
        featured: job.featured,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const deleteJob = async (id: string) => {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);

    if (error) throw error;
  };

  return {
    jobs,
    loading,
    createJob,
    updateJob,
    deleteJob,
    refreshJobs: loadJobs,
  };
}
