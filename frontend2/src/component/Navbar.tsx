import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import EventIcon from '@mui/icons-material/Event';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import { Drawer } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page } from 'src/constant/Page';
import packageJson from '../../package.json'; // eslint-disable-line
import style from './Navbar.module.scss';

const Navbar = () => {
  const [open, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const onClick = (page: Page) => () => {
    navigate(page);
    toggleDrawer();
  };
  const toggleDrawer = () => setOpen(!open);

  return (
    <div className={style.self}>
      <div className={style.drawerBtn} onClick={toggleDrawer}>
        <MenuIcon />
      </div>
      <div className={style.title}>
        <img className={style.logo} src="/logo400.png" />
        星遊
      </div>
      <Drawer anchor="left" open={open} onClose={toggleDrawer}>
        <div className={style.drawer}>
          <div className={style.list}>
            <div onClick={onClick(Page.LANDING)}>
              <HomeIcon />
              首頁
            </div>
            <div onClick={onClick(Page.TRIPS)}>
              <EventIcon />
              出遊清單
            </div>
            <div onClick={onClick(Page.FAQ)}>
              <ContactSupportIcon />
              常見問題
            </div>
          </div>
          <div className={style.ver} onDoubleClick={onClick(Page.ADMIN)}>
            當前版本: {packageJson.version}
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default Navbar;
