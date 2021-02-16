import React, { useState } from "react"
import { IPageSection, IField, IOption } from "../interfaces"
import ModSectionForm from "./ModSectionForm"
import PageSectionModule from "./PageSectionModule"
// @ts-ignore
import styles from "../styles/pages.module"
// @ts-ignore
import stylesBtn from "../styles/button.module"
import ButtonTab from "./ButtonTab"
import { BsPencilSquare, BsX } from "react-icons/bs"

interface IPageSectionProps {
  info: IPageSection
  filters: {
    keyWord: string
    title: string
    value: string
    options?: IOption[]
  }[]
  children: any
}

const PageSection: React.FC<IPageSectionProps> = ({
  info,
  children,
  filters,
}) => {
  const [toggleFormEdit, setToggleFormEdit] = useState(false)
  const [form, setForm] = useState<IField[]>(
    filters.map((filter) => ({
      param: filter.keyWord,
      type: "text",
      value: filter.value,
      title: filter.title,
      msg: "",
      options: filter.options,
      isImportant: true,
    }))
  )

  const onDelete = () => {
    console.log("DELETE")
  }

  const onEdit = () => {
    console.log("EDIT")
  }

  const handleToggleEdiForm = () => {
    setToggleFormEdit((prev) => !prev)
  }

  return (
    <div className={styles.section}>
      {toggleFormEdit ? (
        <ModSectionForm
          data={info}
          onEdit={onEdit}
          onDelete={onDelete}
          filters={form}
          setFilters={setForm}
          toggleEdiForm={handleToggleEdiForm}
        />
      ) : (
        <div className={styles.section__content}>
          <ButtonTab
            exClass={styles.section__btn_edit}
            Icon={BsPencilSquare}
            click={handleToggleEdiForm}
          />
          {children}
        </div>
      )}
    </div>
  )
}

export default PageSection
