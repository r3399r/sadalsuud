import { Navigate, Route, Routes } from 'react-router-dom';
import { Page } from './constant/Page';
import Admin from './page/admin/Admin';
import Landing from './page/landing/Landing';
import TripDetail from './page/tripDetail/TripDetail';
import TripDiscuss from './page/tripDiscuss/TripDiscuss';
import Trips from './page/trips/Trips';

const AppRoutes = () => (
  <Routes>
    <Route path={Page.Landing} element={<Landing />} />
    <Route path={Page.Trips} element={<Trips />} />
    <Route path={`${Page.Trips}/:id`} element={<TripDetail />} />
    <Route path={`${Page.Trips}/:id/discuss`} element={<TripDiscuss />} />
    <Route path={Page.Admin} element={<Admin />} />
    <Route path="/*" element={<Navigate to={Page.Landing} />} />
  </Routes>
);

export default AppRoutes;
