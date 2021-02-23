import React from "react"
import NewsEvent from "./NewsEvent"
import { GET_NEWS_EVENTS } from "../fetching/queries"
import { useQuery } from "@apollo/client"
import Loader from "./Loader"
import { INewsEvent } from "../interfaces"
// @ts-ignore
import styles from "../styles/pages.module"
import { Link } from "react-router-dom"

interface INewsEventsModuleProps {
  isNews: boolean
  exceptId?: string
}

const NewsEventsModule: React.FC<INewsEventsModuleProps> = ({
  isNews,
  exceptId,
}) => {
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
    <div className={styles.module}>
      <div className='wrapper'>
        <div>
          <Link
            to={isNews ? "/news" : "/events"}
            className={styles.module__title}
          >
            Останні {isNews ? "новини" : "події"}
          </Link>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`${styles.page_wrapper} ${styles.page_wrapper__grid_3}`}
          >
            {items.map((item: INewsEvent) => {
              return <NewsEvent key={item.id} info={item} isNews={isNews} />
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default NewsEventsModule
