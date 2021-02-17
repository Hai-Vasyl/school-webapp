import React, { useState, useEffect, useCallback } from "react"
import { IPageSection, IField, IOption } from "../interfaces"
import ModSectionForm from "./ModSectionForm"
// import PageSectionModule from "./PageSectionModule"
// @ts-ignore
import styles from "../styles/pages.module"
// @ts-ignore
import stylesBtn from "../styles/button.module"
import ButtonTab from "./ButtonTab"
import { BsPencilSquare, BsX } from "react-icons/bs"
import { useSelector } from "react-redux"
import { RootStore } from "../redux/store"
import { access } from "../modules/accessModifiers"

interface IFilterField {
  keyWord: string
  title: string
  value: string
  options?: IOption[]
}

interface IPageSectionProps {
  info: IPageSection
  filters: IFilterField[]
  children: any
  onDelete?: any
  onEdit?: any
}

const PageSection: React.FC<IPageSectionProps> = ({
  info,
  children,
  filters,
  onDelete,
  onEdit,
}) => {
  const {
    auth: { user },
  } = useSelector((state: RootStore) => state)

  const [toggleFormEdit, setToggleFormEdit] = useState(false)
  const [form, setForm] = useState<IField[]>([])

  const setInitFilters = useCallback((filters: IFilterField[]) => {
    setForm(
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
  }, [])

  useEffect(() => {
    if (filters.length) {
      setInitFilters(filters)
    }
  }, [filters, setInitFilters])

  const handleToggleEdiForm = () => {
    setToggleFormEdit((prev) => !prev)
  }

  const handleDelete = () => {
    onDelete()
  }

  const handleEdit = () => {
    onEdit()
    handleToggleEdiForm()
  }

  return (
    <div className={styles.section}>
      {toggleFormEdit ? (
        <ModSectionForm
          data={info}
          onEdit={handleEdit}
          onDelete={handleDelete}
          filters={form}
          setFilters={setForm}
          toggleEdiForm={handleToggleEdiForm}
          resetFilters={() => setInitFilters(filters)}
        />
      ) : (
        <div className={styles.section__content}>
          {user.role === access.admin.keyWord && (
            <ButtonTab
              exClass={styles.section__btn_edit}
              Icon={BsPencilSquare}
              click={handleToggleEdiForm}
            />
          )}
          {children}
        </div>
      )}
    </div>
  )
}

export default PageSection
