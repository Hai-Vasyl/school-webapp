import React, { useState, useEffect, useCallback } from "react"
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
import {
  BsPencil,
  BsPlus,
  BsLink45Deg,
  BsX,
  BsTrash,
  BsArrowClockwise,
  BsArrowLeft,
} from "react-icons/bs"
import { categories } from "../modules/newsCategories"
import {
  CREATE_NEWS_EVENT,
  EDIT_NEWS_EVENT,
  DELETE_NEWS_EVENT,
} from "../fetching/mutations"
import { useMutation, useLazyQuery } from "@apollo/client"
import useSetErrorsFields from "../hooks/useSetErrorsFields"
import { SET_TOAST } from "../redux/toasts/toastsTypes"
import { useDispatch } from "react-redux"
import { types } from "../modules/messageTypes"
import { GET_NEWS_EVENT } from "../fetching/queries"
import { INewsEventDetailed, INewsEventSlider } from "../interfaces"
import { WARNING_OPEN, WARNING_CLOSE } from "../redux/toggle/toggleTypes"
import ButtonTab from "../components/ButtonTab"
import NewsEventsModuleContainer from "../components/NewsEventsModuleContainer"
import NewsEventsModule from "../components/NewsEventsModule"
import FooterModule from "../components/FooterModule"

const ModNewsEvent: React.FC = () => {
  const { contentId }: any = useParams()
  const { pathname } = useLocation()
  const history = useHistory()
  const isNews =
    pathname.split("/")[1] === "edit-news" || pathname === "/create-news"
  const [activeEditItem, setActiveEditItem] = useState("")
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
  const { setErrors } = useSetErrorsFields()
  const dispatch = useDispatch()

  const [
    getNewsEvent,
    { data: dataDataEdit, loading: loadDataEdit },
  ] = useLazyQuery(GET_NEWS_EVENT, { fetchPolicy: "cache-and-network" })
  const [
    createNewsEvent,
    { data: dataCreate, loading: loadCreate, error: errorCreate },
  ] = useMutation(CREATE_NEWS_EVENT)
  const [
    editNewsEvent,
    { data: dataEdit, loading: loadEdit, error: errorEdit },
  ] = useMutation(EDIT_NEWS_EVENT)
  const [
    deleteNewsEvent,
    { data: dataDelete, loading: loadDelete },
  ] = useMutation(DELETE_NEWS_EVENT)

  const setDataForms = useCallback((newsEventData: INewsEventDetailed) => {
    setForm((prevForm) =>
      prevForm.map((field) => {
        let newField = field
        Object.keys(newsEventData).forEach((key) => {
          if (field.param === key) {
            // @ts-ignore
            newField = { ...newField, value: newsEventData[key] }
          }
        })
        return newField
      })
    )
    setExtraLinks(newsEventData.links)
  }, [])

  useEffect(() => {
    if (contentId) {
      getNewsEvent({
        variables: {
          contentId,
          type: isNews ? "news" : "event",
        },
      })
    }
  }, [getNewsEvent, contentId, isNews])

  useEffect(() => {
    const editNewsEvent = dataDataEdit && dataDataEdit.getNewsEvent
    if (editNewsEvent) {
      setDataForms(editNewsEvent)
    }
  }, [dataDataEdit, setDataForms])

  useEffect(() => {
    const dataCreateNewsEvent = dataCreate && dataCreate.createNewsEvent
    if (errorCreate) {
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

  useEffect(() => {
    const dataEditNewsEvent = dataEdit && dataEdit.editNewsEvent
    if (errorEdit) {
      setErrors(errorEdit.message, setForm)
      dispatch({
        type: SET_TOAST,
        payload: {
          type: types.error.keyWord,
          message: "Помилка перевірки полів форми!",
        },
      })
    } else if (dataEditNewsEvent) {
      dispatch({
        type: SET_TOAST,
        payload: dataEditNewsEvent,
      })
      history.push(
        isNews ? `/news/details/${contentId}` : `/events/details/${contentId}`
      )
    }
  }, [dispatch, dataEdit, errorEdit, contentId, isNews])

  useEffect(() => {
    const dataDeleteNewsEvent = dataDelete && dataDelete.deleteNewsEvent
    if (dataDeleteNewsEvent) {
      dispatch({
        type: SET_TOAST,
        payload: dataDeleteNewsEvent,
      })
      history.push(isNews ? "/news" : "/events")
    }
  }, [dispatch, dataDelete, contentId, isNews])

  const handleSubmitForm = (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault()
    const [title, dateEvent, category, content] = form

    if (contentId) {
      editNewsEvent({
        variables: {
          contentId,
          title: title.value.trim(),
          content: content.value.trim(),
          type: isNews ? "news" : "event",
          category: category.value,
          dateEvent: dateEvent.value.trim(),
          links: extraLinks.map((item) => {
            return { label: item.label, link: item.link }
          }),
        },
      })
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

  const resetFormLink = () => {
    setFormLink((prevForm) =>
      prevForm.map((field) => {
        return { ...field, value: "" }
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
    if (activeEditItem) {
      setExtraLinks((prevLinks) =>
        prevLinks.map((item) => {
          if (item.link === activeEditItem) {
            return { label: label.value, link: link.value }
          }
          return item
        })
      )
      setActiveEditItem("")
    } else {
      setExtraLinks((prev) => [
        ...prev,
        { link: link.value, label: label.value },
      ])
    }
    resetFormLink()
  }

  const handleDeleteLink = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    linkAddress: string
  ) => {
    event.stopPropagation()
    if (linkAddress === activeEditItem) {
      setActiveEditItem("")
      resetFormLink()
    }
    setExtraLinks((prev) =>
      [...prev].filter((link) => link.link !== linkAddress)
    )
  }

  let options: { label: string; value: string }[] = []
  Object.keys(categories).forEach((key) => {
    if (key !== categories.all.keyWord) {
      options.push({
        // @ts-ignore
        label: categories[key].title,
        // @ts-ignore
        value: categories[key].keyWord,
      })
    }
  })

  const checkFormLinkFilled = () => {
    let check = true
    formLink.forEach((field) => {
      check = !!field.value.trim() && check
    })
    return check
  }

  const handleSetEditItem = (link: { label: string; link: string }) => {
    if (activeEditItem === link.link) {
      setActiveEditItem("")
      resetFormLink()
    } else {
      setActiveEditItem(link.link)
      setFormLink((prevForm) =>
        prevForm.map((field) => {
          if (field.param === "label") {
            return { ...field, value: link.label }
          } else if (field.param === "link") {
            return { ...field, value: link.link }
          }
          return field
        })
      )
    }
  }

  const handleDeleteNewsEvent = () => {
    deleteNewsEvent({
      variables: {
        contentId,
      },
    })
    dispatch({ type: WARNING_CLOSE })
  }

  const handlePopupWarning = () => {
    dispatch({
      type: WARNING_OPEN,
      payload: {
        action: handleDeleteNewsEvent,
        title: `Ви впевнені, що хочете назавжди видалити цю ${
          isNews ? "новину" : "подію"
        }?`,
      },
    })
  }

  const handleRefreshForms = () => {
    const editNewsEvent = dataDataEdit && dataDataEdit.getNewsEvent
    if (editNewsEvent) {
      setDataForms(editNewsEvent)
    }
  }

  const extraLinksJSX = extraLinks.map((link, index) => {
    return (
      <div
        className={`${stylesBtn.btn_link} ${
          activeEditItem === link.link && stylesBtn.btn_link__active
        }`}
        key={link.link + index}
        onClick={() => handleSetEditItem(link)}
      >
        <span className={stylesBtn.btn_link__title}>{link.label}</span>
        <button
          className={stylesBtn.btn_link__delete}
          onClick={(event) => handleDeleteLink(event, link.link)}
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
          change={setForm}
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
          change={setForm}
          isImportant
        />
      )
    }
    return (
      <Field key={field.param} field={field} change={setForm} isImportant />
    )
  })

  const fieldsLink = formLink.map((field) => {
    return <Field key={field.param} field={field} change={setFormLink} />
  })

  const isFormLinkFilled = checkFormLinkFilled()
  return (
    <div className='container'>
      <Title
        title={contentId ? "Редагування" : "Створення"}
        path='/edit-news-event'
      />
      <div className='wrapper-side'>
        <div className={styles.form}>
          <div
            className={`${styles.form__content} ${styles.form__content__article}`}
          >
            <div className={styles.form__title}>
              {contentId && (
                <ButtonTab
                  Icon={BsArrowLeft}
                  click={() =>
                    history.push(isNews ? "/create-news" : "/create-event")
                  }
                  exClass={styles.form__btn_back}
                />
              )}
              <div className={styles.form__title_text}>
                {contentId ? "Редагування " : "Створення "}
                {isNews ? "новини" : "події"}
              </div>
            </div>
            <form
              className={styles.form__container_fields}
              onSubmit={handleSubmitForm}
            >
              <LoaderData
                load={loadDataEdit || loadCreate || loadEdit || loadDelete}
              />
              <div className={styles.form__fields}>{fields}</div>
              <button className='btn-handler'></button>
            </form>
            <form
              className={styles.form__container_fields}
              onSubmit={
                isFormLinkFilled
                  ? handleAddExtraLink
                  : (event) => {
                      event.preventDefault()
                    }
              }
            >
              <LoaderData
                load={loadDataEdit || loadCreate || loadEdit || loadDelete}
              />
              <div className={styles.form__title_simple}>
                Додаткові посилання
              </div>
              <div className={styles.form__fields}>{fieldsLink}</div>
              <button className='btn-handler'></button>
              <div className={styles.form__btns}>
                <Button
                  title={
                    activeEditItem ? "Оновити посилання" : "Добавити посилання"
                  }
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
              {contentId && (
                <>
                  <Button
                    exClass={stylesBtn.btn_simple}
                    Icon={BsArrowClockwise}
                    click={handleRefreshForms}
                    type='button'
                  />
                  <Button
                    title='Видалити'
                    exClass={stylesBtn.btn_simple}
                    Icon={BsTrash}
                    click={handlePopupWarning}
                    type='button'
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <NewsEventsModuleContainer isNews={true}>
        {(items: INewsEventSlider[], loading: boolean, isNews: boolean) => (
          <NewsEventsModule items={items} loading={loading} isNews={isNews} />
        )}
      </NewsEventsModuleContainer>
      <FooterModule />
    </div>
  )
}

export default ModNewsEvent
