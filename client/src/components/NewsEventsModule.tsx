import React from "react"
import NewsEvent from "./NewsEvent"
import { GET_NEWS_EVENTS } from "../fetching/queries"
import { useQuery } from "@apollo/client"
import Loader from "./Loader"
import { INewsEvent } from "../interfaces"
// @ts-ignore
import styles from "../styles/newsevents.module"
// @ts-ignore
import stylesBtn from "../styles/button.module"
import Button from "./Button"
import { BsArrowRightShort } from "react-icons/bs"
import { useHistory } from "react-router-dom"

interface INewsEventsModuleProps {
  isNews: boolean
  exceptId: string
}

const NewsEventsModule: React.FC<INewsEventsModuleProps> = ({
  isNews,
  exceptId,
}) => {
  const history = useHistory()
  const { data: newsEvents, loading } = useQuery(GET_NEWS_EVENTS, {
    variables: {
      search: "",
      type: isNews ? "news" : "event",
      category: null,
      dateFrom: null,
      dateTo: null,
      from: 0,
      to: 3,
      exceptId,
    },
  })

  const items = newsEvents ? newsEvents.getNewsEvents.items : []
  return (
    <div className={styles.newsevents_module}>
      <div className='wrapper'>
        <h3 className={styles.newsevents_module__title}>
          Останні {isNews ? "новини" : "події"}
        </h3>
        <div
          className={`${styles.content_wrapper} ${
            loading && styles.content_wrapper__load
          }`}
        >
          {loading ? (
            <Loader />
          ) : (
            items.map((item: INewsEvent) => {
              return <NewsEvent key={item.id} info={item} isNews={isNews} />
            })
          )}
        </div>
        <div className={styles.newsevents_module__more}>
          <Button
            click={() => history.push(isNews ? "/news" : "/events")}
            title={`Більше ${isNews ? "новин" : "подій"}`}
            Icon={BsArrowRightShort}
            exClass={`${stylesBtn.btn_simple} ${stylesBtn.btn__reverse_icon}`}
          />
        </div>
      </div>
    </div>
  )
}

export default NewsEventsModule
