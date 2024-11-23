import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, Search, Loader, Key } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import api from '../services/api';
import toast from 'react-hot-toast';
import UserModal from '../components/UserModal';
import PasswordChangeModal from '../components/PasswordChangeModal';
import DeleteUserModal from '../components/DeleteUserModal';
import { useNavigate } from 'react-router-dom';

type User = {
  user_id: string;
  email: string;
  created_at: string;
};

type UserCreateData = {
  email: string;
  password: string;
};

function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingUser, setAddingUser] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserEmail, setSelectedUserEmail] = useState<string>('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const adminId = localStorage.getItem('adminId');
    
    if (!adminId) {
      toast.error('Session expirée');
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }
  
    try {
      const response = await api.get(`/admin/${adminId}/users`);
      setUsers(response.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.log('Setting empty users array for 404 response');
        setUsers([]);
        return;
      }
      
      console.error('Error fetching users:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (userData: UserCreateData) => {
    const adminId = localStorage.getItem('adminId');
    if (!adminId) {
      toast.error('Session expirée');
      navigate('/login');
      return false;
    }

    setAddingUser(true);

    try {
      const requestBody = {
        email: userData.email,
        password: userData.password,
        created_by_admin_id: adminId
      };

      await api.post('/users/', requestBody);
      await fetchUsers();
      
      toast.success('Utilisateur créé avec succès');
      setIsModalOpen(false);
      return true;
    } catch (error: any) {
      console.error('Error adding user:', error);
      if (error.response?.status === 500) {
        toast.error('Un utilisateur avec cet email existe déjà');
      } else {
        toast.error('Erreur lors de la création de l\'utilisateur');
      }
      return false;
    } finally {
      setAddingUser(false);
    }
  };

  const openDeleteModal = (userId: string) => {
    setSelectedUserId(userId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!selectedUserId) return;

    setDeleteLoading(true);

    try {
      const response = await api.delete(`/users/${selectedUserId}`);
      
      if (response.data.message === "User deleted successfully") {
        toast.success('Utilisateur supprimé avec succès');
        setUsers(users.filter(user => user.user_id !== selectedUserId));
        setIsDeleteModalOpen(false);
        setSelectedUserId(null);
      } else {
        throw new Error('Unexpected response from server');
      }
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression de l\'utilisateur');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleChangePassword = async (password: string) => {
    if (!selectedUserId) return;

    setPasswordChangeLoading(true);
    try {
      await api.put(`/users/${selectedUserId}/password?new_password=${password}`);
      toast.success('Mot de passe modifié avec succès');
      setIsPasswordModalOpen(false);
      setSelectedUserId(null);
      setSelectedUserEmail('');
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la modification du mot de passe');
    } finally {
      setPasswordChangeLoading(false);
    }
  };

  const openPasswordModal = (userId: string, userEmail: string) => {
    setSelectedUserId(userId);
    setSelectedUserEmail(userEmail);
    setIsPasswordModalOpen(true);
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'PPP', { locale: fr });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date invalide';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary flex items-center"
          disabled={addingUser}
        >
          {addingUser ? (
            <Loader className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <UserPlus className="w-4 h-4 mr-2" />
          )}
          Ajouter un utilisateur
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par email..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Loader className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de création
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.user_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.user_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                      <button
                        onClick={() => openPasswordModal(user.user_id, user.email)}
                        className="text-blue-600 hover:text-blue-900 inline-block mr-2"
                        title="Modifier le mot de passe"
                      >
                        <Key className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(user.user_id)}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed inline-block"
                        title="Supprimer l'utilisateur"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => !addingUser && setIsModalOpen(false)}
        onSubmit={handleAddUser}
        title="Ajouter un utilisateur"
        isLoading={addingUser}
      />

      <PasswordChangeModal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          if (!passwordChangeLoading) {
            setIsPasswordModalOpen(false);
            setSelectedUserId(null);
            setSelectedUserEmail('');
          }
        }}
        onSubmit={handleChangePassword}
        title="Modifier le mot de passe"
        isLoading={passwordChangeLoading}
        userEmail={selectedUserEmail}
      />

      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          if (!deleteLoading) {
            setIsDeleteModalOpen(false);
            setSelectedUserId(null);
          }
        }}
        onConfirm={handleDeleteUser}
        isLoading={deleteLoading}
      />
    </div>
  );
}

export default Users;