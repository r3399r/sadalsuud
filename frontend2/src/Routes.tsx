import { Navigate, Route, Routes } from 'react-router-dom';
import { Page } from './constant/Page';
import Admin from './page/admin/Admin';
import Faq from './page/faq/Faq';
import Landing from './page/landing/Landing';
import TripDetail from './page/tripDetail/TripDetail';
import TripDiscuss from './page/tripDiscuss/TripDiscuss';
import Trips from './page/trips/Trips';

const AppRoutes = () => (
  <Routes>
    <Route path={Page.LANDING} element={<Landing />} />
    <Route path={Page.TRIPS} element={<Trips />} />
    <Route path={`${Page.TRIPS}/:id`} element={<TripDetail />} />
    <Route path={`${Page.TRIPS}/:id/discuss`} element={<TripDiscuss />} />
    <Route path={Page.FAQ} element={<Faq />} />
    <Route path={Page.ADMIN} element={<Admin />} />
    <Route path="/*" element={<Navigate to={Page.LANDING} />} />
  </Routes>
);

export default AppRoutes;
