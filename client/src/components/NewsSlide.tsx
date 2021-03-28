import React from "react"
// @ts-ignore
import styles from "../styles/carousel.module"
import { INewsEventSlider, ISliderParams } from "../interfaces"
import { convertContent } from "../helpers/convertContentEditor"
import { BiTime } from "react-icons/bi"
import { RiExternalLinkLine } from "react-icons/ri"
import { Link, useHistory } from "react-router-dom"
import { getNewsParamsByKey } from "../modules/newsCategories"
import Button from "./Button"
// @ts-ignore
import stylesBtn from "../styles/button.module"

interface INewsSliderProps {
  info: INewsEventSlider
  params: ISliderParams
  index: number
}

const NewsSlide: React.FC<INewsSliderProps> = ({ params, info, index }) => {
  const history = useHistory()
  const currentActive = params.currentItem === index
  const newsParams = getNewsParamsByKey(info.category)
  return (
    <div>
      <div className={styles.slide__overlay}></div>
      <img
        className={`${styles.slide} ${
          currentActive &&
          (params.isRight ? styles.slide__left : styles.slide__right)
        } ${
          params.previousItem === index &&
          (params.isRight ? styles.slide__prev_left : styles.slide__prev_right)
        }`}
        src={info.preview?.location}
        alt='imgSlide'
      />
      <div
        className={`${styles.slide__info} ${
          currentActive && styles.slide__info__active
        }`}
      >
        <div className={styles.slide__link}>
          <RiExternalLinkLine className={styles.slide__link_icon} />
          <Link
            to={`/news?page=1&category=${info.category}`}
            className={styles.slide__link_text}
          >
            {newsParams?.title}
          </Link>
        </div>
        <div>
          <Link
            to={`/news/details/${info.id}`}
            className={`${styles.slide__title} ${styles.slide__title__big}`}
          >
            {info.title}
          </Link>
        </div>

        <div className={styles.slide__content}>
          {convertContent(info.content)}
        </div>
        <div className={styles.slide__btns}>
          <Button
            click={() => history.push(`/news/details/${info.id}`)}
            exClass={stylesBtn.btn_outline_light}
            title='Детальніше'
          />
          <Button
            click={() => history.push("/news")}
            exClass={stylesBtn.btn_clear}
            title='Усі новини'
          />
        </div>
        <div className={`${styles.slide__date} ${styles.slide__date_right}`}>
          <BiTime className={styles.slide__date_icon} />
          <span>{info.date}</span>
        </div>
      </div>
    </div>
  )
}

export default NewsSlide
