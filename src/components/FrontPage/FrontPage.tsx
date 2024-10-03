import css from "./frontpage.module.css";
import utilcss from "../../utils/utils.module.css";

import NavBar, { MobileNavBottom } from "../fragments/nav-bar/nav-bar";
import { useMediaQuery } from "react-responsive";
import { MobileNavTop } from "../fragments/nav-bar/nav-bar";
import axios from "axios";
import { LINK_GET_FRONTPAGE } from "../misc";
import { useInfiniteQuery, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import loading from "../../assets/loading.gif";
import { useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";

interface Image {
  link: string;
  slugID: number;
}

interface Item {
  images: Image[];
  is_feminine: boolean;
  item_description: string;
  item_id: number;
  item_name: string;
  item_price: string;
  size: string;
  storeID: number;
  storeName: string;
}

export default function FrontPage() {
  const navigate = useNavigate();
  const getItems = async ({ pageParam = 0 }) => {
    const res = await axios.get(LINK_GET_FRONTPAGE, { withCredentials: true });
    const itemsWithImg = res.data.items.filter((item: Item) => {
      return item.images.length > 0;
    });
    return itemsWithImg;
  };
  const { status, data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: "getItems",
    queryFn: getItems,
    staleTime: Infinity,
    getNextPageParam: (lastPage, pages) => pages.length + 1,
  });

  const lastItemRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: lastItemRef.current,
    threshold: 1,
  });
  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);
  const items = data?.pages.flatMap((page) => page);
  // (async () => {
  //   await axios.get(domain + downloadfiles)
  //   .then(response => {
  //     console.log(response);
  //   }).catch(error => {
  //     console.log(error);
  //   });
  // })();
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-device-width: 1224px)",
  });

  return (
    <>
      {isDesktopOrLaptop ? <NavBar /> : <MobileNavTop />}
      <div className={css.wrapper}>
        <div className={css.display_clothing}>
          {items?.map((item: Item, i) => {
            if (i === items.length - 1) {
              return (
                <div className={css.item_container}>
                  <img
                    src={item.images[0].link}
                    alt={item.item_name}
                    className={css.img}
                    key={i}
                    onClick={() => navigate(`/item/${item.item_id}`)}
                    ref={ref}
                  />
                  <div className={css.information_container}>
                    <p className={css.item_name}>{item.item_name}</p>
                    <p className={css.store_name}>{item.storeName}</p>
                    <p className={css.item_name}>₱{item.item_price}</p>
                  </div>
                </div>
              );
            }
            return (
                <div className={css.item_container} onClick={() => navigate(`/item/${item.item_id}`)}>
                  <img
                    src={item.images[0].link}
                    alt={item.item_name}
                    className={css.img}
                    key={i}
                  />
                  <div className={css.information_container}>
                    <p className={css.item_name}>{item.item_name}</p>
                    <p className={css.store_name}>{item.storeName}</p>
                    <p className={css.item_name}>₱{item.item_price}</p>
                  </div>
                </div>
            );
          })}
          {Array.from({ length: 16 }, (_, index: number) => (
            <div className={`${utilcss.skeleton} ${css.placeholder}`}></div>
          ))}
        </div>
      </div>
      {!isDesktopOrLaptop && <MobileNavBottom />}
    </>
  );
}
