import { Navigate, Route, Routes } from 'react-router-dom';
import { Page } from './constant/Page';
import Admin from './page/admin';
import Landing from './page/landing';
import TripDetail from './page/tripDetail';
import TripDiscuss from './page/tripDiscuss';
import Trips from './page/trips';

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
