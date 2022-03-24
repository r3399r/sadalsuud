import { useEffect } from 'react';
import style from './App.module.scss';
import Navbar from './component/Navbar';
import Snackbar from './component/Snackbar';
import AppRoutes from './Routes';
import { checkLoginStatus } from './service/AuthService';

const App = () => {
  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <>
      <Navbar />
      <div className={style.body}>
        <AppRoutes />
      </div>
      <Snackbar />
    </>
  );
};

export default App;
