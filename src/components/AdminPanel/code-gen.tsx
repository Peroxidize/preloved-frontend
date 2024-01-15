import parentcss from "./admin-panel.module.css";
import leftArrow from "../../assets/icons/leftArrow.svg";
import css from "./code-gen.module.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../utils/auth";
import { get_vouchers } from "../../utils/store";

function CodeGen() {
  const [fetching, setFetching] = useState<boolean>(true);
  const [vouchers1, setVouchers1] = useState<any>([]);
  const [vouchers2, setVouchers2] = useState<any>([]);
  const navigate = useNavigate();

  const navigatePendingList = () => {
    navigate("/");
  };

  const refreshData = async () => {
    setFetching(true);
    const response = await get_vouchers();
    const splitIndex = Math.ceil(response.length / 2);
    const arrayPart1 = response.slice(0, splitIndex);
    const arrayPart2 = response.slice(splitIndex);
    setVouchers1(arrayPart1);
    setVouchers2(arrayPart2);
    setFetching(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div className={parentcss.wrapper}>
      <div className={parentcss.header}>
        <img
          src={leftArrow}
          onClick={logout}
          alt="Back to login icon"
          className={parentcss.back_icon}
        />
        <h1 className={parentcss.title}>Admin Panel</h1>
        <button
          onClick={navigatePendingList}
          className={`${parentcss.btnApprove} ${css.nav_button}`}
        >
          Approve Sellers
        </button>
        <button className={`${parentcss.btnReject} ${css.nav_button}`}>
          Generate Vouchers
        </button>
      </div>

      <div className={css.title_content}>
        <h2>List of available vouchers</h2>
        <button onClick={refreshData} className={`${parentcss.btnApprove} ${css.nav_button}`}>
          Refresh List
        </button>
      </div>
      <div className={css.vouchers_container}>
        {fetching! ? (
          <h3>Loading...</h3>
        ) : (
          <>
            <div className={css.vouchers_column}>
              {vouchers1.map((voucher: any) => (
                <p className={css.voucher}>
                  <span className={css.voucher_amount}>{voucher.amount} </span>
                  Voucher{" "}
                  <span className={css.voucher_code}>{voucher["voucher code"]}</span>
                </p>
              ))}
            </div>

            <div className={css.vouchers_column}>
              {vouchers2.map((voucher: any) => (
                <p className={css.voucher}>
                  <span className={css.voucher_amount}>{voucher.amount} </span>
                  Voucher{" "}
                  <span className={css.voucher_code}>{voucher["voucher code"]}</span>
                </p>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CodeGen;
