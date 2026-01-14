import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { showAlert } from '../utils/Alerts';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await showAlert.confirm(
      'Êtes-vous sûr ?',
      'Voulez-vous vraiment vous déconnecter ?'
    );

    if (result.isConfirmed) {
      localStorage.removeItem('token');
      await showAlert.success('Déconnecté', 'À bientôt !');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <Button onClick={handleLogout} variant="danger">
              Déconnexion
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Card>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Bienvenue !</h2>
          <p className="text-gray-600">Vous êtes maintenant connecté à votre compte.</p>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;