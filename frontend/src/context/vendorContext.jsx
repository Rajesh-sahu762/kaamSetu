import { createContext, useContext, useState } from 'react';

const VendorContext = createContext();

export const VendorProvider = ({ children }) => {
  const [vendorData, setVendorData] = useState(() => {
  const stored = localStorage.getItem("vendorData");
  return stored ? JSON.parse(stored) : null;
});

  const updateVendorData = (newData) => {
  setVendorData((prev) => {
    const merged = { ...(prev || {}), ...newData };
    localStorage.setItem("vendorData", JSON.stringify(merged));
    return merged;
  });
};

const clearVendorData = () => {
  setVendorData(null);
  localStorage.removeItem("vendorData");
};

  // Actual File objects for the KYC documents picked during vendor
  // registration. Kept separate from vendorData/localStorage because
  // File objects cannot be JSON-serialized.
  const [vendorFiles, setVendorFiles] = useState({});

  const updateVendorFiles = (newFiles) => {
    setVendorFiles((prev) => ({ ...prev, ...newFiles }));
  };

  const clearVendorFiles = () => setVendorFiles({});

  return (
    <VendorContext.Provider
      value={{
        vendorData,
        updateVendorData,
        clearVendorData,
        vendorFiles,
        updateVendorFiles,
        clearVendorFiles,
      }}
    >
      {children}
    </VendorContext.Provider>
  );
};

export const useVendor = () => useContext(VendorContext);