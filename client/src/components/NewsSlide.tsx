import React from "react"
// @ts-ignore
import styles from "../styles/carousel.module"
import { INewsEventSlider, ISliderParams } from "../interfaces"
import { convertDate } from "../helpers/convertDate"
import { convertContent } from "../helpers/convertContentEditor"

interface INewsSliderProps {
  info: INewsEventSlider
  params: ISliderParams
  index: number
}

const NewsSlide: React.FC<INewsSliderProps> = ({ params, info, index }) => {
  const currentActive = params.currentItem === index
  return (
    <div>
      <img
        className={`${styles.slide} ${
          currentActive &&
          (params.isRight ? styles.slide__left : styles.slide__right)
        } ${
          params.previousItem === index &&
          (params.isRight ? styles.slide__prev_left : styles.slide__prev_right)
        }`}
        src={info.preview.location}
        alt='imgSlide'
      />
      <div
        className={`${styles.slide__info} ${
          currentActive && styles.slide__info__active
        }`}
      >
        <h2 className={`${styles.slide__title} ${styles.slide__title__big}`}>
          {info.title}
        </h2>
        <p className={styles.slide__content}>{convertContent(info.content)}</p>
        <p className={styles.slide__date}>{info.date}</p>
      </div>
    </div>
  )
}

export default NewsSlide
