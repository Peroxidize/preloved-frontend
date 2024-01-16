import { useMediaQuery } from "react-responsive";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import css from "./map.module.css";
import NavBar, { MobileNavTop, MobileNavBottom } from "../fragments/nav-bar/nav-bar";
import arrow from "../../assets/icons/leftArrow.svg";
import { Link, useNavigate } from "react-router-dom";
import { attach_location } from "../../utils/auth";

interface IFormInput {
  long: string;
  lat: string;
}

function Map() {
  const navigate = useNavigate();
  const [fetching, setFetching] = useState<boolean>(false);
  const [response, setResponse] = useState<any>(null);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-device-width: 1224px)",
  });

  const back = () => {
    navigate(-1);
  };

  const onSubmit: SubmitHandler<IFormInput> = async (form) => {
    const formData = new FormData();
    formData.append("long", form.long);
    formData.append("lat", form.lat);

    setFetching(true);
    setResponse(await attach_location(formData));
    setFetching(false);
  };

  return (
    <>
      {isDesktopOrLaptop ? <NavBar /> : <MobileNavTop />}
      <div className={css.container}>
        <div className={css.header}>
          <img src={arrow} onClick={back} className={css.arrow} />
          <h1 className={css.center}>Enter Coordinates</h1>
        </div>
        <p className={css.text_info}>Please enter the longitude and latitude coordinates.</p>
        <p className={css.text_info}>
          Get your coordinates{" "}
          <a target="_blank" className={css.link} href="https://maps.google.com">
            here
          </a>{" "}
          by right-click onto <br /> your location and click the coordinates
        </p>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={css.form}>
              <input
                className={css.form_input}
                placeholder="Enter latitude"
                {...register("lat", { required: true })}
              />
              <input
                className={css.form_input}
                placeholder="Enter longitude"
                {...register("long", { required: true })}
              />
            </div>
            <input type="submit" className={css.button} />
          </form>
          <div className={css.errors}>
            {fetching && <p className={css.neutral}>Submitting...</p>}
            {response && <p className={css.success}>{response}</p>}
            {errors.long?.type === "required" && <p>Longitude required</p>}
            {errors.lat?.type === "required" && <p>Latitude required</p>}
          </div>
        </div>
      </div>
      {!isDesktopOrLaptop && <MobileNavBottom />}
    </>
  );
}

export default Map;
