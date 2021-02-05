import React, { useState, useEffect } from "react"
// @ts-ignore
import HTMLparse from "html-react-parser"
import Title from "../components/Title"
// @ts-ignore
import styles from "../styles/form.module"
import Field from "../components/Field"
import FieldPicker from "../components/FieldPicker"
import FieldDate from "../components/FieldDate"
import FieldEditor from "../components/FieldEditor"
import { useParams, useLocation, useHistory } from "react-router-dom"
import LoaderData from "../components/LoaderData"
import Button from "../components/Button"
// @ts-ignore
import stylesBtn from "../styles/button.module"
import { BsPencil, BsPlus, BsLink45Deg, BsX } from "react-icons/bs"
import useChangeInput from "../hooks/useChangeInput"
import { categories } from "../modules/newsCategories"
import { CREATE_NEWS_EVENT } from "../fetching/mutations"
import { useMutation } from "@apollo/client"
import useSetErrorsFields from "../hooks/useSetErrorsFields"
import { SET_TOAST } from "../redux/toasts/toastsTypes"
import { useDispatch } from "react-redux"
import { types } from "../modules/messageTypes"

const ModNewsEvent: React.FC = () => {
  const { contentId }: any = useParams()
  const { pathname } = useLocation()
  const history = useHistory()
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
      param: "label",
      type: "text",
      value: "",
      title: "Ярлик",
      msg: "",
    },
  ])
  const [extraLinks, setExtraLinks] = useState<
    { link: string; label: string }[]
  >([])
  const { changeInput } = useChangeInput()
  const { setErrors } = useSetErrorsFields()
  const dispatch = useDispatch()

  const [
    createNewsEvent,
    { data: dataCreate, loading: loadCreate, error: errorCreate },
  ] = useMutation(CREATE_NEWS_EVENT)

  useEffect(() => {
    const dataCreateNewsEvent = dataCreate && dataCreate.createNewsEvent
    if (errorCreate) {
      console.log({ errorCreate })
      setErrors(errorCreate.message, setForm)
      dispatch({
        type: SET_TOAST,
        payload: {
          type: types.error.keyWord,
          message: "Помилка перевірки полів форми!",
        },
      })
    } else if (dataCreateNewsEvent) {
      dispatch({
        type: SET_TOAST,
        payload: {
          message: `${isNews ? "Новина" : "Подія"} була успішно створена!`,
          type: types.success.keyWord,
        },
      })
      history.push(
        isNews
          ? `/news/details/${dataCreateNewsEvent}`
          : `/events/details/${dataCreateNewsEvent}`
      )
    }
  }, [dispatch, dataCreate, errorCreate, contentId, isNews])

  const handleSubmitForm = (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault()
    const [title, dateEvent, category, content] = form

    if (contentId) {
      console.log("START EDIT NEWS EVENT")
    } else {
      createNewsEvent({
        variables: {
          title: title.value.trim(),
          content: content.value.trim(),
          type: isNews ? "news" : "event",
          category: category.value,
          dateEvent: dateEvent.value.trim(),
          links: extraLinks,
        },
      })
    }
  }

  const handleChangeEditor = (value: string) => {
    setForm((prevForm) =>
      prevForm.map((field) => {
        if (field.param === "content") {
          return { ...field, value, msg: "" }
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
    const [link, label] = formLink
    setExtraLinks((prev) => [...prev, { link: link.value, label: label.value }])
    setFormLink((prevForm) =>
      prevForm.map((field) => {
        return { ...field, value: "" }
      })
    )
  }

  const handleDeleteLink = (linkAddress: string) => {
    setExtraLinks((prev) =>
      [...prev].filter((link) => link.link !== linkAddress)
    )
  }

  const options = Object.keys(categories).map((key) => {
    // @ts-ignore
    return { label: categories[key].title, value: categories[key].keyWord }
  })

  const checkFormLinkFilled = () => {
    let check = true
    formLink.forEach((field) => {
      check = !!field.value.trim() && check
    })
    return check
  }

  const extraLinksJSX = extraLinks.map((link, index) => {
    return (
      <div className={stylesBtn.btn_link} key={link.link + index}>
        <span className={stylesBtn.btn_link__title}>{link.label}</span>
        <button
          className={stylesBtn.btn_link__delete}
          onClick={() => handleDeleteLink(link.link)}
        >
          <BsX />
        </button>
      </div>
    )
  })

  const fields = form.map((field) => {
    if (field.type === "date") {
      return (
        <FieldDate
          key={field.param}
          field={field}
          change={(event: any) => changeInput(event, setForm)}
          isImportant
        />
      )
    } else if (field.param === "category") {
      return (
        <FieldPicker
          key={field.param}
          field={field}
          change={setForm}
          options={options}
          isImportant
        />
      )
    } else if (field.param === "content") {
      return (
        <FieldEditor
          key={field.param}
          field={field}
          change={handleChangeEditor}
          isImportant
        />
      )
    }
    return (
      <Field
        key={field.param}
        field={field}
        change={(event) => changeInput(event, setForm)}
        isImportant
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

  console.log({ form, formLink })
  const isFormLinkFilled = checkFormLinkFilled()
  return (
    <div className='container'>
      <Title title='Галерея' />
      <div className='wrapper'>
        <div className={styles.form}>
          <div
            className={`${styles.form__content} ${styles.form__content__article}`}
          >
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
              <LoaderData load={loadCreate} />
              <div className={styles.form__fields}>{fields}</div>
              <button className='btn-handler'></button>
            </form>
            <form
              className={styles.form__container_fields}
              onSubmit={handleAddExtraLink}
            >
              <LoaderData load={loadCreate} />
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
                {extraLinksJSX.length ? (
                  extraLinksJSX
                ) : (
                  <div className={styles.form__plug_text}>Порожньо</div>
                )}
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
        </div>
      </div>
    </div>
  )
}

export default ModNewsEvent
