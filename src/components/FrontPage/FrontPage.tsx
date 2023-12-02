import css from './frontpage.module.css';

import logo from '../../assets/preloved-logo.jpg';
import shopping_cart from '../../assets/icons/shopping_cart.svg';
import search_icon from '../../assets/icons/search_icon.svg';
import beigeJacket from '../../assets/clothes/beige-jacket.jpg';
import blueBoxer from '../../assets/clothes/blue-boxer-shorts.jpg';
import checkeredSweater from '../../assets/clothes/checkered-sweater.jpg';
import greySlacks from '../../assets/clothes/grey-slacks.jpg';
import khakiJacket from '../../assets/clothes/khaki-jacket.jpg';
import greenSweater from '../../assets/clothes/green-sweater.jpg';
import magentaShirt from '../../assets/clothes/magenta-shirt.png';
import creamJacket from '../../assets/clothes/cream-jacket.png';
import creamSlacks from '../../assets/clothes/cream-slacks.png';

const repeatArray = (array: string[], n: number) => Array.from({ length: n }, () => array).flat();
const getImageName = (image: any) => {
  const path = image.split('/');
  const name = path[path.length - 1].split('.');
  return name[0];
};

export default function() {
  const clothingItems = [
    beigeJacket,
    checkeredSweater,
    greySlacks,
    khakiJacket,
    greenSweater,
    magentaShirt,
  ];

  const repeatedClothingItems = repeatArray(clothingItems, 10);

  return (
    <div className={css.wrapper}>
      <div className={css.nav_bar}>
        <img src={logo} className={css.logo} alt="Preloved Logo" />
        <div className={css.search_bar}>
          <img src={search_icon} alt="Search Icon" />
          <input type="text" placeholder="Search" />
        </div>
        <img src={shopping_cart} className={css.shopping_cart} alt="Shopping Cart" />
        <button>
          <p>Sign Up</p>
        </button>
        <button>
          <p>Login</p>
        </button>
      </div>

      <div className={css.display_clothing}>
        {repeatedClothingItems.map((item, index) => (
          <img key={index} src={item} alt={`${getImageName(item)}`} />
        ))}
      </div>
    </div>
  );
}