import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { showAlert } from '../utils/Alerts';
import UploadDocumentModal from '../components/UploadDocumentModal';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState({ documents: 0, questions: 0, revisions: 0 });

  useEffect(() => {
    const userInfo = localStorage.getItem('user');
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        setUserName(user.username || 'Élève');
      } catch (e) {
        console.error('Erreur parsing user info:', e);
      }
    }
  }, []);

  const handleLogout = async () => {
    const result = await showAlert.confirm('Déconnexion', 'Êtes-vous sûr de vouloir quitter ?');
    if (result.isConfirmed) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      await showAlert.success('À bientôt !', 'Bonne révision');
      navigate('/login');
    }
  };

  const handleUploadSuccess = () => {
    setStats(prev => ({ ...prev, documents: prev.documents + 1 }));
  };

  const steps = [
    {
      step: '1',
      title: 'Importer un cours',
      description: 'Téléchargez votre document PDF, Word ou TXT',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
      color: 'from-indigo-500 to-purple-600',
    },
    {
      step: '2',
      title: 'Transformer en questions',
      description: "Laissez l'IA générer vos questions-réponses",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-purple-500 to-pink-500',
    },
    {
      step: '3',
      title: 'Révisez efficacement',
      description: 'Accédez à vos questions-réponses et téléchargez-les en PDF',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      color: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col overflow-hidden">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-lg border-b border-indigo-100 shadow-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-12">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h1 className="text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">StudyAI</h1>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-semibold text-gray-800">{userName}</span>
              </div>
              <Button onClick={handleLogout} variant="danger" className="text-xs px-3 py-1">
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="flex-1 max-h-full max-w-7xl mx-auto px-4 py-3 flex flex-col gap-3 overflow-hidden">
        {/* Hero */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Bienvenue, <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{userName}</span> ! 🎓
          </h2>
          <p className="text-xs text-gray-600">Transformez vos cours en questions-réponses avec l'IA</p>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-3 gap-2">
          {[
            { label: 'Documents', value: stats.documents, icon: '📄', color: 'from-blue-500 to-cyan-500' },
            { label: 'Questions', value: stats.questions, icon: '❓', color: 'from-purple-500 to-pink-500' },
            { label: 'Révisions', value: stats.revisions, icon: '✅', color: 'from-green-500 to-emerald-500' }
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-lg p-2 shadow-sm border border-gray-100">
              <p className="text-[10px] text-gray-500 font-medium mb-0.5">{stat.label}</p>
              <div className="flex items-center justify-between">
                <p className={`text-xl font-semibold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent leading-none`}>
                  {stat.value}
                </p>
                <span className="text-xl">{stat.icon}</span>
              </div>
            </div>
          ))}
        </section>

        {/* Steps */}
        <section className="grid grid-cols-3 gap-3">
          {steps.map((item, index) => (
            <div key={index} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-2.5">
                <div className={`w-9 h-9 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center text-white font-bold text-base mr-2.5 shadow`}>
                  {item.step}
                </div>
                <div className={`w-9 h-9 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center text-white`}>
                  {item.icon}
                </div>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1 text-base">{item.title}</h4>
              <p className="text-xs text-gray-600 leading-tight">{item.description}</p>
            </div>
          ))}
        </section>

        {/* Actions principales */}
        <section className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg p-3 text-left hover:shadow-md transition-all text-sm"
          >
            <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center mb-1.5">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h4 className="font-semibold text-sm mb-0.5">Importer un cours</h4>
            <p className="text-[11px] text-white/80">PDF, Word ou TXT</p>
          </button>
          <button
            onClick={() => showAlert.info('Bientôt', 'Fonctionnalité à venir')}
            className="bg-white border border-gray-300 rounded-lg p-3 text-left hover:shadow-md transition-all text-sm"
          >
            <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center mb-1.5">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-800 mb-0.5 text-sm">Mes questions</h4>
            <p className="text-[11px] text-gray-600">Bibliothèque QR</p>
          </button>
        </section>

        {/* CTA principale */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-5 text-white flex-1 flex flex-col justify-center">
          <h3 className="text-xl font-semibold mb-1.5">Prêt à réviser ? 🚀</h3>
          <p className="text-indigo-100 text-xs mb-3 leading-tight">Importez un document et générez vos questions en quelques secondes</p>
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-indigo-600 hover:bg-indigo-50 w-fit text-sm px-4 py-2"
          >
            Commencer maintenant
          </Button>
        </section>
      </main>

      <UploadDocumentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
};

export default Dashboard;
