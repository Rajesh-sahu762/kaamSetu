import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import Sidebar from '@/components/vendor/Sidebar';
import Topbar from '@/components/vendor/Topbar';
import { useEffect } from "react";
import { useVendor } from "@/context/VendorContext";
import { getVendorProfile } from "@/services/vendorService";

import { T } from '@/utils/vendorTheme';



const VendorLayout = () => {

  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = window.innerWidth <= 768;

  const { vendorData, updateVendorData } = useVendor();
  useEffect(() => {

  const fetchVendorData = async () => {

    try {

      const response = await getVendorProfile();

      updateVendorData(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  fetchVendorData();

}, []);


  return (

    <>
     <style>{`
     
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Inter:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 2px; }
        .ks-nav-item:hover { background: rgba(168,138,100,0.09) !important; }
        .ks-row:hover { background: ${T.surfaceLow} !important; }
        .ks-abtn { transition: opacity 0.15s, transform 0.15s; cursor: pointer; }
        .ks-abtn:hover { opacity: 0.88; transform: translateY(-1px); }
        .ks-iconbtn { border-radius: 6px; cursor: pointer; transition: background 0.15s; }
        .ks-iconbtn:hover { background: ${T.border} !important; }
        .ks-bottom-nav-item { display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 6px 0; flex: 1; cursor: pointer; transition: color 0.15s; }
        @keyframes ks-slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        @keyframes ks-fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

    <div
  style={{
    display: "flex",
    height: "100vh",
    overflow: "hidden",
    background: T.ivory,
  }}
>
      <Sidebar drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />

      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
          background: T.ivory,
          minWidth: 0,
        }}
        >
        <Topbar onMenuClick={() => setDrawerOpen(true)} />

     <div
  style={{
    flex: 1,
    paddingBottom: isMobile ? "10px" : "0px",
  }}
>
  <Outlet />
</div>

      </main>
    </div>
        </>
  );
};

export default VendorLayout;
