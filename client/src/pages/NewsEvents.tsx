import React, { useState, useEffect } from "react"
import { GET_NEWS_EVENTS } from "../fetching/queries"
import { useQuery } from "@apollo/client"
import Title from "../components/Title"
import { useLocation, useHistory, Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { RootStore } from "../redux/store"
import { INewsEvent } from "../interfaces"
import { BsImage, BsPlus, BsSearch, BsX } from "react-icons/bs"
import { convertDate } from "../helpers/convertDate"
import { getNewsParamsByKey } from "../modules/newsCategories"
// @ts-ignore
import styles from "../styles/newsevents.module"
// @ts-ignore
import stylesForm from "../styles/form.module"
import ButtonTab from "../components/ButtonTab"
import FieldPicker from "../components/FieldPicker"
import { categories } from "../modules/newsCategories"
import { access } from "../modules/accessModifiers"
import FilterSearch from "../components/FilterSearch"

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
  const from = params.get("from")
  const to = params.get("to")
  const amountItems = 15

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

  const { data: dataNewsEvents, loading: loadNewsEvents } = useQuery(
    GET_NEWS_EVENTS,
    {
      variables: {
        search,
        type: isNews ? "news" : "event",
        category,
        dateFrom: from,
        dateTo: to,
        from: (page - 1) * amountItems,
        to: page * amountItems,
      },
    }
  )

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log("FORM SUBMITED!")
  }

  const handleRedirectCreateContent = () => {
    history.push(isNews ? "/create-news" : "/create-event")
  }

  const handleResetSearch = () => {
    console.log("ResetSearch!")
  }

  const options = Object.keys(categories).map((option) => {
    return {
      // @ts-ignore
      label: categories[option].title,
      // @ts-ignore
      value: categories[option].keyWord,
    }
  })

  console.log({ dataNewsEvents })
  const newsEventsJSX =
    dataNewsEvents &&
    dataNewsEvents.getNewsEvents.items.map((item: INewsEvent) => {
      const linkPath = isNews
        ? `/news/details/${item.id}`
        : `/events/details/${item.id}`
      const linkParams = getNewsParamsByKey(item.category)
      return (
        <div className={styles.content}>
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
            <div className={styles.content__date}>{convertDate(item.date)}</div>
            <Link className={styles.content__title} to={linkPath}>
              {item.title}
            </Link>
            <Link className={styles.content__categoty} to='/news'>
              {linkParams?.title}
            </Link>
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
      <Title title='Галерея' />
      <div className='wrapper'>
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
        />
        <div className={styles.content_wrapper}>{newsEventsJSX}</div>
      </div>
    </div>
  )
}

export default NewsEvents
