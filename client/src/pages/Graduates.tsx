import React, { useState, useEffect, useCallback } from "react"
import Title from "../components/Title"
import ModSectionForm from "../components/ModSectionForm"
import FieldPicker from "../components/FieldPicker"
import FilterFrame from "../components/FilterFrame"
import { GET_PAGE_FILTERS, GET_PAGE_SECTIONS } from "../fetching/queries"
import { useQuery } from "@apollo/client"
import { useLocation, Link } from "react-router-dom"
import {
  IOption,
  IField,
  IPageSection,
  IPageSectionFilter,
} from "../interfaces"
import FieldSearch from "../components/FieldSearch"
import { useHistory } from "react-router-dom"
import Pagination from "../components/Pagination"
import Loader from "../components/Loader"
// @ts-ignore
import styles from "../styles/pages.module"
import PageSecion from "../components/PageSection"
import { BsImages } from "react-icons/bs"
import { convertContent } from "../helpers/convertContentEditor"
import SectionPerson from "../components/SectionPerson"

const Graduates: React.FC = () => {
  const { pathname } = useLocation()
  const history = useHistory()
  const params = new URLSearchParams(location.search)
  const amountItems = 1

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
    }
    if (group.length) {
      filters.push({ keyWord: "group", value: group })
    }
    return filters
  }

  const {
    data: dataFilters,
    loading: loadFilters,
    refetch: refetchFilters,
  } = useQuery(GET_PAGE_FILTERS, {
    variables: {
      url: pathname,
    },
  })

  const {
    data: dataSections,
    loading: loadSections,
    refetch: refetchSections,
  } = useQuery(GET_PAGE_SECTIONS, {
    variables: {
      search,
      filters: getFilters(year, group),
      from: (page - 1) * amountItems,
      to: amountItems,
      url: pathname,
    },
  })

  const [searchStr, setSearchStr] = useState(search)
  const [form, setForm] = useState<IField[]>([
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
  const [filters, setFilters] = useState<IField[]>([
    {
      param: "year",
      type: "text",
      value: year,
      title: "Рік",
      msg: "",
      options: [],
    },
    {
      param: "group",
      type: "text",
      value: group,
      title: "Клас",
      msg: "",
      options: [],
    },
  ])
  const [toggleCreate, setToggleCreate] = useState(false)

  const setFiltersValue = useCallback((keyWord: string, value: string) => {
    setFilters((prev) =>
      prev.map((field) => {
        if (field.param === keyWord) {
          return { ...field, value }
        }
        return field
      })
    )
  }, [])

  useEffect(() => {
    setFiltersValue("year", year)
  }, [setFiltersValue, year])

  useEffect(() => {
    setFiltersValue("group", group)
  }, [setFiltersValue, group])

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
    }
  }, [dataFilters])

  console.log({ dataSections })

  const filtersJSX =
    filters.length &&
    filters.map((field) => {
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

  const handleDeleteSection = () => {
    refetchFilters()
    refetchSections()
  }

  const handleEditSection = () => {
    refetchFilters()
    refetchSections()
  }

  const sections = dataSections && dataSections.getPageSections.items

  const sectionsJSX =
    sections &&
    sections.map((section: IPageSection) => {
      return (
        <PageSecion
          key={section.id}
          info={section}
          filters={section.filters.map((filter, index) => ({
            keyWord: filter.keyWord,
            value: filter.value,
            options: form[index].options,
            title: form[index].title,
          }))}
          onDelete={handleDeleteSection}
          onEdit={handleEditSection}
        >
          <SectionPerson
            refetchSections={refetchSections}
            info={section}
            link={{ title: "Рік", text: `${pathname}?year=` }}
            subtitle={{ title: "Клас", text: `${pathname}?group=` }}
          />
        </PageSecion>
      )
    })

  const quantityItems = dataSections && dataSections.getPageSections.quantity

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
        <div className='wrapper-clear'>
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
