import { createContext, useContext, useState } from 'react';

const VendorContext = createContext();

export const VendorProvider = ({ children }) => {
  const [vendorData, setVendorData] = useState({});

  const updateVendorData = (newData) => {
    setVendorData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  const clearVendorData = () => {
    setVendorData({});
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
