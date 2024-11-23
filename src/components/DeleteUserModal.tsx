import React from 'react';
import { Loader } from 'lucide-react';

type DeleteUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
};

const DeleteUserModal = ({ isOpen, onClose, onConfirm, isLoading }: DeleteUserModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Confirmer la suppression
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cela entraînera la suppression de tous les quizzes qu'il a créés.
            </p>
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              Quitter
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {isLoading && (
                <Loader className="w-4 h-4 animate-spin mr-2" />
              )}
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;