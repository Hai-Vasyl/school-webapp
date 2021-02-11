import React, { useState } from "react"
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

interface ModSectionFormProps {
  sectionId?: string
}

const ModSectionForm: React.FC<ModSectionFormProps> = ({ sectionId }) => {
  const { pathname } = useLocation()

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
    { data: dataCreate, loading: loadCreate, error },
  ] = useMutation(CREATE_PAGE_SECTION)

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (sectionId) {
      console.log("EDIT_SECTION")
    }
    {
      // const [] = form
      // createPageSection({variables: {
      //   url: pathname,
      //   title: $title
      //   content: $content
      //   priority
      // }})
    }
  }

  const fields = form.map((field) => {
    if (field.param === "content") {
      return <FieldEditor field={field} change={setForm} />
    } else if (field.type === "number") {
      return <FieldNumber field={field} change={setForm} />
    }
    return <Field field={field} change={setForm} />
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
          {/* <LoaderData
                load={loadDataEdit || loadCreate || loadEdit || loadDelete}
              /> */}
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
