import React, { useState, useEffect, useCallback, useRef } from "react"
import { GET_NEWS_EVENTS } from "../fetching/queries"
import { useQuery } from "@apollo/client"
import Title from "../components/Title"
import { useLocation, useHistory } from "react-router-dom"
import { INewsEventSlider, IField } from "../interfaces"
// @ts-ignore
import styles from "../styles/newsevents.module"
import { categories } from "../modules/newsCategories"
import FilterSearch from "../components/FilterSearch"
import Pagination from "../components/Pagination"
import Loader from "../components/Loader"
import NewsEvent from "../components/NewsEvent"
import DesignLayout_3 from "../components/DesignLayout_3"
import NewsEventsModuleContainer from "../components/NewsEventsModuleContainer"
import NewsEventsModule from "../components/NewsEventsModule"
import FooterModule from "../components/FooterModule"

const NewsEvents: React.FC = () => {
  const anchor = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const history = useHistory()
  const isNews = location.pathname === "/news"
  const params = new URLSearchParams(location.search)

  let search = params.get("search") || ""
  const page = Number(params.get("page")) || 1
  const category = params.get("category") || "all"
  const from = params.get("from") || ""
  const to = params.get("to") || ""
  const amountItems = 3

  const [isDateError, setIsDateError] = useState(false)
  const [searchStr, setSearchStr] = useState(search)
  const [categoryContent, setCategoryContent] = useState([
    {
      param: "type",
      type: "text",
      value: category,
      title: "Категорія",
      msg: "",
    },
  ])
  const [date, setDate] = useState([
    {
      param: "from",
      type: "date",
      value: from,
      title: "Дата від",
      msg: "",
    },
    {
      param: "to",
      type: "date",
      value: to,
      title: "Дата до",
      msg: "",
    },
  ])

  const { data: dataNewsEvents, loading: loadNewsEvents } = useQuery(
    GET_NEWS_EVENTS,
    {
      variables: {
        search,
        type: isNews ? "news" : "event",
        category: category === "all" ? "" : category,
        dateFrom: from,
        dateTo: to,
        from: (page - 1) * amountItems,
        to: amountItems,
      },
    }
  )

  const setFilterValue = useCallback(
    (setState: any, keyWord: string, value: string) => {
      setState((prev: IField[]) =>
        prev.map((field) => {
          if (field.param === keyWord) {
            return { ...field, value }
          }
          return field
        })
      )
    },
    []
  )

  useEffect(() => {
    anchor.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [])

  useEffect(() => {
    setFilterValue(setDate, "from", from)
  }, [from])

  useEffect(() => {
    setFilterValue(setDate, "to", to)
  }, [to])

  useEffect(() => {
    setFilterValue(setCategoryContent, "type", category)
  }, [category])

  const onChangeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    const from = date[0] && date[0].value
    const to = date[1] && date[1].value

    if (
      (name === "from" && new Date(value) > new Date(to)) ||
      (name === "to" && new Date(value) < new Date(from))
    ) {
      setIsDateError(true)
    } else {
      setIsDateError(false)
    }
  }

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (date[0].value <= date[1].value) {
      getRedirectLink(
        1,
        categoryContent[0].value,
        date[0].value,
        date[1].value,
        searchStr
      )
    }
  }

  const handleRedirectCreateContent = () => {
    history.push(isNews ? "/create-news" : "/create-event")
  }

  const getRedirectLink = (
    pageNumber: number,
    category: string,
    dateFrom?: string,
    dateTo?: string,
    searchStr?: string
  ) => {
    const fromQuery = `${dateFrom ? "from=" + dateFrom + "&" : ""}`
    const toQuery = `${dateTo ? "to=" + dateTo + "&" : ""}`
    const searchQuery = `${searchStr ? "search=" + searchStr + "&" : ""}`

    let link = `/${
      isNews ? "news" : "events"
    }?page=${pageNumber}&category=${category}&${fromQuery}${toQuery}${searchQuery}`
    history.push(link.slice(0, link.length - 1))
  }

  const getRedirectPagination = (number: number) => {
    getRedirectLink(number, categoryContent[0].value, from, to, search)
  }

  const handleResetSearch = () => {
    setSearchStr("")
    getRedirectLink(1, categoryContent[0].value, from, to)
  }

  const options = Object.keys(categories).map((option) => {
    return {
      // @ts-ignore
      label: categories[option].title,
      // @ts-ignore
      value: categories[option].keyWord,
    }
  })

  const newsEventsJSX =
    dataNewsEvents &&
    dataNewsEvents.getNewsEvents.items.map((item: INewsEventSlider) => {
      return <NewsEvent key={item.id} info={item} isNews={isNews} />
    })

  const quantityItems = dataNewsEvents && dataNewsEvents.getNewsEvents.quantity
  return (
    <div className='container'>
      <div ref={anchor}></div>
      <Title title={isNews ? "Усі новини" : "Усі події"} />
      <FilterSearch
        handleSubmit={handleSubmitForm}
        quantityItems={quantityItems}
        search={search}
        searchStr={searchStr}
        options={options}
        onClickBtnPlus={handleRedirectCreateContent}
        handleResetSearch={handleResetSearch}
        setSearchStr={setSearchStr}
        setFormPicker={setCategoryContent}
        fieldPicker={categoryContent[0]}
        fieldDateFrom={date[0]}
        fieldDateTo={date[1]}
        setFormDate={setDate}
        onChangeDate={onChangeDate}
        isDateError={isDateError}
        setIsDateError={setIsDateError}
      />
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
          <div
            className={`${styles.content_wrapper} ${
              (loadNewsEvents || !(newsEventsJSX && newsEventsJSX.length)) &&
              styles.content_wrapper__load
            }`}
          >
            {loadNewsEvents ? (
              <Loader />
            ) : newsEventsJSX.length ? (
              newsEventsJSX
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
      <NewsEventsModuleContainer isNews={!isNews}>
        {(items: INewsEventSlider[], loading: boolean, isNews: boolean) => (
          <NewsEventsModule items={items} loading={loading} isNews={isNews} />
        )}
      </NewsEventsModuleContainer>
      <FooterModule />
    </div>
  )
}

export default NewsEvents
