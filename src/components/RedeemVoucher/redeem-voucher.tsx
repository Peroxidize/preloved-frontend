import css from "./redeem-voucher.module.css";
import { useMediaQuery } from "react-responsive";
import NavBar, { MobileNavTop, MobileNavBottom } from "../fragments/nav-bar/nav-bar";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { redeem_voucher } from "../../utils/store";

interface IFormInput {
  code: string;
}

function displayResponse(response: string) {
  switch (response) {
    case "Voucher code invalid":
      return <div className={css.invalid_code}>{response}</div>;
    case "Voucher code already redeemed":
      return <div className={css.invalid_code}>{response}</div>;
    default:
      return <div className={css.valid_code}>{response}</div>;
  }
}

function RedeemVoucher() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [response, setResponse] = useState<any>();

  const onSubmit: SubmitHandler<IFormInput> = async (form) => {
    setSubmitting(true);
    setResponse(await redeem_voucher(form.code));
    setSubmitting(false);
  };

  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-device-width: 1224px)",
  });

  return (
    <>
      {isDesktopOrLaptop ? <NavBar /> : <MobileNavTop />}
      <div className={css.container}>
        <h1>Redeem Voucher</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={css.form_container}>
            <div className={css.labelform}>
              <label>Voucher Code</label>
              <input
                className={css.form_input}
                {...register("code", { required: true, minLength: 20 })}
              />
              {errors.code && errors.code.type === "required" && (
                <p className={css.form_error}>Voucher code is required</p>
              )}
              {errors.code && errors.code.type === "minLength" && (
                <p className={css.form_error}>Voucher Code must be 20 characters</p>
              )}
            </div>
            <input className={css.submit_button} type="submit" value="Redeem" />
          </div>
        </form>

        <div className={css.submit_response}>
          {submitting && <>Submitting...</>}
          {response && displayResponse(response)}
        </div>
      </div>
      {!isDesktopOrLaptop && <MobileNavBottom />}
    </>
  );
}

export default RedeemVoucher;
