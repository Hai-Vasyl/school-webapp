import React from "react"
import Loader from "./Loader"
import { INewsEventSlider } from "../interfaces"
// @ts-ignore
import styles from "../styles/pages.module"
import { Link } from "react-router-dom"
import { RiExternalLinkLine } from "react-icons/ri"
import { getNewsParamsByKey } from "../modules/newsCategories"
// // @ts-ignore
// import styles from "../styles/pages.module"

interface INewsEventsModuleGridProps {
  loading: boolean
  isNews?: boolean
  items: INewsEventSlider[]
}

const NewsEventsModuleGrid: React.FC<INewsEventsModuleGridProps> = ({
  isNews = true,
  loading,
  items,
}) => {
  return (
    <div className={styles.module_news}>
      {loading ? (
        <Loader />
      ) : (
        items.map((item) => {
          const linkParams = getNewsParamsByKey(item.category)
          return (
            <div className={styles.news}>
              <Link
                className={styles.news__preview}
                to={`/${isNews ? "news" : "events"}/details/${item.id}`}
              >
                <img
                  className={styles.news__img}
                  src={item.preview.location}
                  alt='imgPreview'
                />
              </Link>
              <div className={styles.news__body}>
                <Link
                  className={styles.news__link}
                  to={`/${isNews ? "news" : "events"}?page=1&category=${
                    item.category
                  }`}
                >
                  <RiExternalLinkLine className={styles.news__link_icon} />
                  <span>{linkParams?.title}</span>
                </Link>
                <Link
                  className={styles.news__title}
                  to={`/${isNews ? "news" : "events"}/details/${item.id}`}
                >
                  {item.title}
                </Link>
                <span className={styles.news__subtitle}>{item.date}</span>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

export default NewsEventsModuleGrid
