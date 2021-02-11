import React, { useState } from "react"
import { IPageSection } from "../interfaces"

interface IPageSectionProps {
  info: IPageSection
}

const PageSection: React.FC<IPageSectionProps> = ({ info }) => {
  const [toggleFormEdit, setToggleFormEdit] = useState(false)

  return (
    <div>
      <div>Page section</div>
    </div>
  )
}

export default PageSection
