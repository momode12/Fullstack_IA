import { uploadFile } from '../types/api';

export interface DocumentUploadResponse {
  success: boolean;
  message?: string;
  document_id?: string;
}

export const DocumentService = {
  uploadDocument: async (file: File): Promise<DocumentUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      // L'endpoint correct est maintenant api/documents/upload
      const data = await uploadFile<DocumentUploadResponse>(
        'api/documents/upload',
        formData
      );

      return data;
    } catch (error) {
      console.error('Erreur lors du téléversement:', error);
      throw error;
    }
  }
};