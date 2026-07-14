import { createContext, useContext, useState } from 'react';

const VendorContext = createContext();

export const VendorProvider = ({ children }) => {
  const [vendorData, setVendorData] = useState(() => {
  const stored = localStorage.getItem("vendorData");
  return stored ? JSON.parse(stored) : null;
});

  const updateVendorData = (newData) => {
  setVendorData(newData);
  localStorage.setItem("vendorData", JSON.stringify(newData));
};

const clearVendorData = () => {
  setVendorData(null);
  localStorage.removeItem("vendorData");
};
  return (
    <VendorContext.Provider
      value={{
        vendorData,
        updateVendorData,
        clearVendorData,
      }}
    >
      {children}
    </VendorContext.Provider>
  );
};

export const useVendor = () => useContext(VendorContext);
