import { Navigate, Route, Routes } from 'react-router-dom';
import { Page } from './constant/Page';
import Landing from './page/landing/Landing';

const AppRoutes = () => (
  <Routes>
    <Route path={Page.LANDING} element={<Landing />} />
    <Route path="/*" element={<Navigate to={Page.LANDING} />} />
  </Routes>
);

export default AppRoutes;
