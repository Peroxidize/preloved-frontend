import classes from "./CreateShop.module.css";
import BackAndTitle from "../fragments/commonstuff/BackAndTitle";
import { SubmitHandler, useForm } from "react-hook-form";
import TextInput from "../fragments/FormInputs/TextInput";
import { LINK_CREATE_SHOP } from "../misc";
import Button from "../fragments/FormInputs/Button";
import axios from "axios";

interface IFormValues {
  name: string;
  street: string;
  barangay: string;
  municipality: string;
  province: string;
}

const CreateShop: React.FC = () => {
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
      <div className={classes.backgroundPhoto}>
        <div className={classes.container}>
          <BackAndTitle title="Create Shop" backTo="/" />
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
      </div>
    </>
  );
};

export default CreateShop;
