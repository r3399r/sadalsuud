import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import EventIcon from '@mui/icons-material/Event';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import { Drawer } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page } from 'src/constant/Page';
import packageJson from '../../package.json'; // eslint-disable-line

const Navbar = () => {
  const [open, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const onClick = (page: Page) => () => {
    navigate(page);
    toggleDrawer();
  };
  const toggleDrawer = () => setOpen(!open);

  return (
    <div className="flex h-11 items-center justify-between bg-paleyellow px-[10px]">
      <div className="flex cursor-pointer items-center" onClick={toggleDrawer}>
        <MenuIcon />
      </div>
      <div className="flex h-full flex-1 items-center justify-center gap-[6px] text-2xl font-bold">
        <img className="h-[90%]" src="/logo400.png" />
        星遊
      </div>
      <Drawer anchor="left" open={open} onClose={toggleDrawer}>
        <div className="h-screen w-[250px]">
          <div className="flex flex-col gap-5 px-5 pb-5 pt-10 text-2xl">
            <div className="flex items-center gap-[10px] outline-none">
              <HomeIcon />
              <div className="cursor-pointer" onClick={onClick(Page.Landing)}>
                首頁
              </div>
            </div>
            <div className="flex items-center gap-[10px] outline-none">
              <EventIcon />
              <div className="cursor-pointer" onClick={onClick(Page.Trips)}>
                出遊清單
              </div>
            </div>
            <div className="flex items-center gap-[10px] outline-none">
              <ContactSupportIcon />
              <a
                className="text-[inherit] no-underline"
                href="https://www.celestialstudio.net/2023/01/lucky-star-faq.html"
                target="_blank"
                rel="noreferrer"
              >
                常見問題
              </a>
            </div>
          </div>
          <div className="pl-5" onDoubleClick={onClick(Page.Admin)}>
            當前版本: {packageJson.version}
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default Navbar;
