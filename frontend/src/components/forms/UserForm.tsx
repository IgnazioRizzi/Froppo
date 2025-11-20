import React, { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { User } from '../../types/User';
import { useToast } from '../../hooks/useToast';
import { ToastContainer } from '../common';
import { excelService } from '../../services/excelService';
import { certificateService } from '../../services/certificateService';
import './UserForm.css';

interface UserFormProps {
  user?: User | null;
  onSubmit: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel }) => {
  const { toasts, addToast, removeToast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    codiceFiscale: '',
    email: '',
    dateOfBirth: null as Date | null,
    birthCity: '',
    birthProvince: '',
    residenceStreet: '',
    residenceCity: '',
    residenceProvince: '',
    certificate: '',
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [certificateFileName, setCertificateFileName] = useState<string>('');
  const [isUploadingCertificate, setIsUploadingCertificate] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileUploadRef = useRef<FileUpload>(null);

  useEffect(() => {
    if (user) {
      // Dividi placeOfBirth in città e provincia
      const placeParts = (user.placeOfBirth || '').split(', ');
      const birthCity = placeParts[0] || '';
      const birthProvince = placeParts[1] || '';
      
      // Dividi residence in via, città e provincia
      const residenceParts = (user.residence || '').split(', ');
      const residenceStreet = residenceParts[0] || '';
      const residenceCity = residenceParts[1] || '';
      const residenceProvince = residenceParts[2] || '';
      
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        codiceFiscale: user.codiceFiscale || '',
        email: user.email,
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : null,
        birthCity,
        birthProvince,
        residenceStreet,
        residenceCity,
        residenceProvince,
              certificate: user.certificate || '',
            });
            
            // Imposta il nome del certificato se esiste
            if (user.certificate) {
              setCertificateFileName(user.certificate);
            }
          }
        }, [user]);

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Il nome è obbligatorio';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Il cognome è obbligatorio';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email è obbligatoria';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Formato email non valido';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'La data di nascita è obbligatoria';
    }

    if (!formData.birthCity.trim()) {
      newErrors.birthCity = 'La città di nascita è obbligatoria';
    }

    if (!formData.birthProvince.trim()) {
      newErrors.birthProvince = 'La provincia di nascita è obbligatoria';
    }

    if (!formData.residenceStreet.trim()) {
      newErrors.residenceStreet = 'La via di residenza è obbligatoria';
    }

    if (!formData.residenceCity.trim()) {
      newErrors.residenceCity = 'La città di residenza è obbligatoria';
    }

    if (!formData.residenceProvince.trim()) {
      newErrors.residenceProvince = 'La provincia di residenza è obbligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Rimuovi l'errore quando l'utente inizia a digitare
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'userId'> = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        codiceFiscale: formData.codiceFiscale.trim() || undefined,
        email: formData.email.trim(),
        dateOfBirth: formData.dateOfBirth?.toISOString() || '',
        placeOfBirth: `${formData.birthCity.trim()}, ${formData.birthProvince.trim()}`,
        residence: `${formData.residenceStreet.trim()}, ${formData.residenceCity.trim()}, ${formData.residenceProvince.trim()}`,
        certificate: formData.certificate.trim(),
      };

      await onSubmit(userData);
    } catch (error) {
      console.error('Errore durante il salvataggio:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (event: any) => {
    const file = event.files[0];
    if (!file) return;

    // Validazione file
    const validation = certificateService.validateFile(file);
    if (!validation.isValid) {
      addToast({
        type: 'error',
        message: validation.error || 'File non valido',
        duration: 4000
      });
      return;
    }

    setIsUploadingCertificate(true);
    setUploadProgress(0);

    try {
      // Simula progresso upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      // Carica il file sul server
      const uploadResponse = await certificateService.uploadCertificate(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Aggiorna gli stati
      setCertificateFile(file);
      setCertificateFileName(uploadResponse.fileName);
      setFormData(prev => ({ ...prev, certificate: uploadResponse.fileName }));

      // Mostra messaggio di successo
      const message = uploadResponse.isDuplicate 
        ? `File "${uploadResponse.originalName}" già esistente (riutilizzato)`
        : `File "${uploadResponse.originalName}" caricato con successo`;
      
      addToast({
        type: 'success',
        message: message,
        duration: 4000
      });

      // Reset progress dopo un momento
      setTimeout(() => {
        setUploadProgress(0);
      }, 1000);

    } catch (error) {
      console.error('Errore durante il caricamento:', error);
      addToast({
        type: 'error',
        message: error instanceof Error ? error.message : 'Errore durante il caricamento del file',
        duration: 5000
      });
      setUploadProgress(0);
    } finally {
      setIsUploadingCertificate(false);
    }
  };

  const handleFileRemove = () => {
    setCertificateFile(null);
    setCertificateFileName('');
    setFormData(prev => ({ ...prev, certificate: '' }));
    setUploadProgress(0);
    
    if (fileUploadRef.current) {
      fileUploadRef.current.clear();
    }
    
    addToast({
      type: 'info',
      message: 'Certificato rimosso',
      duration: 3000
    });
  };

  const handleExportPDF = () => {
    if (!user) {
      addToast({
        type: 'warning',
        message: 'Nessun dipendente da esportare',
        duration: 4000
      });
      return;
    }

    try {
      // Crea un array con il singolo utente per l'esportazione
      const userForExport = [user];
      
      // Genera timestamp per il nome file
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `dipendente-${user.firstName}_${user.lastName}-${timestamp}.zip`;
      
      // Esporta con PDF
      excelService.exportUsersWithPDFs(userForExport, { filename });
      
      addToast({
        type: 'success',
        message: 'Esportazione PDF avviata con successo!',
        duration: 4000
      });
    } catch (error) {
      console.error('Errore durante l\'esportazione:', error);
      addToast({
        type: 'error',
        message: 'Errore durante l\'esportazione PDF',
        duration: 5000
      });
    }
  };

  return (
    <div className="glassmorphism-user-form">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <form onSubmit={handleSubmit} className="glassmorphism-form-content">

        {/* Sezione Anagrafica */}
        <div className="mb-5">
          <h5 className="mb-4 text-900 flex align-items-center gap-2">
            <i className="pi pi-user text-blue-500"></i>
            Anagrafica
          </h5>
        
        <div className="grid">
          <div className="col-12 sm:col-6">
            <div className="field">
              <label htmlFor="firstName" className="block text-900 font-medium mb-2">
                Nome *
              </label>
              <InputText
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                className={`glassmorphism-input w-full ${errors.firstName ? 'p-invalid' : ''}`}
                placeholder="Inserisci il nome"
                autoComplete="off"
              />
              {errors.firstName && (
                <small className="p-error mt-1 block">{errors.firstName}</small>
              )}
            </div>
          </div>
          
          <div className="col-12 sm:col-6">
            <div className="field">
              <label htmlFor="lastName" className="block text-900 font-medium mb-2">
                Cognome *
              </label>
              <InputText
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                className={`glassmorphism-input w-full ${errors.lastName ? 'p-invalid' : ''}`}
                placeholder="Inserisci il cognome"
                autoComplete="off"
              />
              {errors.lastName && (
                <small className="p-error mt-1 block">{errors.lastName}</small>
              )}
            </div>
          </div>
        </div>

        <div className="field">
          <label htmlFor="codiceFiscale" className="block text-900 font-medium mb-2">
            Codice Fiscale
          </label>
          <InputText
            id="codiceFiscale"
            value={formData.codiceFiscale}
            onChange={(e) => handleChange('codiceFiscale', e.target.value.toUpperCase())}
            className="glassmorphism-input w-full"
            placeholder="Inserisci il codice fiscale (16 caratteri)"
            autoComplete="off"
            maxLength={16}
            style={{ textTransform: 'uppercase' }}
          />
          <small className="text-600 mt-1 block">Massimo 16 caratteri</small>
        </div>

        <div className="field">
          <label htmlFor="email" className="block text-900 font-medium mb-2">
            Email *
          </label>
          <InputText
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`glassmorphism-input w-full ${errors.email ? 'p-invalid' : ''}`}
            placeholder="Inserisci l'email"
            autoComplete="off"
          />
          {errors.email && (
            <small className="p-error mt-1 block">{errors.email}</small>
          )}
        </div>
        </div>

        {/* Sezione Luogo e Data di Nascita */}
        <div className="mb-5">
          <h5 className="mb-4 text-900 flex align-items-center gap-2">
            <i className="pi pi-calendar text-green-500"></i>
            Luogo e Data di Nascita
          </h5>
        
        <div className="grid">
          <div className="col-12 sm:col-6 lg:col-4">
            <div className="field">
              <label htmlFor="dateOfBirth" className="block text-900 font-medium mb-2">
                Data di Nascita *
              </label>
              <Calendar
                id="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={(e) => handleChange('dateOfBirth', e.value)}
                className={`w-full ${errors.dateOfBirth ? 'p-invalid' : ''}`}
                placeholder="Seleziona la data"
                showIcon
                dateFormat="dd/mm/yy"
                maxDate={new Date()}
              />
              {errors.dateOfBirth && (
                <small className="p-error mt-1 block">{errors.dateOfBirth}</small>
              )}
            </div>
          </div>
          
          <div className="col-12 sm:col-6 lg:col-4">
            <div className="field">
              <label htmlFor="birthCity" className="block text-900 font-medium mb-2">
                Città di Nascita *
              </label>
              <InputText
                id="birthCity"
                value={formData.birthCity}
                onChange={(e) => handleChange('birthCity', e.target.value)}
                className={`glassmorphism-input w-full ${errors.birthCity ? 'p-invalid' : ''}`}
                placeholder="Inserisci la città"
                autoComplete="off"
              />
              {errors.birthCity && (
                <small className="p-error mt-1 block">{errors.birthCity}</small>
              )}
            </div>
          </div>

          <div className="col-12 sm:col-6 lg:col-4">
            <div className="field">
              <label htmlFor="birthProvince" className="block text-900 font-medium mb-2">
                Provincia di Nascita *
              </label>
              <InputText
                id="birthProvince"
                value={formData.birthProvince}
                onChange={(e) => handleChange('birthProvince', e.target.value)}
                className={`glassmorphism-input w-full ${errors.birthProvince ? 'p-invalid' : ''}`}
                placeholder="Inserisci la provincia"
                autoComplete="off"
              />
              {errors.birthProvince && (
                <small className="p-error mt-1 block">{errors.birthProvince}</small>
              )}
            </div>
          </div>
        </div>
        </div>

        {/* Sezione Residenza */}
        <div className="mb-5">
          <h5 className="mb-4 text-900 flex align-items-center gap-2">
            <i className="pi pi-home text-orange-500"></i>
            Residenza
          </h5>
        
        <div className="grid">
          <div className="col-12">
            <div className="field">
              <label htmlFor="residenceStreet" className="block text-900 font-medium mb-2">
                Via/Indirizzo *
              </label>
              <InputText
                id="residenceStreet"
                value={formData.residenceStreet}
                onChange={(e) => handleChange('residenceStreet', e.target.value)}
                className={`glassmorphism-input w-full ${errors.residenceStreet ? 'p-invalid' : ''}`}
                placeholder="Inserisci via e numero civico"
                autoComplete="off"
              />
              {errors.residenceStreet && (
                <small className="p-error mt-1 block">{errors.residenceStreet}</small>
              )}
            </div>
          </div>

          <div className="col-12 sm:col-6">
            <div className="field">
              <label htmlFor="residenceCity" className="block text-900 font-medium mb-2">
                Città *
              </label>
              <InputText
                id="residenceCity"
                value={formData.residenceCity}
                onChange={(e) => handleChange('residenceCity', e.target.value)}
                className={`glassmorphism-input w-full ${errors.residenceCity ? 'p-invalid' : ''}`}
                placeholder="Inserisci la città"
                autoComplete="off"
              />
              {errors.residenceCity && (
                <small className="p-error mt-1 block">{errors.residenceCity}</small>
              )}
            </div>
          </div>

          <div className="col-12 sm:col-6">
            <div className="field">
              <label htmlFor="residenceProvince" className="block text-900 font-medium mb-2">
                Provincia *
              </label>
              <InputText
                id="residenceProvince"
                value={formData.residenceProvince}
                onChange={(e) => handleChange('residenceProvince', e.target.value)}
                className={`glassmorphism-input w-full ${errors.residenceProvince ? 'p-invalid' : ''}`}
                placeholder="Inserisci la provincia"
                autoComplete="off"
              />
              {errors.residenceProvince && (
                <small className="p-error mt-1 block">{errors.residenceProvince}</small>
              )}
            </div>
          </div>
        </div>
        </div>

        {/* Sezione Attestato (Opzionale) */}
        <div className="mb-5">
          <h5 className="mb-4 text-900 flex align-items-center gap-2">
            <i className="pi pi-file-pdf text-red-500"></i>
            Attestato (Opzionale)
          </h5>
        
        <div className="field">
          <label htmlFor="certificate" className="block text-900 font-medium mb-2">
            Certificato PDF
          </label>
          <FileUpload
            ref={fileUploadRef}
            mode="basic"
            name="certificate"
            accept=".pdf"
            maxFileSize={5000000}
            onSelect={handleFileUpload}
            onClear={handleFileRemove}
            chooseLabel="Seleziona PDF"
            cancelLabel="Rimuovi"
            className="w-full"
            customUpload={true}
            uploadHandler={handleFileUpload}
          />
          {/* Progress bar per upload */}
          {isUploadingCertificate && (
            <div className="mt-3">
              <ProgressBar 
                value={uploadProgress} 
                className="glassmorphism-progress"
                showValue={false}
              />
              <small className="text-center block mt-2 text-white">
                Caricamento certificato in corso... {uploadProgress}%
              </small>
            </div>
          )}

          {/* Informazioni certificato caricato */}
          {(certificateFile || certificateFileName) && !isUploadingCertificate && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex align-items-center gap-3">
                <i className="pi pi-file-pdf text-red-500 text-xl"></i>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-green-800">
                    {certificateFile ? certificateFile.name : certificateFileName}
                  </div>
                  {certificateFile && (
                    <div className="text-xs text-green-600">
                      {certificateService.formatFileSize(certificateFile.size)}
                    </div>
                  )}
                  <div className="text-xs text-blue-600 mt-1">
                    ✓ Certificato caricato sul server
                  </div>
                </div>
                <Button
                  type="button"
                  icon="pi pi-times"
                  size="small"
                  severity="secondary"
                  onClick={handleFileRemove}
                  className="p-button-rounded p-button-text"
                />
              </div>
            </div>
          )}
          {errors.certificate && (
            <small className="p-error mt-1 block">{errors.certificate}</small>
          )}
        </div>
        </div>

        {/* Pulsanti */}
        <div className="flex flex-column gap-2 mt-4">
          <div className="flex flex-column sm:flex-row gap-2">
            <Button
              type="button"
              label="Annulla"
              icon="pi pi-times"
              onClick={onCancel}
              severity="secondary"
              className="flex-1"
            />
            
            <Button
              type="submit"
              label={user ? 'Aggiorna' : 'Crea'}
              icon={user ? "pi pi-check" : "pi pi-plus"}
              loading={isSubmitting}
              className="flex-1"
            />
          </div>
          
          {/* Pulsante Esporta PDF - Solo per utenti esistenti */}
          {user && (
            <div className="flex justify-content-center mt-2">
              <Button
                type="button"
                label="Esporta PDF"
                icon="pi pi-download"
                onClick={handleExportPDF}
                severity="info"
                className="p-button-outlined"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'rgba(255, 255, 255, 0.9)'
                }}
              />
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default UserForm;