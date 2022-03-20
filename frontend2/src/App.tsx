import style from './App.module.scss';
import Navbar from './component/Navbar';
import Snackbar from './component/Snackbar';
import AppRoutes from './Routes';

const App = () => (
  <>
    <Navbar />
    <div className={style.body}>
      <AppRoutes />
    </div>
    <Snackbar />
  </>
);

export default App;
