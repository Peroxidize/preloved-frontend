import { User, UserType } from '../misc';

import TicketScreenSeller from './TicketScreenSeller';


export default function TicketCenter() {
  const user: User = JSON.parse(localStorage.getItem('userInfo')!);

  return(
    <>
      {user.type === UserType.Seller ? <TicketScreenSeller/> : <TicketScreenSeller/>}
    </>
  );
}