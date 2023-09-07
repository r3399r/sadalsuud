import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import LoginForm from './component/LoginForm';
import TripList from './component/TripList';

const Admin = () => {
  const { isLogin } = useSelector((state: RootState) => state.auth);

  if (isLogin) return <TripList />;

  return <LoginForm />;
};

export default Admin;
