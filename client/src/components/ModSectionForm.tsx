import React, { useState, useEffect } from "react"
// @ts-ignore
import styles from "../styles/form.module"
// @ts-ignore
import stylesBtn from "../styles/button.module"
import LoaderData from "../components/LoaderData"
import {
  CREATE_PAGE_SECTION,
  EDIT_PAGE_SECTION,
  DELETE_PAGE_SECTION,
} from "../fetching/mutations"
import { useMutation } from "@apollo/client"
import { useLocation } from "react-router-dom"
import Field from "./Field"
import FieldNumber from "./FieldNumber"
import FieldEditor from "./FieldEditor"
import Button from "./Button"
import {
  BsPencil,
  BsPlus,
  BsArrowLeft,
  BsArrowClockwise,
  BsTrash,
} from "react-icons/bs"
import useSetErrorsFields from "../hooks/useSetErrorsFields"
import { useDispatch } from "react-redux"
import { SET_TOAST } from "../redux/toasts/toastsTypes"
import { types } from "../modules/messageTypes"
import { IPageSection, IField, IPageSectionFilter } from "../interfaces"
import ButtonTab from "./ButtonTab"
import FieldFliper from "./FieldFliper"
import { WARNING_OPEN, WARNING_CLOSE } from "../redux/toggle/toggleTypes"

interface ModSectionFormProps {
  data?: IPageSection
  toggleEdiForm?: any
  filters?: IField[]
  setFilters?: any
  onCreate?(): any
  onDelete?(): any
  onEdit?(): any
  resetFilters?(): any
  isOptContent?: boolean
}

const ModSectionForm: React.FC<ModSectionFormProps> = ({
  data,
  toggleEdiForm,
  filters,
  setFilters,
  onCreate,
  onDelete,
  onEdit,
  resetFilters,
  isOptContent
}) => {
  const { pathname } = useLocation()
  const dispatch = useDispatch()

  const [form, setForm] = useState([
    {
      param: "title",
      type: "text",
      value: data ? data.title : "",
      title: "Заголовок",
      msg: "",
    },
    {
      param: "content",
      type: "text",
      value: data ? data.content : "",
      title: "Контент",
      msg: "",
    },
    {
      param: "priority",
      type: "number",
      value: data ? data?.priority : "0",
      title: "Пріорітет",
      msg: "",
    },
  ])

  const [
    createPageSection,
    { data: dataCreate, loading: loadCreate, error: errorCreate,  },
  ] = useMutation(CREATE_PAGE_SECTION)
  const [
    editPageSection,
    { data: dataEdit, loading: loadEdit, error: errorEdit },
  ] = useMutation(EDIT_PAGE_SECTION)
  const [
    deletePageSection,
    { data: dataDelete, loading: loadDelete },
  ] = useMutation(DELETE_PAGE_SECTION)

  const { setErrors } = useSetErrorsFields()

  useEffect(() => {
    const data = dataCreate && dataCreate.createPageSection
    if (errorCreate) {
      setErrors(errorCreate.message, setForm)
      setFilters && setErrors(errorCreate.message, setFilters)
      dispatch({
        type: SET_TOAST,
        payload: {
          type: types.error.keyWord,
          message: "Помилка перевірки полів форми!",
        },
      })
    } else if (data) {
      dispatch({
        type: SET_TOAST,
        payload: data,
      })
      onCreate && onCreate()
    }
  }, [dispatch, dataCreate, errorCreate])

  useEffect(() => {
    const data = dataEdit && dataEdit.editPageSection
    if (errorEdit) {
      setErrors(errorEdit.message, setForm)
      setErrors(errorEdit.message, setFilters)
      dispatch({
        type: SET_TOAST,
        payload: {
          type: types.error.keyWord,
          message: "Помилка перевірки полів форми!",
        },
      })
    } else if (data) {
      dispatch({
        type: SET_TOAST,
        payload: data,
      })
      onEdit && onEdit()
    }
  }, [dispatch, dataEdit, errorEdit])

  const findFilterParams = (filters: IPageSectionFilter[], keyWord: string) => {
    return filters.find((filter) => filter.keyWord === keyWord)
  }

  useEffect(() => {
    const data = dataDelete && dataDelete.deletePageSection
    if (data) {
      dispatch({
        type: SET_TOAST,
        payload: data,
      })
      onDelete && onDelete()
    }
  }, [dispatch, dataDelete])

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const [title, content, priority] = form

    if (data) {
      editPageSection({
        variables: {
          sectionId: data.id,
          title: title.value.trim(),
          content: content.value.trim(),
          priority: Number(priority.value),
          filters: filters
            ? filters.map((field) => ({
                filterId: findFilterParams(data.filters, field.param)?.id,
                keyWord: field.param,
                value: field.value.trim(),
              }))
            : [],
        },
      })
    } else {
      createPageSection({
        variables: {
          url: pathname,
          title: title.value.trim(),
          content: content.value.trim(),
          priority: Number(priority.value),
          optContent: isOptContent,
          filters: filters
            ? filters.map((field) => ({
                keyWord: field.param,
                value: field.value.trim(),
              }))
            : [],
        },
      })
    }
  }

  const handleRefreshForm = () => {
    if (data && data.id) {
      setForm((prev) =>
        prev.map((field) => {
          let newField = field
          Object.keys(data).map((key) => {
            if (field.param === key) {
              // @ts-ignore
              newField = { ...field, value: data[key], msg: "" }
            }
          })
          return newField
        })
      )
      resetFilters && resetFilters()
    }
  }

  const handleDeleteNewsEvent = () => {
    deletePageSection({
      variables: {
        sectionId: data?.id,
      },
    })
    dispatch({ type: WARNING_CLOSE })
  }

  const handlePopupWarning = () => {
    dispatch({
      type: WARNING_OPEN,
      payload: {
        action: handleDeleteNewsEvent,
        title: "Ви впевнені, що хочете назавжди видалити розділ?",
      },
    })
  }

  const filtersJSX =
    filters &&
    filters.map((filter) => {
      return (
        <FieldFliper
          key={filter.param}
          defaultField={
            data ? findFilterParams(data.filters, filter.param)?.value : ""
          }
          field={filter}
          change={setFilters}
        />
      )
    })

  const fields = form.map((field) => {
    if (field.param === "content") {
      return <FieldEditor key={field.param} field={field} change={setForm} />
    } else if (field.type === "number") {
      return <FieldNumber key={field.param} field={field} change={setForm} />
    }
    return <Field key={field.param} field={field} change={setForm} />
  })

  return (
    <div className={styles.form}>
      <div
        className={`${styles.form__content} ${styles.form__content__article}`}
      >
        <div className={styles.form__title}>
          {data && (
            <ButtonTab
              Icon={BsArrowLeft}
              click={toggleEdiForm}
              exClass={styles.form__btn_back}
            />
          )}
          <div className={styles.form__title_text}>
            {data ? "Редагування розділу" : "Створення розділу"}
          </div>
        </div>
        <form
          className={styles.form__container_fields}
          onSubmit={handleSubmitForm}
        >
          <LoaderData load={loadCreate || loadEdit || loadDelete} />
          <div className={styles.form__fields}>
            {fields}
            {filtersJSX}
          </div>
          <div className={styles.form__btns}>
            <Button
              title={data ? "Застосувати зміни" : "Створити розділ"}
              exClass={stylesBtn.btn_primary}
              Icon={data ? BsPencil : BsPlus}
            />
            {data && (
              <>
                <Button
                  exClass={stylesBtn.btn_simple}
                  Icon={BsArrowClockwise}
                  click={handleRefreshForm}
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
        </form>
      </div>
    </div>
  )
}

export default ModSectionForm
