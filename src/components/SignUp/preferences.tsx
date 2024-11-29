import React, { forwardRef } from "react";
import axios, { AxiosError } from "axios";
import css from "./preferences.module.css";
import { LINK_GET_ALL_TAGS } from "../misc";
import { useQuery } from "react-query";
import { TagData } from "../ProductManagement/AddItem";
import close from "../../assets/icons/close.svg";
import Button from "../fragments/FormInputs/Button";

interface PreferencesProps {
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedTags: number[];
  handleSubmit?: () => void;
}

const Preferences = forwardRef<HTMLDialogElement, PreferencesProps>(
  ({ handleChange, selectedTags, handleSubmit }, ref) => {
    const { status, data } = useQuery<
      "idle" | "error" | "loading" | "success",
      AxiosError,
      TagData
    >("tags", async () => {
      const response = await axios.get(LINK_GET_ALL_TAGS, { withCredentials: true });
      return response.data;
    });

    return (
      <dialog ref={ref} className={css.preferencesDialog}>
        <div className={css.preferencesHeader}>
          <h2>Select your preferences</h2>
          <button
            onClick={(e) => {
              e.preventDefault();
              (ref as React.RefObject<HTMLDialogElement>).current?.close();
            }}
            className={css.closeButton}
          >
            <img src={close} alt="Close" className={css.closeIcon} />
          </button>
        </div>
        <div className={css.spacer}></div>
        <div className={css.preferences}>
          {status === "loading" && <p>Loading tags...</p>}
          {status === "error" && <p>Error loading tags</p>}
          {status === "success" &&
            data &&
            Object.keys(data).map((tag) => (
              <span key={tag} className={css.tagSpan}>
                <label
                  htmlFor={tag}
                  className={`${css.tagLabel} ${
                    selectedTags.includes(data[tag]) ? css.selected : ""
                  }`}
                >
                  {tag}
                </label>
                <input
                  type="checkbox"
                  id={tag}
                  name={tag}
                  checked={selectedTags.includes(data[tag])}
                  value={data[tag].toString()}
                  data-tag={tag}
                  onChange={handleChange}
                />
              </span>
            ))}
        </div>
        <div className={css.spacer}></div>
        <Button
          handleClick={(e) => {
            e.preventDefault();
            handleSubmit?.();
            (ref as React.RefObject<HTMLDialogElement>).current?.close();
          }}
          text="Save"
        />
      </dialog>
    );
  }
);

export default Preferences;
