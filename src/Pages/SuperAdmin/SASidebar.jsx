import React, { useEffect } from 'react';
import { createTheme } from '@mui/material/styles';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SettingsInputAntennaIcon from '@mui/icons-material/SettingsInputAntenna';
import TaskIcon from '@mui/icons-material/Task';
import InterpreterModeIcon from '@mui/icons-material/InterpreterMode';
import FreeCancellationIcon from '@mui/icons-material/FreeCancellation';    
import SpeedIcon from '@mui/icons-material/Speed';

// import './Sidebar2.css';

const NAVIGATION = [
  { kind: 'header', title: 'Super-Admin Dashboard' },
  {
    segment: '/sadmin',
    title: 'Dashboard',
    icon: <LibraryBooksIcon />,
  },
  {
    segment: '/sadmin/students',
    title: 'Student',
    icon: <SettingsInputAntennaIcon />,
  },
  {
    segment: '/sadmin/trainer',
    title: 'Trainer Approval',
    icon: <TaskIcon />,
  },
  {
    segment: '/sadmin/vendor',
    title: 'Vendor Approval',
    icon: <InterpreterModeIcon />,
  },
  {
    segment: '/sadmin/coursecounts',
    title: 'Courses Count',
    icon: <FreeCancellationIcon />,
  },
  {
    segment: '/sadmin/coursestudents',
    title: 'Courses Student',
    icon: <SpeedIcon />,
  },
  {
    segment: '/sadmin/courselist',
    title: 'Courses List',
    icon: <SpeedIcon />,
  },
  {
    segment: '/sadmin/admins',
    title: 'Admins',
    icon: <SpeedIcon />,
  },
];

const demoTheme = createTheme({
  colorSchemes: { light: true, dark: true },
  cssVariables: {
    colorSchemeSelector: 'class',
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

export default function GMTSideBar({ window }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const el = document.querySelector('.MuiTypography-h6');
    if (el && el.textContent.trim() === 'Toolpad') {
      el.textContent = 'Great Minds Technology';
    }
  }, []);

  const demoWindow = window ? window() : undefined;

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={{
        pathname: location.pathname,
        searchParams: new URLSearchParams(location.search),
        navigate: (path) => navigate(`/sadmin${path}`),
      }}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </AppProvider>
  );
}
