import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface MaintenanceGuardProps {
  children: React.ReactNode;
}

const MaintenanceGuard: React.FC<MaintenanceGuardProps> = ({ children }) => {
  const location = useLocation();
  const isMaintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === 'true';

  // Routes that should remain accessible during maintenance
  const whitelistedRoutes = [
    '/admin',
    '/dashboard',
    '/maintenance', // Allow access to maintenance page itself
  ];

  // Check if current path starts with any whitelisted route
  const isWhitelisted = whitelistedRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  // If maintenance mode is enabled and route is not whitelisted, redirect to maintenance page
  if (isMaintenanceMode && !isWhitelisted) {
    return <Navigate to="/maintenance" replace />;
  }

  // Otherwise, render the children (the actual route component)
  return <>{children}</>;
};

export default MaintenanceGuard;
