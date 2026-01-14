import React, { useState, useRef } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { showAlert } from '../utils/Alerts';
import { DocumentService } from '../services/DocumentService';
import Swal from 'sweetalert2';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess?: () => void;
}

const UploadDocumentModal: React.FC<Props> = ({ isOpen, onClose, onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const allowedTypes = [
    'text/plain',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  const validateFile = (file: File): boolean => {
    if (!allowedTypes.includes(file.type)) {
      showAlert.error('Format non supporté', 'Veuillez sélectionner un fichier TXT, PDF, DOC ou DOCX');
      return false;
    }
    const maxSize = 15 * 1024 * 1024;
    if (file.size > maxSize) {
      showAlert.error('Fichier trop volumineux', 'Taille maximale : 15 Mo');
      return false;
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) setFile(selectedFile);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) setFile(droppedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      showAlert.error('Aucun fichier', 'Veuillez sélectionner un document');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      showAlert.error('Session expirée', 'Veuillez vous reconnecter');
      return;
    }

    setLoading(true);
    showAlert.loading('Analyse en cours...');

    try {
      const response = await DocumentService.uploadDocument(file);
      Swal.close();
      if (response.success) {
        await showAlert.success('Document importé !', 'Génération des questions...');
        setFile(null);
        if (onUploadSuccess) onUploadSuccess();
        onClose();
      } else {
        showAlert.error('Erreur', response.message || 'Échec de l\'importation');
      }
    } catch (error) {
      Swal.close();
      showAlert.error('Erreur', error instanceof Error ? error.message : 'Erreur serveur');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Ko';
    const k = 1024;
    const sizes = ['Octets', 'Ko', 'Mo'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-indigo-900/90 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Importer un document</h2>
              <p className="text-indigo-100 text-xs">Notre IA va générer vos questions-réponses</p>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white p-1" disabled={loading}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4">
          {/* Zone de dépôt */}
          <div
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
              dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'
            } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !loading && fileInputRef.current?.click()}
          >
            <input ref={fileInputRef} type="file" accept=".txt,.pdf,.doc,.docx" onChange={handleFileChange} className="hidden" disabled={loading} />

            {!file ? (
              <div>
                <div className="w-12 h-12 bg-indigo-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-700 mb-1">Glissez votre document ici</p>
                <p className="text-xs text-gray-500 mb-2">ou cliquez pour parcourir</p>
                <p className="text-xs text-gray-400">PDF, Word, TXT (max 15 Mo)</p>
              </div>
            ) : (
              <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {file.name.split('.').pop()?.toUpperCase()}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-medium text-gray-900 truncate text-sm">{file.name}</p>
                    <p className="text-xs text-gray-600">{formatFileSize(file.size)}</p>
                  </div>
                  {!loading && (
                    <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-gray-400 hover:text-red-500 flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-2">
            <p className="text-xs text-blue-700 flex items-start">
              <svg className="w-4 h-4 mr-1 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Notre IA analysera le contenu et générera des questions-réponses pour vos révisions
            </p>
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="secondary" onClick={onClose} disabled={loading} className="px-4 py-2 text-sm">
              Annuler
            </Button>
            <Button variant="primary" onClick={handleUpload} disabled={loading || !file} className="px-4 py-2 text-sm bg-gradient-to-r from-indigo-600 to-purple-600">
              {loading ? 'Analyse...' : 'Générer les questions'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadDocumentModal;