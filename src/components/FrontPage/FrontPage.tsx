import css from "./frontpage.module.css";
import utilcss from "../../utils/utils.module.css";

import NavBar, { MobileNavBottom } from "../fragments/nav-bar/nav-bar";
import { useMediaQuery } from "react-responsive";
import { MobileNavTop } from "../fragments/nav-bar/nav-bar";
import axios from "axios";
import { LINK_GET_FRONTPAGE } from "../misc";
import { useInfiniteQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { createContext, useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import { LoadingCard } from "../fragments/commonstuff/Loading";

export interface Image {
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

interface FrontPageData {
  itemsWithImg: Item[];
  hasNext: boolean;
}

export const RefetchContext = createContext<(() => void) | undefined>(undefined);

export default function FrontPage() {
  const navigate = useNavigate();
  const getItems = async ({ pageParam = 1 }) => {
    const res = await axios.get(LINK_GET_FRONTPAGE, {
      params: { page: pageParam },
      withCredentials: true,
    });
    const itemsWithImg = res.data.items.filter((item: Item) => {
      return item.images.length > 0;
    });
    console.log({ itemsWithImg, hasNext: res.data.has_next });
    return { itemsWithImg, hasNext: res.data.has_next };
  };
  const { status, data, fetchNextPage, hasNextPage, refetch, isRefetching, isFetchingNextPage } =
    useInfiniteQuery<FrontPageData>({
      queryKey: "getItems",
      queryFn: getItems,
      staleTime: Infinity,
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.hasNext) {
          return pages.length + 1;
        }
        return undefined;
      },
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
  const items = data?.pages.flatMap((page) => page.itemsWithImg);
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
    <RefetchContext.Provider value={refetch}>
      {isDesktopOrLaptop ? <NavBar /> : <MobileNavTop />}
      <div className={css.wrapper}>
        <div className={css.display_clothing}>
          {/* Initial loading or manual refetch */}
          {(status === "loading" || isRefetching) && !isFetchingNextPage ? (
            Array.from({ length: 16 }).map((_, index) => <LoadingCard key={index} />)
          ) : status === "success" && items ? (
            // Show items once loaded
            <>
              {items.map((item: Item, i) => {
                if (i === items.length - 1) {
                  return (
                    <div key={i} className={css.item_container}>
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
                  <div
                    className={css.item_container}
                    onClick={() => navigate(`/item/${item.item_id}`)}
                    key={i}
                  >
                    <img src={item.images[0].link} alt={item.item_name} className={css.img} />
                    <div className={css.information_container}>
                      <p className={css.item_name}>{item.item_name}</p>
                      <p className={css.store_name}>{item.storeName}</p>
                      <p className={css.item_name}>₱{item.item_price}</p>
                    </div>
                  </div>
                );
              })}

              {/* Show loading cards at bottom only during infinite scroll */}
              {isFetchingNextPage &&
                Array.from({ length: 8 }).map((_, index) => (
                  <LoadingCard key={`scroll-${index}`} />
                ))}
            </>
          ) : null}
        </div>
      </div>
      {!isDesktopOrLaptop && <MobileNavBottom />}
    </RefetchContext.Provider>
  );
}
