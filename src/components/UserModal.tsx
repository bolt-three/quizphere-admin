import React, { useState } from 'react';
import { X, Loader } from 'lucide-react';
import { sendPasswordEmail } from '../services/email';
import toast from 'react-hot-toast';

type UserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { email: string; password: string }) => Promise<boolean>;
  title: string;
  isLoading?: boolean;
};

function UserModal({ isOpen, onClose, onSubmit, title, isLoading }: UserModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sendEmail, setSendEmail] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError('L\'email est requis');
      return;
    }
    if (!password) {
      setError('Le mot de passe est requis');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      const success = await onSubmit({ email, password });
      
      if (success && sendEmail) {
        try {
          await sendPasswordEmail(email, password, true);
          toast.success('Email envoyé avec succès');
        } catch (error) {
          console.error('Error sending email:', error);
          toast.error('Erreur lors de l\'envoi de l\'email');
        }
      }
      
      if (success) {
        setEmail('');
        setPassword('');
        setSendEmail(true);
      }
    } catch (err) {
      // Error handling is done in the parent component
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input w-full"
              disabled={isLoading}
              placeholder="exemple@email.com"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input w-full"
              disabled={isLoading}
              placeholder="••••••••"
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-600">
                Envoyer les identifiants par email
              </span>
            </label>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="btn btn-secondary mr-2"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
            >
              {isLoading ? 'Création...' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserModal;