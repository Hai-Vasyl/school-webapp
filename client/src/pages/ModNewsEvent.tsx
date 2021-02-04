import React, { useState } from "react"
// @ts-ignore

import HTMLparse from "html-react-parser"
import Title from "../components/Title"
// @ts-ignore
import styles from "../styles/form.module"
import Field from "../components/Field"
import FieldPicker from "../components/FieldPicker"
import FieldDate from "../components/FieldDate"
import FieldEditor from "../components/FieldEditor"
import { useParams, useLocation } from "react-router-dom"
import LoaderData from "../components/LoaderData"
import Button from "../components/Button"
// @ts-ignore
import stylesBtn from "../styles/button.module"
import { BsPencil, BsPlus, BsLink45Deg } from "react-icons/bs"
import useChangeInput from "../hooks/useChangeInput"
import { categories } from "../modules/newsCategories"

const ModNewsEvent: React.FC = () => {
  const { contentId }: any = useParams()
  const { pathname } = useLocation()
  const isNews =
    pathname === "/edit-news/:newsId" || pathname === "/create-news"

  const [form, setForm] = useState([
    {
      param: "title",
      type: "text",
      value: "",
      title: "Заголовок",
      msg: "",
    },
    {
      param: "dateEvent",
      type: "date",
      value: "",
      title: "Дата події",
      msg: "",
    },
    {
      param: "category",
      type: "text",
      value: categories.science.keyWord,
      title: "Категорія",
      msg: "",
    },
    {
      param: "content",
      type: "text",
      value: "",
      title: "Контент",
      msg: "",
    },
  ])
  const [formLink, setFormLink] = useState([
    {
      param: "link",
      type: "text",
      value: "",
      title: "Адреса посилання",
      msg: "",
    },
    {
      param: "content",
      type: "text",
      value: "",
      title: "Ярлик",
      msg: "",
    },
  ])
  const [extraLinks, setExtraLinks] = useState([])

  // link: { type: String, required: true },
  // label

  const { changeInput } = useChangeInput()

  const handleSubmitForm = (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault()
  }

  const handleChangeEditor = (value: string) => {
    setForm((prevForm) =>
      prevForm.map((field) => {
        if (field.param === "content") {
          return { ...field, value }
        }
        return field
      })
    )
  }

  const handleAddExtraLink = (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault()
    console.log("NEW LINK")
  }

  const options = Object.keys(categories).map((key) => {
    // @ts-ignore
    return { label: categories[key].title, value: categories[key].keyWord }
  })

  const checkFormLinkFilled = () => {
    let check = true
    formLink.forEach((field) => {
      check = !!field.value && check
    })
    return check
  }

  const fields = form.map((field) => {
    if (field.type === "date") {
      return (
        <FieldDate
          key={field.param}
          field={field}
          change={(event: any) => changeInput(event, setForm)}
        />
      )
    } else if (field.param === "category") {
      return (
        <FieldPicker
          key={field.param}
          field={field}
          change={setForm}
          options={options}
        />
      )
    } else if (field.param === "content") {
      return (
        <FieldEditor
          key={field.param}
          field={field}
          change={handleChangeEditor}
        />
      )
    }
    return (
      <Field
        key={field.param}
        field={field}
        change={(event) => changeInput(event, setForm)}
      />
    )
  })

  const fieldsLink = formLink.map((field) => {
    return (
      <Field
        key={field.param}
        field={field}
        change={(event) => changeInput(event, setFormLink)}
      />
    )
  })

  const isFormLinkFilled = checkFormLinkFilled()
  return (
    <div className='container'>
      <Title title='Галерея' />
      <div className='wrapper'>
        <div className={styles.form}>
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
                {contentId ? "Редагування " : "Створення "}
                {isNews ? "новини" : "події"}
              </div>
            </div>
            <form
              className={styles.form__container_fields}
              onSubmit={handleSubmitForm}
            >
              {/* <LoaderData
                load={loadCreateGroup || loadEditGroup || loadUsers}
              /> */}
              <div className={styles.form__fields}>{fields}</div>
              <button className='btn-handler'></button>
            </form>
            <form
              className={styles.form__container_fields}
              onSubmit={handleAddExtraLink}
            >
              {/* <LoaderData
                load={loadCreateGroup || loadEditGroup || loadUsers}
              /> */}
              <div className={styles.form__title_simple}>
                Додаткові посилання
              </div>
              <div className={styles.form__fields}>{fieldsLink}</div>
              <button className='btn-handler'></button>
              <div className={styles.form__btns}>
                <Button
                  title='Добавити посилання'
                  exClass={
                    isFormLinkFilled
                      ? stylesBtn.btn_primary
                      : stylesBtn.btn_disabled
                  }
                  Icon={BsLink45Deg}
                  click={handleAddExtraLink}
                  disabled={!isFormLinkFilled}
                  type='button'
                />
              </div>
              <div
                className={`${styles.form__stack} ${styles.form__stack_short}`}
              >
                lkjsdf
              </div>
            </form>
            <div className={styles.form__btns}>
              <Button
                title={
                  contentId
                    ? "Застосувати зміни"
                    : `Створити ${isNews ? "новину" : "подію"}`
                }
                exClass={stylesBtn.btn_primary}
                Icon={contentId ? BsPencil : BsPlus}
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
          </div>
          <div className={styles.form__sidebar}></div>
        </div>
      </div>
    </div>
  )
}

export default ModNewsEvent
