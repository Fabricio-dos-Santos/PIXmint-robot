import React, { useEffect, useState } from 'react';
import styles from '../styles/modal.module.css';
import { 
  formatPixKeyInput, 
  formatWalletInput, 
  getRawPixKey, 
  getRawWallet,
  detectPixKeyType 
} from '../lib/inputMasks';
import {
  validateName,
  validatePixKey,
  validateWallet,
  validateNetwork,
  type ValidationResult
} from '../lib/fieldValidation';

type Network = 'sepolia' | 'ethereum' | 'polygon' | 'arbitrum' | 'bnb' | 'base';

interface EmployeeFormData {
  name: string;
  pixKey: string;
  wallet: string;
  network: Network;
}

export interface Employee {
  id: string;
  name: string;
  pixKey: string;
  wallet: string;
  network: Network;
  createdAt?: string;
}

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EmployeeFormData) => Promise<void>;
  isLoading?: boolean;
  errors?: string[];
  employeeToEdit?: Employee | null;
}

const NETWORKS: { value: Network; label: string }[] = [
  { value: 'sepolia', label: 'Sepolia (Testnet)' },
  { value: 'ethereum', label: 'Ethereum' },
  { value: 'polygon', label: 'Polygon' },
  { value: 'arbitrum', label: 'Arbitrum' },
  { value: 'bnb', label: 'BNB Chain' },
  { value: 'base', label: 'Base' },
];

export default function EmployeeModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading = false,
  errors = [],
  employeeToEdit = null
}: EmployeeModalProps) {
  const isEditMode = !!employeeToEdit;
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: '',
    pixKey: '',
    wallet: '',
    network: 'sepolia',
  });

  // Display values (formatted)
  const [displayPixKey, setDisplayPixKey] = useState('');
  const [displayWallet, setDisplayWallet] = useState('');

  // Field-level validation errors
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    pixKey?: string;
    wallet?: string;
    network?: string;
  }>({});

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Reset or populate form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (employeeToEdit) {
        // Edit mode: populate with existing data
        setFormData({
          name: employeeToEdit.name,
          pixKey: employeeToEdit.pixKey,
          wallet: employeeToEdit.wallet,
          network: employeeToEdit.network,
        });
        setDisplayPixKey(formatPixKeyInput(employeeToEdit.pixKey));
        setDisplayWallet(formatWalletInput(employeeToEdit.wallet));
      } else {
        // Create mode: reset form
        setFormData({
          name: '',
          pixKey: '',
          wallet: '',
          network: 'sepolia',
        });
        setDisplayPixKey('');
        setDisplayWallet('');
      }
      setFieldErrors({});
      setValidationErrors([]);
    }
  }, [isOpen, employeeToEdit]);

  // Focus first input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const firstInput = document.querySelector<HTMLInputElement>('#employee-name');
        firstInput?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'pixKey') {
      const formatted = formatPixKeyInput(value);
      setDisplayPixKey(formatted);
      const raw = getRawPixKey(formatted);
      setFormData(prev => ({ ...prev, pixKey: raw }));
    } else if (name === 'wallet') {
      const formatted = formatWalletInput(value);
      setDisplayWallet(formatted);
      const raw = getRawWallet(formatted);
      setFormData(prev => ({ ...prev, wallet: raw }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear field error when user types in that field
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    // Clear validation errors when user types
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    
    let result: ValidationResult = { isValid: true };
    
    switch (name) {
      case 'name':
        result = validateName(formData.name);
        break;
      case 'pixKey':
        result = validatePixKey(formData.pixKey);
        break;
      case 'wallet':
        result = validateWallet(formData.wallet);
        break;
      case 'network':
        result = validateNetwork(formData.network);
        break;
    }
    
    if (!result.isValid && result.error) {
      setFieldErrors(prev => ({ ...prev, [name]: result.error }));
    } else {
      setFieldErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    const nameValidation = validateName(formData.name);
    if (!nameValidation.isValid) {
      errors.push(nameValidation.error!);
    }

    const pixKeyValidation = validatePixKey(formData.pixKey);
    if (!pixKeyValidation.isValid) {
      errors.push(pixKeyValidation.error!);
    }

    const walletValidation = validateWallet(formData.wallet);
    if (!walletValidation.isValid) {
      errors.push(walletValidation.error!);
    }

    const networkValidation = validateNetwork(formData.network);
    if (!networkValidation.isValid) {
      errors.push(networkValidation.error!);
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const getPixKeyPlaceholder = (): string => {
    if (!displayPixKey) return 'Email, CPF, telefone ou chave aleatória';
    
    const type = detectPixKeyType(displayPixKey);
    switch (type) {
      case 'cpf': return '000.000.000-00';
      case 'phone': return '(00) 00000-0000';
      case 'email': return 'exemplo@email.com';
      default: return 'Chave aleatória';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      // Errors will be passed via props
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !isLoading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const allErrors = [...validationErrors, ...errors];
  const isFormValid = validateName(formData.name).isValid && 
                     validatePixKey(formData.pixKey).isValid && 
                     validateWallet(formData.wallet).isValid &&
                     validateNetwork(formData.network).isValid;

  return (
    <div 
      className={styles.overlay} 
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 id="modal-title" className={styles.title}>
            {isEditMode ? 'Editar Colaborador' : 'Novo Colaborador'}
          </h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            disabled={isLoading}
            aria-label="Fechar modal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.body}>
            <div className={styles.formGroup}>
              <label htmlFor="employee-name" className={styles.label}>
                Nome <span className={styles.required}>*</span>
              </label>
              <input
                id="employee-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${styles.input} ${fieldErrors.name ? styles.inputError : ''}`}
                placeholder="Ex: João Silva"
                disabled={isLoading}
                autoComplete="off"
              />
              {fieldErrors.name && (
                <span className={styles.fieldError}>{fieldErrors.name}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="employee-pixkey" className={styles.label}>
                Chave PIX <span className={styles.required}>*</span>
              </label>
              <input
                id="employee-pixkey"
                type="text"
                name="pixKey"
                value={displayPixKey}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${styles.input} ${fieldErrors.pixKey ? styles.inputError : ''}`}
                placeholder={getPixKeyPlaceholder()}
                disabled={isLoading}
                autoComplete="off"
              />
              {fieldErrors.pixKey ? (
                <span className={styles.fieldError}>{fieldErrors.pixKey}</span>
              ) : (
                <span className={styles.hint}>
                  Pode ser email, CPF (000.000.000-00), telefone (00) 00000-0000 ou chave aleatória
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="employee-wallet" className={styles.label}>
                Wallet EVM <span className={styles.required}>*</span>
              </label>
              <input
                id="employee-wallet"
                type="text"
                name="wallet"
                value={displayWallet}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${styles.input} ${fieldErrors.wallet ? styles.inputError : ''}`}
                placeholder="0x1234567890abcdef1234567890abcdef12345678"
                disabled={isLoading}
                autoComplete="off"
              />
              {fieldErrors.wallet ? (
                <span className={styles.fieldError}>{fieldErrors.wallet}</span>
              ) : (
                <span className={styles.hint}>
                  Endereço Ethereum válido (0x + 40 caracteres hexadecimais)
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="employee-network" className={styles.label}>
                Network <span className={styles.required}>*</span>
              </label>
              <select
                id="employee-network"
                name="network"
                value={formData.network}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${styles.select} ${fieldErrors.network ? styles.inputError : ''}`}
                disabled={isLoading}
              >
                {NETWORKS.map(net => (
                  <option key={net.value} value={net.value}>
                    {net.label}
                  </option>
                ))}
              </select>
              {fieldErrors.network && (
                <span className={styles.fieldError}>{fieldErrors.network}</span>
              )}
            </div>

            {allErrors.length > 0 && (
              <div className={styles.errorList}>
                <ul style={{ margin: 0, padding: 0 }}>
                  {allErrors.map((error, idx) => (
                    <li key={idx} className={styles.errorItem}>
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className={styles.footer}>
            <button
              type="button"
              className={`${styles.button} ${styles.cancelButton}`}
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`${styles.button} ${styles.submitButton} ${isLoading ? styles.loading : ''}`}
              disabled={!isFormValid || isLoading}
            >
              {isLoading 
                ? (isEditMode ? 'Salvando...' : 'Criando...') 
                : (isEditMode ? 'Salvar Alterações' : 'Criar')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
