import React, { useState } from "react"
import { IPageSection } from "../interfaces"
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
  isActive: boolean
}

const PageSection: React.FC<IPageSectionProps> = ({ info, isActive }) => {
  const [toggleFormEdit, setToggleFormEdit] = useState(false)

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
    <div
      className={`${styles.section_tab} ${
        isActive && styles.section_tab__open
      }`}
    >
      {toggleFormEdit ? (
        <ModSectionForm
          data={info}
          onEdit={onEdit}
          onDelete={onDelete}
          toggleEdiForm={handleToggleEdiForm}
        />
      ) : (
        <div className='wrapper-text'>
          <ButtonTab
            exClass={styles.section_tab__btn_edit}
            click={handleToggleEdiForm}
            Icon={toggleFormEdit ? BsX : BsPencilSquare}
          />
          <PageSectionModule info={info} />
        </div>
      )}
    </div>
  )
}

export default PageSection
