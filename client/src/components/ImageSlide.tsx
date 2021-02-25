import React from "react"
// @ts-ignore
import styles from "../styles/carousel.module"
import { IImageSlide, ISliderParams } from "../interfaces"
import { BiTime } from "react-icons/bi"
import { convertDate } from "../helpers/convertDate"

interface IImageSliderProps {
  info: IImageSlide
  params: ISliderParams
  index: number
}

const ImageSlide: React.FC<IImageSliderProps> = ({ params, info, index }) => {
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
        src={info.location}
        alt='imgSlide'
      />
      <div
        className={`${styles.slide__info} ${
          currentActive && styles.slide__info__active
        }`}
      >
        <h2 className={styles.slide__title}>{info.description}</h2>
        <p className={styles.slide__date}>
          <BiTime className={styles.slide__date_icon} />
          <span>{convertDate(info.date)}</span>
        </p>
      </div>
    </div>
  )
}

export default ImageSlide
