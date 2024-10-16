import React, { forwardRef } from "react";
import axios, { AxiosError } from "axios";
import css from "./preferences.module.css";
import { LINK_GET_ALL_TAGS } from "../misc";
import { useState } from "react";
import { useQuery } from "react-query";
import { TagData } from "../ProductManagement/AddItem";
import close from "../../assets/icons/close.svg";
import Button from "../fragments/FormInputs/Button";

interface PreferencesProps {
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedTags: number[];
}

const Preferences = forwardRef<HTMLDialogElement, PreferencesProps>(
  ({ handleChange, selectedTags }, ref) => {
    const [tags, setTags] = useState<TagData[]>();

    const getTags = async () => {
      const response = await axios.get(LINK_GET_ALL_TAGS, { withCredentials: true });
      console.log(response.data);
      setTags(response.data);
      return response.data;
    };

    const { status, data } = useQuery<
      "idle" | "error" | "loading" | "success",
      AxiosError,
      TagData
    >("tags", getTags);

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
            <img src={close} alt="" className={css.closeIcon} />
          </button>
        </div>
        <div className={css.spacer}></div>
        <div className={css.preferences}>
          {data &&
            Object.keys(data).map((tag) => (
              <span key={tag} className={css.tagSpan}>
                <label
                  htmlFor={tag}
                  className={`${css.tagLabel} ${selectedTags.includes(data[tag]) ? css.selected : ""}`}
                >
                  {tag}
                </label>
                <input
                  type="checkbox"
                  id={tag}
                  name={tag}
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
            (ref as React.RefObject<HTMLDialogElement>).current?.close();
          }}
          text="Save"
        />
      </dialog>
    );
  }
);

export default Preferences;
