import React, { useState } from 'react';
import { X, Loader } from 'lucide-react';
import { sendPasswordEmail } from '../services/email';
import toast from 'react-hot-toast';

type PasswordChangeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => Promise<void>;
  title: string;
  isLoading: boolean;
  userEmail?: string;
};

function PasswordChangeModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  isLoading,
  userEmail
}: PasswordChangeModalProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [sendEmail, setSendEmail] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setError('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    try {
      await onSubmit(password);
      
      if (sendEmail && userEmail) {
        try {
          await sendPasswordEmail(userEmail, password, false);
          toast.success('Email envoyé avec succès');
        } catch (error) {
          console.error('Error sending email:', error);
          toast.error('Erreur lors de l\'envoi de l\'email');
        }
      }
      
      setPassword('');
      setConfirmPassword('');
      setSendEmail(true);
    } catch (error) {
      console.error('Error in password change:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 input w-full"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 input w-full"
                required
                disabled={isLoading}
              />
            </div>

            {userEmail && (
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={sendEmail}
                    onChange={(e) => setSendEmail(e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Envoyer le nouveau mot de passe par email
                  </span>
                </label>
              </div>
            )}

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}
          </div>

          <div className="mt-6 flex justify-end">
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
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Modification...
                </>
              ) : (
                'Modifier'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PasswordChangeModal;