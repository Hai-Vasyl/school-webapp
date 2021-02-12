import React, { useState, useEffect } from "react"
// @ts-ignore
import styles from "../styles/form.module"
// @ts-ignore
import stylesBtn from "../styles/button.module"
import LoaderData from "../components/LoaderData"
import { CREATE_PAGE_SECTION } from "../fetching/mutations"
import { useMutation, useQuery } from "@apollo/client"
import { useLocation } from "react-router-dom"
import Field from "./Field"
import FieldNumber from "./FieldNumber"
import FieldEditor from "./FieldEditor"
import Button from "./Button"
import { BsPencil, BsPlus } from "react-icons/bs"
import useSetErrorsFields from "../hooks/useSetErrorsFields"
import { useDispatch } from "react-redux"
import { SET_TOAST } from "../redux/toasts/toastsTypes"
import { types } from "../modules/messageTypes"

interface ModSectionFormProps {
  sectionId?: string
  onCreate?(): any
  onDelete?(): any
  onEdit?(): any
}

const ModSectionForm: React.FC<ModSectionFormProps> = ({
  sectionId,
  onCreate,
  onDelete,
  onEdit,
}) => {
  const { pathname } = useLocation()
  const dispatch = useDispatch()

  const [form, setForm] = useState([
    {
      param: "title",
      type: "text",
      value: "",
      title: "Заголовок",
      msg: "",
    },
    {
      param: "content",
      type: "text",
      value: "",
      title: "Категорія",
      msg: "",
    },
    {
      param: "priority",
      type: "number",
      value: "0",
      title: "Пріорітет",
      msg: "",
    },
  ])

  const [
    createPageSection,
    { data: dataCreate, loading: loadCreate, error: errorCreate },
  ] = useMutation(CREATE_PAGE_SECTION)

  const { setErrors } = useSetErrorsFields()

  useEffect(() => {
    const data = dataCreate && dataCreate.createPageSection
    if (errorCreate) {
      setErrors(errorCreate.message, setForm)
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

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const [title, content, priority] = form

    if (sectionId) {
      console.log("EDIT_SECTION")
    } else {
      createPageSection({
        variables: {
          url: pathname,
          title: title.value.trim(),
          content: content.value.trim(),
          priority: Number(priority.value),
        },
      })
    }
  }

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
          <div className={styles.form__title_text}>
            {sectionId ? "Редагування розділу" : "Створення розділу"}
          </div>
        </div>
        <form
          className={styles.form__container_fields}
          onSubmit={handleSubmitForm}
        >
          <LoaderData load={loadCreate} />
          <div className={styles.form__fields}>{fields}</div>
          <div className={styles.form__btns}>
            <Button
              title={sectionId ? "Застосувати зміни" : "Створити розділ"}
              exClass={stylesBtn.btn_primary}
              Icon={sectionId ? BsPencil : BsPlus}
            />
            {/* {contentId && (
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
              )} */}
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModSectionForm
