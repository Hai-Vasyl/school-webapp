import React from "react"
import NewsEvent from "./NewsEvent"
import Loader from "./Loader"
import { INewsEventSlider } from "../interfaces"
// @ts-ignore
import styles from "../styles/pages.module"
import { Link, useHistory } from "react-router-dom"
// @ts-ignore
import stylesBtn from "../styles/button.module"
import Button from "./Button"

interface INewsEventsModuleProps {
  loading: boolean
  isNews?: boolean
  items: INewsEventSlider[]
}

const NewsEventsModule: React.FC<INewsEventsModuleProps> = ({
  isNews = true,
  loading,
  items,
}) => {
  const history = useHistory()
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
            {items.map((item: INewsEventSlider) => {
              return <NewsEvent key={item.id} info={item} isNews={isNews} />
            })}
          </div>
        )}
        <div className={styles.module__more}>
          <Button
            exClass={`${stylesBtn.btn_simple} ${styles.module__more_btn}`}
            click={() => history.push(isNews ? "/news" : "/events")}
            title={`Більше ${isNews ? "новин" : "подій"}`}
          />
        </div>
      </div>
    </div>
  )
}

export default NewsEventsModule
