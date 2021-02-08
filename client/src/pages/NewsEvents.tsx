import React, { useState } from "react"
import { GET_NEWS_EVENTS } from "../fetching/queries"
import { useQuery } from "@apollo/client"
import Title from "../components/Title"
import { useLocation, useHistory, Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { RootStore } from "../redux/store"
import { INewsEvent } from "../interfaces"
import { BsImage } from "react-icons/bs"
import { getNewsParamsByKey } from "../modules/newsCategories"
// @ts-ignore
import styles from "../styles/newsevents.module"
import { categories } from "../modules/newsCategories"
import FilterSearch from "../components/FilterSearch"
import Pagination from "../components/Pagination"
import Loader from "../components/Loader"

const NewsEvents: React.FC = () => {
  const location = useLocation()
  const history = useHistory()
  const isNews = location.pathname === "/news"
  const params = new URLSearchParams(location.search)

  const {
    auth: { user },
  } = useSelector((state: RootStore) => state)

  let search = params.get("search") || ""
  const page = Number(params.get("page")) || 1
  const category = params.get("category") || "all"
  const from = params.get("from") || ""
  const to = params.get("to") || ""
  const amountItems = 3

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
      fetchPolicy: "cache-and-network",
    }
  )

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    getRedirectLink(
      page,
      categoryContent[0].value,
      date[0].value,
      date[1].value,
      searchStr
    )
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
    dataNewsEvents.getNewsEvents.items.map((item: INewsEvent) => {
      const linkPath = isNews
        ? `/news/details/${item.id}`
        : `/events/details/${item.id}`
      const linkParams = getNewsParamsByKey(item.category)
      return (
        <div className={styles.content} key={item.id}>
          <Link className={styles.content__preview} key={item.id} to={linkPath}>
            {item.preview ? (
              <img
                className={styles.content__image}
                src={item.preview.location}
                alt='image'
              />
            ) : (
              <div className={styles.content__icon}>
                <BsImage />
              </div>
            )}
          </Link>
          <div className={styles.content__main}>
            <div className={styles.content__date}>
              {item.date.split("-").join(" / ")}
            </div>
            <div>
              <Link className={styles.content__title} to={linkPath}>
                {item.title}
              </Link>
            </div>
            <div>
              <Link className={styles.content__categoty} to='/news'>
                {linkParams?.title}
              </Link>
            </div>
            <div className={styles.content__links}>
              {item.links.map((link, index) => {
                return (
                  <a
                    className={styles.content__link}
                    key={index}
                    href={link.link}
                  >
                    <span>{link.label}</span>
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      )
    })

  const quantityItems = dataNewsEvents && dataNewsEvents.getNewsEvents.quantity
  return (
    <div className='container'>
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
      />
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
    </div>
  )
}

export default NewsEvents
