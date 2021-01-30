import React, { useState, useEffect } from "react"
// @ts-ignore
import styles from "../styles/form.module"
// @ts-ignore
import stylesBtn from "../styles/button.module"
import { CREATE_IMAGE } from "../fetching/mutations"
import { useMutation } from "@apollo/client"
import { SET_TOAST } from "../redux/toasts/toastsTypes"
import ButtonTab from "./ButtonTab"
import { useSelector, useDispatch } from "react-redux"
import { RootStore } from "../redux/store"
import LoaderData from "./LoaderData"
import Button from "./Button"
import { BsPencil, BsPlus } from "react-icons/bs"
import FieldFile from "./FieldFile"
import Field from "./Field"
import useChangeInput from "../hooks/useChangeInput"

const ImageMod: React.FC = () => {
  const [createImage, { data, loading, error }] = useMutation(CREATE_IMAGE)
  const [form, setForm] = useState([
    {
      param: "upload",
      type: "file",
      title: "Зображення",
      msg: "",
    },
    {
      param: "description",
      type: "text",
      value: "",
      title: "Заголовок",
      msg: "",
    },
  ])
  const {
    toggle: {
      modImage: { description, toggle, upload },
    },
  } = useSelector((state: RootStore) => state)
  const { changeInput } = useChangeInput()

  const handleSubmitForm = () => {
    console.log("SUBMITED")
  }

  const handleChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prevForm) =>
      prevForm.map((field) => {
        if (field.param === "upload") {
          return { ...field, value: event.target.files[0], msg: "" }
        }
        return field
      })
    )
  }

  const fields = form.map((field) => {
    if (field.param === "upload") {
      return (
        <FieldFile
          key={field.param}
          field={field}
          file={true}
          change={handleChangeFile}
          numFiles={1}
        />
      )
    }
    return (
      <Field
        field={field}
        key={field.param}
        change={(event) => changeInput(event, setForm)}
      />
    )
  })

  return (
    <div
      className={`${styles.form} ${styles.form_popup} ${
        toggle && styles.form_popup__active
      }`}
    >
      <div className={styles.form__content}>
        <div className={styles.form__title}>
          {/* {groupId && (
                <ButtonTab
                  Icon={BsArrowLeft}
                  click={handleGoBack}
                  exClass={styles.form__btn_back}
                />
              )} */}
          <div className={styles.form__title_text}>
            {upload ? "Редагування зображення" : "Створення зображення"}
          </div>
        </div>
        <form
          className={styles.form__container_fields}
          onSubmit={handleSubmitForm}
        >
          <LoaderData load={loadCreateGroup || loadEditGroup || loadUsers} />
          <div className={styles.form__fields}>{fields}</div>
          <button className='btn-handler'></button>
          <div className={styles.form__btns}>
            <Button
              title={upload ? "Застосувати зміни" : "Створити зображення"}
              exClass={stylesBtn.btn_primary}
              Icon={upload ? BsPencil : BsPlus}
              click={handleSubmitForm}
              type='button'
            />
            {/* {groupId && (
                  <Button
                    title='Скасувати'
                    exClass={stylesBtn.btn_simple}
                    Icon={BsX}
                    click={handleGoBack}
                    type='button'
                  />
                )} */}
          </div>
        </form>
      </div>
      <div className={styles.form__sidebar}></div>
    </div>
  )
}

export default ImageMod
