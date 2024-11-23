import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Loader } from 'lucide-react';
import api from '../services/api';

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/admin/token', credentials);
      const { access_token, adminId } = response.data;

      localStorage.setItem('token', access_token);
      localStorage.setItem('adminId', adminId);
      
      // Only clear error and navigate on success
      setErrorMessage('');
      navigate('/dashboard');
    } catch (error: any) {
      if (error.response?.status === 401) {
        setErrorMessage(error.response.data.detail || 'Identifiants incorrects');
      } else {
        setErrorMessage('Échec de la connexion');
      }
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Only clear error message when both fields change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newCredentials = { ...credentials, [name]: value };
    setCredentials(newCredentials);
    
    // Only clear error if both fields have values and have changed
    if (newCredentials.email && newCredentials.password) {
      setErrorMessage('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            QuizPhere Admin
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Connectez-vous à votre compte administrateur
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border 
                  ${errorMessage ? 'border-red-300' : 'border-gray-300'}
                  placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none 
                  focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Email"
                value={credentials.email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border 
                  ${errorMessage ? 'border-red-300' : 'border-gray-300'}
                  placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none 
                  focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Mot de passe"
                value={credentials.password}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Error Message Display */}
          {errorMessage && (
            <div className="text-sm text-red-600 text-center bg-red-50 p-3 rounded-md border border-red-200">
              {errorMessage}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? (
                <Loader className="animate-spin h-5 w-5" />
              ) : (
                'Se connecter'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;