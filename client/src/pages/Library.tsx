import React, { useState, useEffect, useCallback, useRef } from "react"
import Title from "../components/Title"
import ModSectionForm from "../components/ModSectionForm"
import FieldPicker from "../components/FieldPicker"
import FilterFrame from "../components/FilterFrame"
import { GET_PAGE_FILTERS, GET_PAGE_SECTIONS_SHORT } from "../fetching/queries"
import { useQuery } from "@apollo/client"
import { useLocation } from "react-router-dom"
import { IOption, IField, IPageSection, INewsEventSlider } from "../interfaces"
import FieldSearch from "../components/FieldSearch"
import { useHistory } from "react-router-dom"
import Pagination from "../components/Pagination"
import Loader from "../components/Loader"
import { useSelector } from "react-redux"
import { RootStore } from "../redux/store"
import { access } from "../modules/accessModifiers"
import ItemInfoSection from "../components/ItemInfoSection"
// @ts-ignore
import styles from "../styles/pages.module"
import DesignLayout_3 from "../components/DesignLayout_3"
import NewsEventsModuleContainer from "../components/NewsEventsModuleContainer"
import NewsEventsModule from "../components/NewsEventsModule"
import FooterModule from "../components/FooterModule"

const Library: React.FC = () => {
  const anchor = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()
  const history = useHistory()
  const params = new URLSearchParams(location.search)
  const amountItems = 4

  let search = params.get("search") || ""
  const page = Number(params.get("page")) || 1
  const genre = params.get("genre") || "all"
  const group = params.get("group") || "all"

  const {
    auth: { user },
  } = useSelector((state: RootStore) => state)

  const getFilters = (genre: string, group: string) => {
    genre = genre === "all" ? "" : genre
    group = group === "all" ? "" : group

    let filters = []
    if (genre.length) {
      filters.push({ keyWord: "genre", value: genre })
    }
    if (group.length) {
      filters.push({ keyWord: "group", value: group })
    }
    return filters
  }

  const { data: dataFilters, refetch: refetchFilters } = useQuery(
    GET_PAGE_FILTERS,
    {
      variables: {
        url: pathname,
      },
      fetchPolicy: "cache-and-network",
    }
  )

  const {
    data: dataSections,
    loading: loadSections,
    refetch: refetchSections,
  } = useQuery(GET_PAGE_SECTIONS_SHORT, {
    variables: {
      search,
      filters: getFilters(genre, group),
      from: (page - 1) * amountItems,
      to: amountItems,
      url: pathname,
    },
  })

  const [searchStr, setSearchStr] = useState(search)
  const [form, setForm] = useState<IField[]>([
    {
      param: "genre",
      type: "text",
      value: "",
      title: "Предмет",
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
      param: "genre",
      type: "text",
      value: genre,
      title: "Предмет",
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
    anchor.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [])

  useEffect(() => {
    setFiltersValue("genre", genre)
  }, [setFiltersValue, genre])

  useEffect(() => {
    setFiltersValue("group", group)
  }, [setFiltersValue, group])

  useEffect(() => {
    let filters = dataFilters && dataFilters.getFilters

    const setOptions = (
      setForm: any,
      genres: IOption[],
      groups: IOption[],
      isForm: boolean
    ) => {
      setForm((prev: IField[]) =>
        prev.map((field: IField) => {
          if (field.param === "genre") {
            return {
              ...field,
              value: isForm || !genre ? genres[0].value : genre,
              options: genres,
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

    if (filters && filters.length) {
      let groups: string[] = []
      let genres: string[] = []

      for (let i = 0; i < filters.length; i++) {
        if (
          filters[i].keyWord === "genre" &&
          !genres.includes(filters[i].value)
        ) {
          genres.push(filters[i].value)
        } else if (
          filters[i].keyWord === "group" &&
          !groups.includes(filters[i].value)
        ) {
          groups.push(filters[i].value)
        }
      }

      const genreOptions = genres.map((item) => ({ label: item, value: item }))
      const groupOptions = groups.map((item) => ({ label: item, value: item }))
      setOptions(setForm, genreOptions, groupOptions, true)
      setOptions(
        setFilters,
        [{ label: "Усі", value: "all" }, ...genreOptions],
        [{ label: "Усі", value: "all" }, ...groupOptions],
        false
      )
    }
  }, [dataFilters])

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

  const getRedirectLink = (
    pageNumber: number,
    genre: string,
    group: string,
    searchStr?: string
  ) => {
    const searchQuery = `${searchStr ? "search=" + searchStr + "&" : ""}`

    let link = `${pathname}?page=${pageNumber}&genre=${genre}&group=${group}&${searchQuery}`
    history.push(link.slice(0, link.length - 1))
  }

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const [genre, group] = filters
    getRedirectLink(1, genre.value, group.value, searchStr)
  }

  const toggleCreateForm = () => {
    setToggleCreate((prev) => !prev)
  }

  const getRedirectPagination = (number: number) => {
    const [genre, group] = filters
    getRedirectLink(number, genre.value, group.value, search)
  }

  const handleResetSearch = () => {
    setSearchStr("")
    const [genre, group] = filters
    getRedirectLink(1, genre.value, group.value)
  }

  const checkSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if (!value) {
      handleResetSearch()
      return
    }
  }

  const handleCreate = () => {
    refetchFilters()
    refetchSections()
    setToggleCreate((prev) => !prev)
  }

  const sections = dataSections && dataSections.getPageSections.items

  const sectionsJSX =
    sections &&
    sections.map((section: IPageSection) => {
      return (
        <ItemInfoSection
          key={section.id}
          info={section}
          itemLink={`${pathname}/${section.id}`}
          link={{
            keyWord: "group",
            title: "Клас",
            text: `${pathname}?page=1&group=`,
          }}
          subtitle={{
            keyWord: "genre",
            title: "Жанр",
            text: `${pathname}?page=1&genre=`,
          }}
        />
      )
    })

  const quantityItems = dataSections && dataSections.getPageSections.quantity

  return (
    <div className='container'>
      <div ref={anchor}></div>
      <Title title='Бібліотека' />
      <FilterFrame
        numFilters={filters.length}
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
      {user.role === access.admin.keyWord && toggleCreate && (
        <ModSectionForm
          onCreate={handleCreate}
          filters={form}
          setFilters={setForm}
        />
      )}
      <DesignLayout_3>
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
              <div
                className={`${styles.page_wrapper} ${styles.page_wrapper__grid_4}`}
              >
                {sectionsJSX}
              </div>
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
      </DesignLayout_3>
      <NewsEventsModuleContainer isNews={true}>
        {(items: INewsEventSlider[], loading: boolean, isNews: boolean) => (
          <NewsEventsModule items={items} loading={loading} isNews={isNews} />
        )}
      </NewsEventsModuleContainer>
      <FooterModule />
    </div>
  )
}

export default Library
