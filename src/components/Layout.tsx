import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, Users, Home, User, LogOut } from 'lucide-react';

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminId');
    navigate('/login');
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-800 text-white">
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <Shield className="w-8 h-8" />
            <span className="text-xl font-bold">QuizPhere Admin</span>
          </div>
        </div>
        <nav className="mt-6">
          {[
            { path: '/dashboard', icon: Home, label: 'Dashboard' },
            { path: '/users', icon: Users, label: 'Utilisateurs' },
            { path: '/profile', icon: User, label: 'Profil' },
          ].map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center px-6 py-3 text-sm ${
                location.pathname === path
                  ? 'bg-indigo-900 border-l-4 border-white'
                  : 'hover:bg-indigo-700'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-6 py-3 text-sm text-red-300 hover:bg-indigo-700"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Déconnexion
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;