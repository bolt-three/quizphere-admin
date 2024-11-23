import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import _ from 'lodash';

interface Quiz {
  quiz_id: string;
  user_id: string;
  title: string;
  language: string;
  type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
  isLoading?: boolean;
}

interface QuizTypeDistributionProps {
  quizzes: Quiz[];
  isLoading: boolean;
}

interface ChartDataItem {
  type: string;
  count: number;
}

function StatCard({ icon: Icon, label, value, color, isLoading = false }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color} bg-opacity-10 mr-4`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          {isLoading ? (
            <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <p className="text-2xl font-semibold">{value}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function QuizTypeDistribution({ quizzes, isLoading }: QuizTypeDistributionProps) {
  const getChartData = (): ChartDataItem[] => {
    if (!quizzes.length) return [];
    
    const groupedByType = _.groupBy(quizzes, 'type');
    return Object.entries(groupedByType).map(([type, items]) => ({
      type: type,
      count: items.length
    }));
  };

  if (isLoading) {
    return (
      <div className="h-64 w-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Chargement des données...</p>
      </div>
    );
  }

  const chartData = getChartData();

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="type" 
            angle={-45}
            textAnchor="end"
            interval={0}
            height={60}
          />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" name="Nombre de quiz" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function Dashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [quizResults, setQuizResults] = useState<any[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(true);
  const [isLoadingResults, setIsLoadingResults] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const adminId = localStorage.getItem('adminId');

  useEffect(() => {
    const fetchUsers = async () => {
      if (!adminId) {
        setError('Admin ID not found. Please login again.');
        setIsLoadingUsers(false);
        return;
      }

      try {
        const response = await fetch(`http://98.71.171.3:8001/admin/${adminId}/users`);
        if (response.status === 404) {
          setUsers([]);
          return;
        }
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        if (err instanceof Error && err.message.includes('404')) {
          setUsers([]);
        } else {
          setError(err instanceof Error ? err.message : 'An error occurred fetching users');
        }
      } finally {
        setIsLoadingUsers(false);
      }
    };

    const fetchQuizzes = async () => {
      if (!adminId) {
        setIsLoadingQuizzes(false);
        return;
      }

      try {
        const response = await fetch(`http://98.71.171.3:8001/quizzes/admin/${adminId}`);
        if (response.status === 404) {
          setQuizzes([]);
          return;
        }
        if (!response.ok) {
          throw new Error('Failed to fetch quizzes');
        }
        const data = await response.json();
        setQuizzes(data);
      } catch (err) {
        if (err instanceof Error && err.message.includes('404')) {
          setQuizzes([]);
        } else {
          setError(err instanceof Error ? err.message : 'An error occurred fetching quizzes');
        }
      } finally {
        setIsLoadingQuizzes(false);
      }
    };

    const fetchQuizResults = async () => {
      if (!adminId) {
        setIsLoadingResults(false);
        return;
      }

      try {
        const response = await fetch(`http://98.71.171.3:8001/admin/${adminId}/quiz-results`);
        if (response.status === 404) {
          setQuizResults([]);
          return;
        }
        if (!response.ok) {
          throw new Error('Failed to fetch quiz results');
        }
        const data = await response.json();
        setQuizResults(data);
      } catch (err) {
        if (err instanceof Error && err.message.includes('404')) {
          setQuizResults([]);
        } else {
          setError(err instanceof Error ? err.message : 'An error occurred fetching quiz results');
        }
      } finally {
        setIsLoadingResults(false);
      }
    };

    Promise.all([fetchUsers(), fetchQuizzes(), fetchQuizResults()]).catch(err => {
      if (err instanceof Error && !err.message.includes('404')) {
        setError('Failed to fetch dashboard data');
      }
    });
  }, [adminId]);

  if (!adminId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Admin ID not found. Please login again.
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={Users}
          label="Utilisateurs totaux"
          value={users.length}
          color="text-blue-600"
          isLoading={isLoadingUsers}
        />
        <StatCard
          icon={BookOpen}
          label="Quizz créés"
          value={quizzes.length}
          color="text-green-600"
          isLoading={isLoadingQuizzes}
        />
        <StatCard
          icon={Award}
          label="Quizz joués"
          value={quizResults.length}
          color="text-purple-600"
          isLoading={isLoadingResults}
        />
      </div>

      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Distribution des types de quiz</h2>
          <QuizTypeDistribution 
            quizzes={quizzes} 
            isLoading={isLoadingQuizzes} 
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;