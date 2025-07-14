import React, {
  createContext,
  useState,
  useCallback,
  ReactNode,
  ChangeEvent,
} from "react";
import { defaultFormState, ProductFormState } from "../types/Item";

type ModalContextType = {
  // Modal visibility
  showAddForm: boolean;
  showUpdateForm: boolean;
  showConfirmModal: boolean;
  openAddForm: () => void;
  closeAddForm: () => void;
  openUpdateForm: () => void;
  closeUpdateForm: () => void;
  openConfirmModal: (barcode: string) => void;
  closeConfirmModal: () => void;

  // Modal data
  productToDeleteBarcode: string | null;
  currentBarcode: string | null;
  setCurrentBarcode: (b: string | null) => void;

  // Form state
  formData: ProductFormState;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormState>>;
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  resetForm: () => void;

  // Message state
  error: string | null;
  message: string | null;
  setError: (val: string | null) => void;
  setMessage: (val: string | null) => void;
loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
};

export const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [productToDeleteBarcode, setProductToDeleteBarcode] = useState<string | null>(null);
  const [currentBarcode, setCurrentBarcode] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProductFormState>(defaultFormState);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFormData((prev) => ({ ...prev, productImage: file }));
  };

  const resetForm = useCallback(() => {
    setFormData(defaultFormState);
    setError(null);
    setMessage(null);
  }, []);

  return (
    <ModalContext.Provider
      value={{
        showAddForm,
        showUpdateForm,
        showConfirmModal,
        openAddForm: () => setShowAddForm(true),
        closeAddForm: () => setShowAddForm(false),
        openUpdateForm: () => setShowUpdateForm(true),
        closeUpdateForm: () => setShowUpdateForm(false),
        openConfirmModal: (barcode: string) => {
          setProductToDeleteBarcode(barcode);
          setShowConfirmModal(true);
        },
        closeConfirmModal: () => {
          setShowConfirmModal(false);
          setProductToDeleteBarcode(null);
        },
        productToDeleteBarcode,
        currentBarcode,
        setCurrentBarcode,
        formData,
        setFormData,
        handleInputChange,
        handleFileChange,
        resetForm,
        error,
        message,
        setError,
        setMessage,
        loading,
        setLoading
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};