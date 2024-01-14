import classes from "./CreateShop.module.css";
import { SubmitHandler, useForm } from "react-hook-form";
import TextInput from "../fragments/FormInputs/TextInput";
import { LINK_CREATE_SHOP } from "../misc";
import Button from "../fragments/FormInputs/Button";
import axios from "axios";
import { useMediaQuery } from "react-responsive";
import NavBar, { MobileNavBottom, MobileNavTop } from "../fragments/nav-bar/nav-bar";
import { useMutation } from "react-query";
import LoadingDialog, {
  ErrorDialog,
  SuccessDialog,
} from "../fragments/commonstuff/Dialogs";
import { useNavigate } from "react-router-dom";

interface FormValues {
  name: string;
  street: string;
  barangay: string;
  municipality: string;
  province: string;
}

const CreateShop: React.FC = () => {
  const navigate = useNavigate();
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-device-width: 1224px)",
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormValues>();

  const createShop = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await axios.post(LINK_CREATE_SHOP, data, { withCredentials: true });
      console.log(res);
      return res.data;
    },
    onMutate: () => {
      const loadingDialog = document.getElementById("loadingDialog") as HTMLDialogElement;
      loadingDialog.showModal();
    },
    onSuccess: () => {
      const loadingDialog = document.getElementById("loadingDialog") as HTMLDialogElement;
      loadingDialog.close();
      const successDialog = document.getElementById("successDialog") as HTMLDialogElement;
      successDialog.showModal();
      setTimeout(() => {
        successDialog.close();
        navigate("/shop");
      }, 3000);
    },
    onError: () => {
      const loadingDialog = document.getElementById("loadingDialog") as HTMLDialogElement;
      loadingDialog.close();
      const errorDialog = document.getElementById("errorDialog") as HTMLDialogElement;
      errorDialog.showModal();
      setTimeout(() => errorDialog.close(), 3000);
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const address = `${data.street}, ${data.barangay}, ${data.municipality}, ${data.province}`;
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("address", address);
    createShop.mutate(formData);
  };
  return (
    <>
      {isDesktopOrLaptop ? <NavBar /> : <MobileNavTop />}
      <LoadingDialog />
      <SuccessDialog text="Shop created successfully! Redirecting to your shop page..." />
      <ErrorDialog text="Something went wrong. Please try again after a few minutes" />
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
