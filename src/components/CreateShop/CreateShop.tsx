import classes from "./CreateShop.module.css";
import BackAndTitle from "../fragments/commonstuff/BackAndTitle";
import { SubmitHandler, useForm } from "react-hook-form";
import TextInput from "../fragments/FormInputs/TextInput";
import { LINK_CREATE_SHOP } from "../misc";
import Button from "../fragments/FormInputs/Button";
import axios from "axios";
import { useMediaQuery } from "react-responsive";
import NavBar, { MobileNavBottom, MobileNavTop } from "../fragments/nav-bar/nav-bar";

interface IFormValues {
  name: string;
  street: string;
  barangay: string;
  municipality: string;
  province: string;
}

const CreateShop: React.FC = () => {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-device-width: 1224px)",
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormValues>();

  const onSubmit: SubmitHandler<IFormValues> = (data) => {
    const address = `${data.street}, ${data.barangay}, ${data.municipality}, ${data.province}`;
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("address", address);
    axios
      .post(LINK_CREATE_SHOP, formData, { withCredentials: true })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      {isDesktopOrLaptop ? <NavBar /> : <MobileNavTop />}
      <div className={classes.container}>
        <h1 className={classes.title}>Create Shop</h1>
        <form action={LINK_CREATE_SHOP} onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            label="Name"
            type="text"
            required={true}
            register={register}
            name="name"
          />
          <div className={classes.oneRowResponsive}>
            <TextInput
              label="Street"
              type="text"
              required={true}
              register={register}
              name="street"
            />
            <TextInput
              label="Barangay"
              type="text"
              required={true}
              register={register}
              name="barangay"
            />
          </div>
          <div className={classes.oneRowResponsive}>
            <TextInput
              label="Municipality"
              type="text"
              required={true}
              register={register}
              name="municipality"
            />
            <TextInput
              label="Province"
              type="text"
              required={true}
              register={register}
              name="province"
            />
          </div>
          <Button text="CREATE SHOP" />
        </form>
      </div>
      {!isDesktopOrLaptop && <MobileNavBottom />}
    </>
  );
};

export default CreateShop;
