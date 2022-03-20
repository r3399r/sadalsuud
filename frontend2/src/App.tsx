import style from './App.module.scss';
import Navbar from './component/Navbar';
import AppRoutes from './Routes';

const App = () => (
  <>
    <Navbar />
    <div className={style.body}>
      <AppRoutes />
    </div>
  </>
);

export default App;
