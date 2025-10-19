export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Internship' | 'Contract';
  salary?: string;
  description: string;
  requirements: string[];
  postedDate: string;
  featured?: boolean;
}

export interface Application {
  jobId: string;
  userId: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}
