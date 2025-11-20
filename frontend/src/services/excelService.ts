import ExcelJS from 'exceljs';
import JSZip from 'jszip';
import { User } from '../types/User';
import { certificateService } from './certificateService';

export interface ExcelExportOptions {
  filename?: string;
  includeHeaders?: boolean;
}

export const excelService = {
  async exportUsers(users: User[], options: ExcelExportOptions = {}): Promise<void> {
    const { filename = 'utenti.xlsx' } = options;
    
    // Ordina gli utenti alfabeticamente per nome
    const sortedUsers = [...users].sort((a, b) => {
      const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
      const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });

    // Crea un nuovo workbook ExcelJS
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Utenti');

    // Definisci le colonne
    worksheet.columns = [
      { header: 'Nome', key: 'firstName', width: 20 },
      { header: 'Cognome', key: 'lastName', width: 20 },
      { header: 'Codice Fiscale', key: 'codiceFiscale', width: 20 },
      { header: 'Luogo di Nascita', key: 'placeOfBirth', width: 25 },
      { header: 'Residenza', key: 'residence', width: 35 }
    ];

    // Applica stile SOLO alle celle dell'header (riga 1) - massimo 5 colonne
    const headerRow = worksheet.getRow(1);
    headerRow.height = 25;
    
    // Applica stile SOLO alle prime 5 celle dell'header
    for (let i = 1; i <= 5; i++) {
      const cell = headerRow.getCell(i);
      cell.font = { bold: true, size: 12, color: { argb: 'FF000000' } };
      cell.fill = {
        type: 'pattern' as const,
        pattern: 'solid' as const,
        fgColor: { argb: 'FFFFFF00' } // Giallo
      };
      cell.border = {
        top: { style: 'thin' as const, color: { argb: 'FF000000' } },
        bottom: { style: 'thin' as const, color: { argb: 'FF000000' } },
        left: { style: 'thin' as const, color: { argb: 'FF000000' } },
        right: { style: 'thin' as const, color: { argb: 'FF000000' } }
      };
      cell.alignment = { vertical: 'middle' as const, horizontal: 'center' as const };
    }

    // Aggiungi i dati come array nell'ordine delle colonne
    sortedUsers.forEach(user => {
      const row = worksheet.addRow([
        user.firstName || '',
        user.lastName || '',
        user.codiceFiscale || '',
        user.placeOfBirth || '',
        user.residence || ''
      ]);

      // Applica stile SOLO alle prime 5 celle dei dati (bianco per evitare sfondo giallo)
      for (let i = 1; i <= 5; i++) {
        const cell = row.getCell(i);
        cell.border = {
          top: { style: 'thin' as const, color: { argb: 'FF000000' } },
          bottom: { style: 'thin' as const, color: { argb: 'FF000000' } },
          left: { style: 'thin' as const, color: { argb: 'FF000000' } },
          right: { style: 'thin' as const, color: { argb: 'FF000000' } }
        };
        cell.alignment = { vertical: 'middle' as const, horizontal: 'left' as const };
        cell.font = { size: 11 };
        // Sfondo bianco esplicito per evitare che erediti il giallo
        cell.fill = {
          type: 'pattern' as const,
          pattern: 'solid' as const,
          fgColor: { argb: 'FFFFFFFF' } // Bianco
        };
      }
      
      // Altezza riga aumentata per leggibilità
      row.height = 20;
    });

    // Genera il buffer del file
    const buffer = await workbook.xlsx.writeBuffer();
    
    // Crea il blob e scarica
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  async exportUsersWithPDFs(users: User[], options: ExcelExportOptions = {}): Promise<void> {
    const { filename = 'utenti.zip' } = options;
    
    // Ordina gli utenti alfabeticamente per nome
    const sortedUsers = [...users].sort((a, b) => {
      const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
      const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });

    // Crea un nuovo workbook ExcelJS
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Utenti');

    // Definisci le colonne
    worksheet.columns = [
      { header: 'Nome', key: 'firstName', width: 20 },
      { header: 'Cognome', key: 'lastName', width: 20 },
      { header: 'Codice Fiscale', key: 'codiceFiscale', width: 20 },
      { header: 'Luogo di Nascita', key: 'placeOfBirth', width: 25 },
      { header: 'Residenza', key: 'residence', width: 35 }
    ];

    // Applica stile SOLO alle celle dell'header (riga 1) - massimo 5 colonne
    const headerRow = worksheet.getRow(1);
    headerRow.height = 25;
    
    // Applica stile SOLO alle prime 5 celle dell'header
    for (let i = 1; i <= 5; i++) {
      const cell = headerRow.getCell(i);
      cell.font = { bold: true, size: 12, color: { argb: 'FF000000' } };
      cell.fill = {
        type: 'pattern' as const,
        pattern: 'solid' as const,
        fgColor: { argb: 'FFFFFF00' } // Giallo
      };
      cell.border = {
        top: { style: 'thin' as const, color: { argb: 'FF000000' } },
        bottom: { style: 'thin' as const, color: { argb: 'FF000000' } },
        left: { style: 'thin' as const, color: { argb: 'FF000000' } },
        right: { style: 'thin' as const, color: { argb: 'FF000000' } }
      };
      cell.alignment = { vertical: 'middle' as const, horizontal: 'center' as const };
    }

    // Aggiungi i dati come array nell'ordine delle colonne
    sortedUsers.forEach(user => {
      const row = worksheet.addRow([
        user.firstName || '',
        user.lastName || '',
        user.codiceFiscale || '',
        user.placeOfBirth || '',
        user.residence || ''
      ]);

      // Applica stile SOLO alle prime 5 celle dei dati (bianco per evitare sfondo giallo)
      for (let i = 1; i <= 5; i++) {
        const cell = row.getCell(i);
        cell.border = {
          top: { style: 'thin' as const, color: { argb: 'FF000000' } },
          bottom: { style: 'thin' as const, color: { argb: 'FF000000' } },
          left: { style: 'thin' as const, color: { argb: 'FF000000' } },
          right: { style: 'thin' as const, color: { argb: 'FF000000' } }
        };
        cell.alignment = { vertical: 'middle' as const, horizontal: 'left' as const };
        cell.font = { size: 11 };
        // Sfondo bianco esplicito per evitare che erediti il giallo
        cell.fill = {
          type: 'pattern' as const,
          pattern: 'solid' as const,
          fgColor: { argb: 'FFFFFFFF' } // Bianco
        };
      }
      
      // Altezza riga aumentata per leggibilità
      row.height = 20;
    });

    // Genera il buffer del file Excel
    const excelBuffer = await workbook.xlsx.writeBuffer();

    // Crea l'archivio ZIP
    const zip = new JSZip();
    
    // Aggiungi il file Excel
    zip.file('utenti.xlsx', excelBuffer);
    
    // Crea la cartella per i PDF
    const pdfsFolder = zip.folder('certificati');
    
    // Scarica tutti i certificati PDF degli utenti
    try {
      console.log('Inizio download certificati...');
      const certificateMap = await certificateService.downloadAllCertificates(sortedUsers);
      
      // Aggiungi i certificati alla cartella
      certificateMap.forEach(async (downloadResult, fileName) => {
        const pdfArrayBuffer = await downloadResult.blob.arrayBuffer();
        pdfsFolder?.file(downloadResult.originalName, pdfArrayBuffer);
      });
      
      // Aggiungi un file README con informazioni dettagliate
      const readmeContent = `CERTIFICATI PDF - ESPORTAZIONE DIPENDENTI
===============================================

Data esportazione: ${new Date().toLocaleString('it-IT')}
Utenti esportati: ${sortedUsers.length}
Certificati inclusi: ${certificateMap.size}

LISTA CERTIFICATI:
${sortedUsers
  .filter(user => user.certificate && user.certificate.trim() !== '')
  .map(user => {
    const hasCertificate = user.certificate ? certificateMap.has(user.certificate) : false;
    const status = hasCertificate ? '✓ INCLUSO' : '✗ NON DISPONIBILE';
    return `- ${user.firstName} ${user.lastName}: ${user.certificate} [${status}]`;
  })
  .join('\n')}

${certificateMap.size > 0 
  ? `\nTOTALE CERTIFICATI INCLUSI: ${certificateMap.size}`
  : '\nNESSUN CERTIFICATO DISPONIBILE'}

NOTA: I file PDF sono stati scaricati dal server e inclusi in questo archivio.
Ogni certificato mantiene il nome originale del file.

===============================================
Generato da Froppo Gestionale
`;
      
      pdfsFolder?.file('README_CERTIFICATI.txt', readmeContent);
      
      console.log(`Esportazione completata: ${certificateMap.size} certificati inclusi`);
      
    } catch (error) {
      console.error('Errore durante il download dei certificati:', error);
      
      // Aggiungi comunque un README con informazioni sull'errore
      const errorReadme = `ERRORE DURANTE IL DOWNLOAD DEI CERTIFICATI
===============================================

Data esportazione: ${new Date().toLocaleString('it-IT')}
Utenti esportati: ${sortedUsers.length}
Certificati inclusi: 0

ERRORE: ${error instanceof Error ? error.message : 'Errore sconosciuto'}

I certificati PDF non sono stati inclusi nell'archivio.
Verificare la connessione e riprovare l'esportazione.

===============================================
Generato da Froppo Gestionale
`;
      
      pdfsFolder?.file('README_CERTIFICATI.txt', errorReadme);
    }

    // Genera e scarica il file ZIP
    const zipBuffer = await zip.generateAsync({ type: 'blob' });
    
    // Crea il link di download
    const url = window.URL.createObjectURL(zipBuffer);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  async readExcelFile(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.load(data);
          const worksheet = workbook.getWorksheet(1);
          
          if (!worksheet) {
            reject(new Error('Nessun worksheet trovato nel file'));
            return;
          }
          
          const jsonData: any[] = [];
          
          worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (rowNumber === 1) return; // Salta l'header
            
            const rowData: any = {};
            row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
              const headerCell = worksheet.getRow(1).getCell(colNumber);
              const header = headerCell.value?.toString() || '';
              rowData[header] = cell.value;
            });
            jsonData.push(rowData);
          });
          
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Errore nella lettura del file'));
      reader.readAsArrayBuffer(file);
    });
  }
};

export default excelService;
