import DesktopNavUser from "../components/nav/DesktopNavUser";

import classes from './TicketCenterUser.module.css';

export default function TicketCenterUser() {
    return(
        <>
            <DesktopNavUser/>
            <h1 className={classes.heading}>Ticket Center</h1>
        </>
    );
}