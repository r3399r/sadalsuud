import { Tab, Tabs } from '@mui/material';
import { SyntheticEvent, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import LoginForm from './component/LoginForm';

const Admin = () => {
  const { isLogin } = useSelector((state: RootState) => state.auth);
  const [value, setValue] = useState<number>(0);

  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  if (isLogin)
    return (
      <>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          <Tab label="出遊" />
          <Tab label="使用者" />
          <Tab label="星兒" />
        </Tabs>
        {value === 0 && <div>Item one</div>}
        {value === 1 && <div>Item two</div>}
        {value === 2 && <div>Item three</div>}
      </>
    );

  return <LoginForm />;
};

export default Admin;
