import React from "react"
import Loader from "./Loader"
import { INewsEventSlider } from "../interfaces"
// @ts-ignore
import styles from "../styles/pages.module"
import { Link, useHistory } from "react-router-dom"
import { RiExternalLinkLine } from "react-icons/ri"
import { getNewsParamsByKey } from "../modules/newsCategories"
import ImgPreviewSection from "./ImgPreviewSection"
import { BsCalendar } from "react-icons/bs"

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
  const history = useHistory()
  return (
    <div className={styles.module_news}>
      {loading ? (
        <Loader />
      ) : (
        <div className={styles.module_news__grid}>
          {items.map((item) => {
            const linkParams = getNewsParamsByKey(item.category)
            const linkPath = `/${isNews ? "news" : "events"}/details/${item.id}`
            return (
              <div className={styles.news} key={item.id}>
                <ImgPreviewSection
                  imgLocation={item.preview && item.preview.location}
                  exClass={styles.news__preview}
                  redirectStr={linkPath}
                />
                <div className={styles.news__body}>
                  <div className={styles.news__triangle}></div>
                  <div>
                    <Link
                      className={styles.news__link}
                      to={`/${isNews ? "news" : "events"}?page=1&category=${
                        item.category
                      }`}
                    >
                      <RiExternalLinkLine className={styles.news__link_icon} />
                      <span>{linkParams?.title}</span>
                    </Link>
                  </div>
                  <div>
                    <Link className={styles.news__title} to={linkPath}>
                      {item.title}
                    </Link>
                  </div>
                  <div>
                    <span className={styles.news__subtitle}>
                      <BsCalendar className={styles.news__subtitle_icon} />
                      <span>{item.dateEvent}</span>
                    </span>
                  </div>
                </div>
                <button
                  className={styles.news__more}
                  onClick={() => history.push(isNews ? "/news" : "/events")}
                >
                  Більше {isNews ? "новин" : "подій"}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default NewsEventsModuleGrid
