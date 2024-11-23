import React, { useState } from 'react';
import { Key, Loader } from 'lucide-react';
import api from '../services/api';

// Custom Alert components
interface Alert {
  variant?: 'default' | 'destructive';
  className?: string;
  children: React.ReactNode;
}

interface AlertDescription {
  children: React.ReactNode;
}

const Alert = ({ variant = 'default', className = '', children }: Alert) => {
  const baseClasses = 'p-4 rounded-lg border';
  const variantClasses = {
    default: 'bg-blue-50 border-blue-200 text-blue-700',
    destructive: 'bg-red-50 border-red-200 text-red-700'
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

const AlertDescription = ({ children }: AlertDescription) => {
  return <div className="text-sm">{children}</div>;
};

function Profile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.newPassword.length < 8) {
      setError('Le nouveau mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setLoading(true);
    try {
      const adminId = localStorage.getItem('adminId');
      if (!adminId) {
        throw new Error('ID administrateur non trouvé');
      }

      const response = await api.put(`/admins/${adminId}/password`, null, {
        params: {
          new_password: formData.newPassword
        }
      });

      if (response.status === 200) {
        setError('');
        setFormData({
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (error: any) {
      console.error('Error updating password:', error);
      setError(error.response?.data?.message || 'Erreur lors de la mise à jour du mot de passe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Profil</h1>

      <div className="max-w-xl bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-full">
              <Key className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-lg font-semibold">Changer le mot de passe</h2>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="m-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              id="newPassword"
              className="input mt-1"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              required
              minLength={8}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirmer le nouveau mot de passe
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="input mt-1"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              minLength={8}
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full flex justify-center items-center"
            >
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                'Mettre à jour le mot de passe'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;