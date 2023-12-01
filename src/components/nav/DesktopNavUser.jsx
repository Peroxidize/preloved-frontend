import classes from '../../assets/componentCSS/DesktopNav.module.css'

import logo from '../../assets/preloved-logo.jpg';
import searchIcon from '../../assets/icons/search_icon.svg'
import profileIcon from '../../assets/icons/accountCircle.svg'
import cartIcon from '../../assets/icons/shopping_cart.svg'
import ticketIcon from '../../assets/icons/ticket.svg'

export default function DesktopNavUser() {
    return (
        <div className={classes.navContainer}>
            <img src={logo} alt="" className={classes.logo}/>
            <div className={classes.searchbar}>
                <img src={searchIcon} alt="" className={classes.searchIcon} />
            </div>
            <img src={ticketIcon} alt="" className={classes.ticketIcon} />
            <img src={cartIcon} alt="" className={classes.cartIcon} />
            <img src={profileIcon} alt="" className={classes.profileIcon}/>
        </div>
    );
}