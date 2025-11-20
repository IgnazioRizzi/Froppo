import { authService } from './authService';

const API_URL = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/api`
  : (process.env.NODE_ENV === 'production' 
    ? 'https://froppo-production.up.railway.app/api'
    : 'http://localhost:5248/api');

export interface FileDownloadOptions {
  filename?: string;
}

export const fileService = {
  async downloadPDF(filename: string, options: FileDownloadOptions = {}): Promise<Blob> {
    const token = authService.getToken();
    if (!token) {
      throw new Error('Token di autenticazione non trovato');
    }

    const response = await fetch(`${API_URL}/files/${filename}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/pdf',
      },
    });

    if (!response.ok) {
      throw new Error(`Errore nel download del file: ${response.statusText}`);
    }

    return await response.blob();
  },

  async downloadAllPDFs(users: any[]): Promise<Map<string, Blob>> {
    const pdfMap = new Map<string, Blob>();
    
    for (const user of users) {
      if (user.certificate && user.certificate.trim() !== '') {
        try {
          const pdfBlob = await this.downloadPDF(user.certificate);
          pdfMap.set(user.certificate, pdfBlob);
        } catch (error) {
          console.warn(`Impossibile scaricare il PDF per ${user.firstName} ${user.lastName}:`, error);
        }
      }
    }
    
    return pdfMap;
  }
};

export default fileService;
