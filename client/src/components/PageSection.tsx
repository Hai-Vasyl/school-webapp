import React, { useState } from "react"
import { IPageSection } from "../interfaces"
import ModSectionForm from "./ModSectionForm"
import PageSectionModule from "./PageSectionModule"

interface IPageSectionProps {
  info: IPageSection
}

const PageSection: React.FC<IPageSectionProps> = ({ info }) => {
  const [toggleFormEdit, setToggleFormEdit] = useState(false)

  const onDelete = () => {
    console.log("DELETE")
  }

  const onEdit = () => {
    console.log("EDIT")
  }

  return (
    <div>
      {toggleFormEdit ? (
        <ModSectionForm onEdit={onEdit} onDelete={onDelete} />
      ) : (
        <PageSectionModule info={info} />
      )}
    </div>
  )
}

export default PageSection
