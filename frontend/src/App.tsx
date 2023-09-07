import { useEffect } from 'react';
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
      <div className="box-border h-[calc(100vh-44px)] overflow-y-auto p-[10px] sm:p-[15px]">
        <AppRoutes />
      </div>
      <Snackbar />
    </>
  );
};

export default App;
