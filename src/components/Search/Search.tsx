import { useMediaQuery } from "react-responsive";
import NavBar, { MobileNavTop, MobileNavBottom } from "../fragments/nav-bar/nav-bar";
import css from "./Search.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import { LINK_GET_ITEM_IMAGES, LINK_SEARCH } from "../misc";
import loading from "../../assets/loading.gif";
import { LoadingImg } from "../fragments/commonstuff/Loading";

interface SearchResults {
  itemID: number;
  name: string;
}

const SearchItem: React.FC<SearchResults> = ({ itemID, name }) => {
  const { status, data } = useQuery("getImages" + itemID, async () => {
    const res = await axios.get(LINK_GET_ITEM_IMAGES, {
      params: {
        id: itemID,
      },
      withCredentials: true,
    });
    console.log(res);
    return res.data.image_links;
  });
  const navigate = useNavigate();

  if (status === "loading") {
    return <LoadingImg />;
  }
  return (
    <img src={data[0]} alt={name} className={css.img} onClick={() => navigate(`/item/${itemID}`)} />
  );
};

const Search: React.FC = () => {
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
        <div className={css.display_clothing}>
          {data &&
            data.map((item) => (
              <SearchItem itemID={item.itemID} name={item.name} key={item.itemID} />
            ))}
        </div>
        {status === "loading" && <img src={loading} alt="loading" className={css.loading} />}
      </div>
      {!isDesktopOrLaptop && <MobileNavBottom />}
    </>
  );
};

export default Search;
