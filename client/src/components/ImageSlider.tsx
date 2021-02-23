import React from "react"
// @ts-ignore
import styles from "../styles/carousel.module"
import { IImageSlide, ISliderParams } from "../interfaces"
import { convertDate } from "../helpers/convertDate"

interface IImageSliderProps {
  info: IImageSlide
  params: ISliderParams
  index: number
}

const ImageSlider: React.FC<IImageSliderProps> = ({ params, info, index }) => {
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
        <p className={styles.slide__date}>{convertDate(info.date)}</p>
      </div>
    </div>
  )
}

export default ImageSlider
