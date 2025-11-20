import { authService } from './authService';

const API_URL = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/api`
  : (process.env.NODE_ENV === 'production' 
    ? 'https://froppo-production.up.railway.app/api'
    : 'http://localhost:5248/api');

export interface FileUploadResponse {
  fileName: string;
  originalName: string;
  size: number;
  isDuplicate: boolean;
  message: string;
}

export interface FileDownloadResponse {
  blob: Blob;
  filename: string;
  originalName: string;
}

export class CertificateService {
  private static instance: CertificateService;
  
  public static getInstance(): CertificateService {
    if (!CertificateService.instance) {
      CertificateService.instance = new CertificateService();
    }
    return CertificateService.instance;
  }

  async uploadCertificate(file: File): Promise<FileUploadResponse> {
    const token = authService.getToken();
    if (!token) {
      throw new Error('Token di autenticazione non trovato');
    }

    // Validazioni client-side
    if (!file) {
      throw new Error('Nessun file selezionato');
    }

    if (file.type !== 'application/pdf') {
      throw new Error('Solo file PDF sono accettati');
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      throw new Error('File troppo grande (max 10MB)');
    }

    const formData = new FormData();
    formData.append('certificate', file);

    try {
      const response = await fetch(`${API_URL}/files/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Errore nel caricamento: ${errorText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Errore durante upload:', error);
      throw error;
    }
  }

  async downloadCertificate(fileName: string): Promise<FileDownloadResponse> {
    const token = authService.getToken();
    if (!token) {
      throw new Error('Token di autenticazione non trovato');
    }

    try {
      const response = await fetch(`${API_URL}/files/${fileName}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Errore nel download: ${response.statusText}`);
      }

      const blob = await response.blob();
      const originalName = response.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') || fileName;

      return {
        blob,
        filename: fileName,
        originalName
      };
    } catch (error) {
      console.error('Errore durante download:', error);
      throw error;
    }
  }

  async downloadAllCertificates(users: any[]): Promise<Map<string, FileDownloadResponse>> {
    const certificateMap = new Map<string, FileDownloadResponse>();
    
    // Filtra solo gli utenti con certificati
    const usersWithCertificates = users.filter(user => 
      user.certificate && 
      user.certificate.trim() !== '' && 
      user.certificate !== null
    );

    console.log(`Scaricando certificati per ${usersWithCertificates.length} utenti`);

    // Download parallelo dei certificati
    const downloadPromises = usersWithCertificates.map(async (user) => {
      try {
        const downloadResult = await this.downloadCertificate(user.certificate);
        return { user, downloadResult };
      } catch (error) {
        console.warn(`Impossibile scaricare certificato per ${user.firstName} ${user.lastName}:`, error);
        return null;
      }
    });

    const results = await Promise.allSettled(downloadPromises);
    
    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        const { user, downloadResult } = result.value;
        certificateMap.set(user.certificate, downloadResult);
      }
    });

    console.log(`Certificati scaricati con successo: ${certificateMap.size}/${usersWithCertificates.length}`);
    
    return certificateMap;
  }

  async deleteCertificate(fileName: string): Promise<boolean> {
    const token = authService.getToken();
    if (!token) {
      throw new Error('Token di autenticazione non trovato');
    }

    try {
      const response = await fetch(`${API_URL}/files/${fileName}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Errore durante eliminazione:', error);
      return false;
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  validateFile(file: File): { isValid: boolean; error?: string } {
    if (!file) {
      return { isValid: false, error: 'Nessun file selezionato' };
    }

    if (file.type !== 'application/pdf') {
      return { isValid: false, error: 'Solo file PDF sono accettati' };
    }

    if (file.size > 10 * 1024 * 1024) {
      return { isValid: false, error: 'File troppo grande (max 10MB)' };
    }

    if (file.size === 0) {
      return { isValid: false, error: 'File vuoto' };
    }

    return { isValid: true };
  }
}

// Esporta istanza singleton
export const certificateService = CertificateService.getInstance();
export default certificateService;
