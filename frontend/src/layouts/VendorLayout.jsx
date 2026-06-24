import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import Sidebar from '@/components/vendor/sidebar';
import Topbar from '@/components/vendor/topbar';

import { T } from '@/utils/vendorTheme';

const VendorLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        background: T.surface,
        overflow: 'hidden',
      }}
    >
      <Sidebar drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />

      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
          minWidth: 0,
        }}
      >
        <Topbar onMenuClick={() => setDrawerOpen(true)} />

        <Outlet />
      </main>
    </div>
  );
};

export default VendorLayout;
