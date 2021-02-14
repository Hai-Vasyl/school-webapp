import React, { useState } from "react"
import Title from "../components/Title"
import ModSectionForm from "../components/ModSectionForm"

const Graduates: React.FC = () => {
  const [filters, setFilters] = useState([
    {
      param: "year",
      type: "text",
      value: "",
      title: "Рік",
      msg: "",
      options: [],
      isImportant: true,
    },
    {
      param: "group",
      type: "text",
      value: "",
      title: "Клас",
      msg: "",
      options: [],
      isImportant: true,
    },
  ])

  return (
    <div className='container'>
      <Title title='Випускники' />
      <ModSectionForm filters={filters} setFilters={setFilters} />
    </div>
  )
}

export default Graduates
