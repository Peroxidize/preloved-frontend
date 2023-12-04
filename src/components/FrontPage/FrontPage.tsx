import css from './frontpage.module.css';

import NavBar from '../fragments/nav-bar/nav-bar';

import beigeJacket from '../../assets/clothes/beige-jacket.jpg';
import checkeredSweater from '../../assets/clothes/checkered-sweater.jpg';
import greySlacks from '../../assets/clothes/grey-slacks.jpg';
import khakiJacket from '../../assets/clothes/khaki-jacket.jpg';
import greenSweater from '../../assets/clothes/green-sweater.jpg';
import magentaShirt from '../../assets/clothes/magenta-shirt.png';

const repeatArray = (array: string[], n: number) => Array.from({ length: n }, () => array).flat();
const getImageName = (image: string) => {
  const path = image.split('/');
  const name = path[path.length - 1].split('.');
  return name[0];
};

export default function() {
  let currentUser;

  const clothingItems = [
    beigeJacket,
    checkeredSweater,
    greySlacks,
    khakiJacket,
    greenSweater,
    magentaShirt,
  ];

  const repeatedClothingItems = repeatArray(clothingItems, 10);

  if (localStorage.getItem('userInfo') !== null) {
    currentUser = JSON.parse(localStorage.getItem('userInfo')!);
  }

  return (
    <div className={css.wrapper}>
      <NavBar user={currentUser} />
      <div className={css.display_clothing}>
        {repeatedClothingItems.map((item, index) => (
          <img key={index} src={item} alt={`${getImageName(item)}`} />
        ))}
      </div>
    </div>
  );
}