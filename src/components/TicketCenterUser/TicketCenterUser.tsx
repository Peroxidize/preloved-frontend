import { User, UserType } from '../user';
import DesktopNavUser from '../nav/DesktopNavUser';

import classes from './TicketCenterUser.module.css';
import TicketScreenSeller from './TicketScreenSeller';


export default function TicketCenter() {
  const user: User = JSON.parse(localStorage.getItem('userInfo')!);

  return(
    <>
      {user.type === UserType.Seller ? <TicketScreenSeller/> : <TicketScreenSeller/>}
    </>
  );
}