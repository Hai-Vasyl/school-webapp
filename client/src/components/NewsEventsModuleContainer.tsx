import React from "react"
import NewsEvent from "./NewsEvent"
import { GET_NEWS_EVENTS_DETAILED } from "../fetching/queries"
import { useQuery } from "@apollo/client"
import Loader from "./Loader"
import { INewsEventSlider } from "../interfaces"
// @ts-ignore
import styles from "../styles/pages.module"
import { Link } from "react-router-dom"

interface INewsEventsModuleContainerProps {
  isNews: boolean
  exceptId?: string
  from?: number
  children: any
}

const NewsEventsModuleContainer: React.FC<INewsEventsModuleContainerProps> = ({
  isNews,
  exceptId,
  from = 0,
  children,
}) => {
  const { data: newsEvents, loading } = useQuery(GET_NEWS_EVENTS_DETAILED, {
    variables: {
      search: "",
      type: isNews ? "news" : "event",
      category: null,
      dateFrom: null,
      dateTo: null,
      from: from,
      to: 3,
      exceptId,
    },
  })

  const items = newsEvents ? newsEvents.getNewsEvents.items : []
  return <>{children(items, loading, isNews)}</>
  // return (
  //   <div className={styles.module}>
  //     <div className='wrapper'>
  //       <div>
  //         <Link
  //           to={isNews ? "/news" : "/events"}
  //           className={styles.module__title}
  //         >
  //           Останні {isNews ? "новини" : "події"}
  //         </Link>
  //       </div>
  //       {loading ? (
  //         <Loader />
  //       ) : (
  //         <div
  //           className={`${styles.page_wrapper} ${styles.page_wrapper__grid_3}`}
  //         >
  //           {items.map((item: INewsEvent) => {
  //             return <NewsEvent key={item.id} info={item} isNews={isNews} />
  //           })}
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // )
}

export default NewsEventsModuleContainer
