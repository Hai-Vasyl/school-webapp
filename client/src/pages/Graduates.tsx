import React, { useState, useEffect } from "react"
import Title from "../components/Title"
import ModSectionForm from "../components/ModSectionForm"
import Field from "../components/Field"
import FieldPicker from "../components/FieldPicker"
import FilterFrame from "../components/FilterFrame"
import { GET_PAGE_FILTERS, GET_PAGE_SECTIONS } from "../fetching/queries"
import { useQuery } from "@apollo/client"
import { useLocation } from "react-router-dom"
import { IOption, IField, IPageSection } from "../interfaces"
import FieldSearch from "../components/FieldSearch"
import { useHistory } from "react-router-dom"
import Pagination from "../components/Pagination"
import Loader from "../components/Loader"
// @ts-ignore
import styles from "../styles/pages.module"
import PageSecion from "../components/PageSection"

const Graduates: React.FC = () => {
  const { pathname } = useLocation()
  const history = useHistory()
  const params = new URLSearchParams(location.search)
  const amountItems = 3
  // console.log({ pathname })
  let search = params.get("search") || ""
  const page = Number(params.get("page")) || 1
  const year = params.get("year") || "all"
  const group = params.get("group") || "all"

  const getFilters = (year: string, group: string) => {
    year = year === "all" ? "" : year
    group = group === "all" ? "" : group

    let filters = []
    if (year.length) {
      filters.push({ keyWord: "year", value: year })
    } else if (group.length) {
      filters.push({ keyWord: "group", value: group })
    }
    return filters
  }

  const { data: dataFilters, loading: loadFilters } = useQuery(
    GET_PAGE_FILTERS,
    {
      variables: {
        url: pathname,
      },
    }
  )
  const { data: dataSections, loading: loadSections } = useQuery(
    GET_PAGE_SECTIONS,
    {
      variables: {
        search,
        filters: getFilters(year, group),
        from: (page - 1) * amountItems,
        to: amountItems,
        url: pathname,
      },
    }
  )

  const [searchStr, setSearchStr] = useState(search)
  const [form, setForm] = useState<IField[]>([
    {
      param: "year",
      type: "text",
      value: year,
      title: "Рік",
      msg: "",
      options: [],
      isImportant: true,
    },
    {
      param: "group",
      type: "text",
      value: group,
      title: "Клас",
      msg: "",
      options: [],
      isImportant: true,
    },
  ])
  const [filters, setFilters] = useState<IField[]>([
    {
      param: "year",
      type: "text",
      value: "",
      title: "Рік",
      msg: "",
      options: [],
    },
    {
      param: "group",
      type: "text",
      value: "",
      title: "Клас",
      msg: "",
      options: [],
    },
  ])
  const [toggleCreate, setToggleCreate] = useState(false)

  useEffect(() => {
    let filters = dataFilters && dataFilters.getFilters

    const setOptions = (
      setForm: any,
      years: IOption[],
      groups: IOption[],
      isForm: boolean
    ) => {
      setForm((prev: IField[]) =>
        prev.map((field: IField) => {
          if (field.param === "year") {
            return {
              ...field,
              value: isForm || !year ? years[0].value : year,
              options: years,
            }
          } else if (field.param === "group") {
            return {
              ...field,
              value: isForm || !group ? groups[0].value : group,
              options: groups,
            }
          }
          return field
        })
      )
    }

    if (filters) {
      let groups: string[] = []
      let years: string[] = []

      for (let i = 0; i < filters.length; i++) {
        if (
          filters[i].keyWord === "year" &&
          !years.includes(filters[i].value)
        ) {
          years.push(filters[i].value)
        } else if (
          filters[i].keyWord === "group" &&
          !groups.includes(filters[i].value)
        ) {
          groups.push(filters[i].value)
        }
      }

      const yearOptions = years.map((item) => ({ label: item, value: item }))
      const groupOptions = groups.map((item) => ({ label: item, value: item }))
      setOptions(setForm, yearOptions, groupOptions, true)
      setOptions(
        setFilters,
        [{ label: "Усі", value: "all" }, ...yearOptions],
        [{ label: "Усі", value: "all" }, ...groupOptions],
        false
      )

      // setForm((prev) =>
      //   prev.map((field) => {
      //     if (field.param === "year") {
      //       return { ...field, value: years[0], options: yearOptions }
      //     } else if (field.param === "group") {
      //       return { ...field, value: groups[0], options: groupOptions }
      //     }
      //     return field
      //   })
      // )
      // setFilters((prev) =>
      //   prev.map((field) => {
      //     if (field.param === "year") {
      //       return { ...field, value: years[0], options: yearOptions }
      //     } else if (field.param === "group") {
      //       return { ...field, value: groups[0], options: groupOptions }
      //     }
      //     return field
      //   })
      // )

      // setYears(years.map((item) => ({ label: item, value: item })))
      // setGroups(groups.map((item) => ({ label: item, value: item })))
      // for (let i = 0; i < filters.length; i++) {
      //   if(filters[i].keyWord === "year"){
      //     if(itemYear === filters[i].value){
      //       sections.push(filters[i].section)
      //     }
      //     if(!years.includes(filters[i].value)){
      //       years.push(filters[i].value)
      //     }
      //   }else if(filters[i].keyWord === "group"){
      //     if(sections.includes(filters[i].section) ){
      //       if(!groups.includes(filters[i].value)){
      //         groups.push(filters[i].value)
      //       }
      //     }
      //   }
      // }
    }
  }, [dataFilters])

  console.log({ dataSections })
  // console.log({ dataFilters })

  const filtersJSX = filters.map((field) => {
    return (
      <FieldPicker
        key={field.param}
        submit
        field={field}
        change={setFilters}
        noError
        options={field.options || []}
      />
    )
  })

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log("SUBMITED")
    const [year, group] = filters
    getRedirectLink(1, year.value, group.value, searchStr)
  }

  const getRedirectLink = (
    pageNumber: number,
    year: string,
    group: string,
    searchStr?: string
  ) => {
    const searchQuery = `${searchStr ? "search=" + searchStr + "&" : ""}`

    let link = `${pathname}?page=${pageNumber}&year=${year}&group=${group}&${searchQuery}`
    history.push(link.slice(0, link.length - 1))
  }

  const toggleCreateForm = () => {
    setToggleCreate((prev) => !prev)
  }

  const getRedirectPagination = (number: number) => {
    const [year, group] = filters
    getRedirectLink(number, year.value, group.value, search)
  }

  const handleResetSearch = () => {
    setSearchStr("")
    const [year, group] = filters
    getRedirectLink(1, year.value, group.value)
  }

  const checkSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if (!value) {
      handleResetSearch()
      return
    }
  }

  const sections = dataSections && dataSections.getPageSections.items

  // info,
  // children,
  // filters

  const sectionsJSX =
    sections &&
    sections.map((section: IPageSection) => {
      return (
        <PageSecion
          info={section}
          filters={section.filters.map((filter, index) => ({
            keyWord: filter.keyWord,
            value: filter.value,
            options: form[index].options,
            title: form[index].title,
          }))}
        >
          <div>{section.title}</div>
        </PageSecion>
      )
    })

  const quantityItems = dataSections && dataSections.getPageSections.quantity

  console.log({ form, filters })
  return (
    <div className='container'>
      <Title title='Випускники' />
      <FilterFrame
        onCreate={toggleCreateForm}
        toggle={toggleCreate}
        submit={handleSubmitForm}
        quantity={quantityItems}
        search={search}
      >
        <FieldSearch
          resetSearch={handleResetSearch}
          search={search}
          check={checkSearch}
          searchStr={searchStr}
          change={setSearchStr}
        />
        {filtersJSX}
      </FilterFrame>
      {toggleCreate && <ModSectionForm filters={form} setFilters={setForm} />}
      <div className='wrapper'>
        {!!quantityItems && (
          <Pagination
            getRedirectLink={getRedirectPagination}
            quantityItem={quantityItems}
            amountItemsPage={amountItems}
            currentPageNumber={page}
            isTop
          />
        )}
        <div className={styles.page__content}>
          {loadSections ? (
            <Loader />
          ) : sections.length ? (
            sectionsJSX
          ) : (
            <div className='plug-text'>Порожньо</div>
          )}
        </div>
        {!!quantityItems && (
          <Pagination
            getRedirectLink={getRedirectPagination}
            quantityItem={quantityItems}
            amountItemsPage={amountItems}
            currentPageNumber={page}
          />
        )}
      </div>
    </div>
  )
}

export default Graduates
