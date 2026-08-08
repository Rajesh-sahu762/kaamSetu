import { useContext, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { FaClock, FaTimesCircle } from 'react-icons/fa';

import Sidebar from '@/components/vendor/sidebar';
import Topbar from '@/components/vendor/topbar';
import { useEffect } from "react";
import { useVendor } from "@/context/vendorContext";
import { getVendorProfile } from "@/services/vendorService";
import { AuthContext } from '@/context/authContext';

import { T } from '@/utils/vendorTheme';



const VendorLayout = () => {

  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = window.innerWidth <= 768;

  const { vendorData, updateVendorData } = useVendor();
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {

  const fetchVendorData = async () => {

    try {

      const response = await getVendorProfile();

      updateVendorData(response.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  fetchVendorData();

}, []);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const vendorStatus = vendorData?.vendor?.status;

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: T.ivory, fontFamily: 'Inter,sans-serif', color: T.slateGray }}>
        Loading...
      </div>
    );
  }

  if (vendorStatus && vendorStatus !== 'approved') {
    const isRejected = vendorStatus === 'rejected';
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: T.ivory, padding: 24, fontFamily: 'Inter,sans-serif' }}>
        <div style={{ maxWidth: 480, width: '100%', background: T.white, border: `1px solid ${T.border}`, borderRadius: 12, padding: '40px 32px', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: isRejected ? T.redDim : T.amberDim, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            {isRejected
              ? <FaTimesCircle size={26} color={T.red} />
              : <FaClock size={26} color={T.amber} />}
          </div>
          <h2 style={{ fontFamily: 'Geist,sans-serif', fontSize: 22, fontWeight: 600, color: T.slate, marginBottom: 10 }}>
            {isRejected ? 'Application Rejected' : 'Application Under Review'}
          </h2>
          <p style={{ fontSize: 14, color: T.slateGray, lineHeight: 1.6, marginBottom: isRejected && vendorData?.vendor?.rejectionReason ? 16 : 24 }}>
            {isRejected
              ? "Your vendor application wasn't approved, so the dashboard isn't available yet."
              : "Your documents are still being verified by our team. This usually takes 24-48 hours — the dashboard will unlock automatically once you're approved."}
          </p>
          {isRejected && vendorData?.vendor?.rejectionReason && (
            <p style={{ fontSize: 13, color: T.red, background: T.redDim, borderRadius: 6, padding: '10px 14px', marginBottom: 24, textAlign: 'left' }}>
              Reason: {vendorData.vendor.rejectionReason}
            </p>
          )}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            {isRejected && (
              <button
                onClick={() => navigate('/support')}
                style={{ background: T.bronze, color: T.white, border: 'none', borderRadius: 6, padding: '10px 20px', fontFamily: 'Geist,sans-serif', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                Contact Support
              </button>
            )}
            <button
              onClick={handleLogout}
              style={{ background: 'transparent', color: T.slateMid, border: `1px solid ${T.border}`, borderRadius: 6, padding: '10px 20px', fontFamily: 'Geist,sans-serif', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    );
  }

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