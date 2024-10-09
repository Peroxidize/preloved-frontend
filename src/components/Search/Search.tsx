import { useMediaQuery } from "react-responsive";
import NavBar, { MobileNavTop, MobileNavBottom } from "../fragments/nav-bar/nav-bar";
import css from "./Search.module.css";
import utilcss from "../../utils/utils.module.css";
import loadingcss from "../../assets/componentCSS/commonStuff/Loading.module.css";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import { LINK_GET_ITEM_IMAGES, LINK_SEARCH } from "../misc";
import loading from "../../assets/loading.gif";
import { LoadingImg } from "../fragments/commonstuff/Loading";
import BackAndTitle from "../fragments/commonstuff/BackAndTitle";

interface SearchResults {
  itemID: number;
  name: string;
  price: string;
  image: string;
  storeName: string;
}

const SearchItem: React.FC<SearchResults> = ({ itemID, name, price, image, storeName }) => {
  const navigate = useNavigate();

  if (status === "loading") {
    return <LoadingImg />;
  }
  return (
    <div className={css.item_container}>
      <img
        src={image}
        alt={name}
        className={css.img}
        key={itemID}
        onClick={() => navigate(`/item/${itemID}`)}
      />
      <div className={css.information_container}>
        <p className={css.item_name}>{name}</p>
        <p className={css.store_name}>{storeName}</p>
        <p className={css.item_name}>₱{price}</p>
      </div>
    </div>
  );
};

const Search: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state !== null ? location.state : {};
  const image = state.image !== undefined ? state.image : 1;
  const image_search_result =
    state.image_search_result !== undefined ? state.image_search_result : 1;

  const [searchParams, setSearchParams] = useSearchParams();
  const { status, data } = useQuery<SearchResults[]>(
    ["search", searchParams.get("q")],
    async () => {
      const res = await axios.get(LINK_SEARCH, {
        params: { q: searchParams.get("q") },
        withCredentials: true,
      });
      console.log(res);
      return res.data.results;
    },
    { staleTime: Infinity }
  );
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-device-width: 1224px)",
  });
  return (
    <>
      {isDesktopOrLaptop ? <NavBar /> : <MobileNavTop />}
      <div className={css.wrapper}>
        <div className={css.back_and_title_wrapper}>
          {image === 1 && <BackAndTitle title="Results" backTo="/" />}
          {image !== 1 && <BackAndTitle title="Results" backTo="/" image={image} />}
        </div>
        <div className={css.display_clothing}>
          {data &&
            image === 1 &&
            data!.map((item) => (
              <SearchItem
                itemID={item.itemID}
                name={item.name}
                price={item.price}
                image={item.image}
                storeName={item.storeName}
                key={item.itemID}
              />
            ))}
          {image_search_result !== 1 &&
            image_search_result.map((item: SearchResults) => (
              <SearchItem
                itemID={item.itemID}
                name={item.name}
                price={item.price}
                image={item.image}
                storeName={item.storeName}
                key={item.itemID}
              />
            ))}
        </div>
        {status === "loading" && <img src={loading} alt="loading" className={css.loading} />}
      </div>
      {!isDesktopOrLaptop && <MobileNavBottom />}
    </>
  );
};

export default Search;
