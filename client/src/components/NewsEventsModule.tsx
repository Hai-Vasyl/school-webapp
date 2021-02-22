import React from "react"
import NewsEvent from "./NewsEvent"
import { GET_NEWS_EVENTS } from "../fetching/queries"
import { useQuery } from "@apollo/client"
import Loader from "./Loader"
import { INewsEvent } from "../interfaces"
// @ts-ignore
import styles from "../styles/pages.module"
// @ts-ignore
import stylesBtn from "../styles/button.module"
import Button from "./Button"
import { BsArrowRightShort } from "react-icons/bs"
import { useHistory, Link } from "react-router-dom"

interface INewsEventsModuleProps {
  isNews: boolean
  exceptId?: string
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
        {/* <div className={styles.module__more}>
          <Button
            click={() => history.push()}
            title={`Більше ${isNews ? "новин" : "подій"}`}
            Icon={BsArrowRightShort}
            exClass={`${stylesBtn.btn_simple} ${stylesBtn.btn__reverse_icon}`}
          />
        </div> */}
      </div>
    </div>
  )
}

export default NewsEventsModule
