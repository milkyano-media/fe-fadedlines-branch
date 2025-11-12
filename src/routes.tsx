import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/web/Home';
import Barbers from '@/pages/web/Barbers';
import Gallery from '@/pages/web/Gallery';
import AboutUs from '@/pages/web/AboutUs';
import Careers from '@/pages/web/Careers';
import Contacts from '@/pages/web/Contacts';
import PrivacyPolicy from '@/pages/web/PrivacyPolicy';
import NotFound from '@/pages/web/NotFound';
import Maintenance from '@/pages/web/Maintenance';
import MaintenanceGuard from '@/components/MaintenanceGuard';

import AnthonyLanding from '@/pages/landing/AnthonyLanding';
import EjLanding from '@/pages/landing/EjLanding';
import RafaelLanding from '@/pages/landing/RafaelLanding';
import BookList from './components/book/BookList';
import BookAppointment from './components/book/BookAppointment';
import BookContactInfo from './components/book/BookContactInfo';
import ThankYou from './components/book/ThankYou';
import PageTracker from './components/analytics/PageTracker';

const webRoutes = [
  { path: '', component: Home },
  { path: 'home', component: Home },
  { path: 'barbers', component: Barbers },
  { path: 'gallery', component: Gallery },
  { path: 'about-us', component: AboutUs },
  { path: 'careers', component: Careers },
  { path: 'contact', component: Contacts },
  { path: 'privacy-policy', component: PrivacyPolicy },
  { path: 'maintenance', component: Maintenance },
  { path: 'book/services', component: BookList },
  { path: 'book/appointment', component: BookAppointment },
  { path: 'book/contact-info', component: BookContactInfo },
  { path: 'book/thank-you', component: ThankYou }
];

const metaWebRoutes = [
  { path: 'meta', component: Home },
  { path: 'meta/home', component: Home },
  { path: 'meta/barbers', component: Barbers },
  { path: 'meta/gallery', component: Gallery },
  { path: 'meta/about-us', component: AboutUs },
  { path: 'meta/careers', component: Careers },
  { path: 'meta/contact', component: Contacts },
  { path: 'meta/privacy-policy', component: PrivacyPolicy },
  { path: 'meta/maintenance', component: Maintenance },
  { path: 'meta/meta/book/services', component: BookList },
  { path: 'meta/book/appointment', component: BookAppointment },
  { path: 'meta/book/contact-info', component: BookContactInfo },
  { path: 'meta/book/thank-you', component: ThankYou }
];

const landingRoutes = [
  { path: 'anthony', component: AnthonyLanding },
  { path: 'ej', component: EjLanding },
  { path: 'rafael', component: RafaelLanding }
];

const bookRoutes = [
  { path: 'anthony/book/services', component: BookList },
  { path: 'ej/book/services', component: BookList },
  { path: 'rafael/book/services', component: BookList }
];

const appointmentRoutes = [
  { path: 'anthony/book/appointment', component: BookAppointment },
  { path: 'ej/book/appointment', component: BookAppointment },
  { path: 'rafael/book/appointment', component: BookAppointment },
  { path: 'emman/book/appointment', component: BookAppointment }
  // { path: "mustafa/book/appointment", component: BookAppointment },
];

const contactInfoRoutes = [
  { path: 'anthony/book/contact-info', component: BookContactInfo },
  { path: 'ej/book/contact-info', component: BookContactInfo },
  { path: 'rafael/book/contact-info', component: BookContactInfo }
];

const ThankYouRoutes = [
  { path: 'anthony/book/thank-you', component: ThankYou },
  { path: 'ej/book/thank-you', component: ThankYou },
  { path: 'rafael/book/thank-you', component: ThankYou }
];

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <PageTracker />
      <Routes>
        {/* LANDING ROUTES */}
        {landingRoutes.map(({ path, component: Component }) => (
          <React.Fragment key={path}>
            <Route path={`/${path}`} element={<MaintenanceGuard><Component /></MaintenanceGuard>} />
            <Route path={`/meta/${path}`} element={<MaintenanceGuard><Component /></MaintenanceGuard>} />
          </React.Fragment>
        ))}

        {/* BOOKING ROUTES */}
        {bookRoutes.map(({ path, component: Component }) => (
          <React.Fragment key={path}>
            <Route path={`/${path}`} element={<MaintenanceGuard><Component /></MaintenanceGuard>} />
            <Route path={`/meta/${path}`} element={<MaintenanceGuard><Component /></MaintenanceGuard>} />
          </React.Fragment>
        ))}

        {/* APPOINTMENT ROUTES */}
        {appointmentRoutes.map(({ path, component: Component }) => (
          <React.Fragment key={path}>
            <Route path={`/${path}`} element={<MaintenanceGuard><Component /></MaintenanceGuard>} />
            <Route path={`/meta/${path}`} element={<MaintenanceGuard><Component /></MaintenanceGuard>} />
          </React.Fragment>
        ))}

        {/* CONTACT INFO ROUTES */}
        {contactInfoRoutes.map(({ path, component: Component }) => (
          <React.Fragment key={path}>
            <Route path={`/${path}`} element={<MaintenanceGuard><Component /></MaintenanceGuard>} />
            <Route path={`/meta/${path}`} element={<MaintenanceGuard><Component /></MaintenanceGuard>} />
          </React.Fragment>
        ))}

        {/* CONTACT INFO ROUTES */}
        {contactInfoRoutes.map(({ path, component: Component }) => (
          <React.Fragment key={path}>
            <Route path={`/${path}`} element={<MaintenanceGuard><Component /></MaintenanceGuard>} />
            <Route path={`/meta/${path}`} element={<MaintenanceGuard><Component /></MaintenanceGuard>} />
          </React.Fragment>
        ))}

        {/* THANK YOU ROUTES */}
        {ThankYouRoutes.map(({ path, component: Component }) => (
          <React.Fragment key={path}>
            <Route path={`/${path}`} element={<MaintenanceGuard><Component /></MaintenanceGuard>} />
            <Route path={`/meta/${path}`} element={<MaintenanceGuard><Component /></MaintenanceGuard>} />
          </React.Fragment>
        ))}

        {/* WEB ROUTE */}
        {webRoutes.map(({ path, component: Component }) => (
          <React.Fragment key={path}>
            <Route path={`/${path}`} element={<MaintenanceGuard><Component /></MaintenanceGuard>} />
            <Route path={`/meta/${path}`} element={<MaintenanceGuard><Component /></MaintenanceGuard>} />
          </React.Fragment>
        ))}

        {/* META WEB ROUTE */}
        {metaWebRoutes.map(({ path, component: Component }) => (
          <React.Fragment key={path}>
            <Route path={`/${path}`} element={<MaintenanceGuard><Component /></MaintenanceGuard>} />
            <Route path={`/meta/${path}`} element={<MaintenanceGuard><Component /></MaintenanceGuard>} />
          </React.Fragment>
        ))}

        {/* NOT FOUND ROUTE */}
        <Route path='*' element={<MaintenanceGuard><NotFound /></MaintenanceGuard>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
