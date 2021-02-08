import React, { useState, Fragment } from "react"
import { IImageSlide } from "../interfaces"
// @ts-ignore
import styles from "../styles/carousel.module"
import LoaderData from "../components/LoaderData"
import { BsArrowLeft, BsArrowRight } from "react-icons/bs"
import { convertDate } from "../helpers/convertDate"

interface ICarouselProps {
  slides: IImageSlide[]
  load: boolean
}

const Carousel: React.FC<ICarouselProps> = ({ slides, load }) => {
  const [params, setParams] = useState({
    isRight: false,
    previousItem: 1,
    currentItem: 0,
  })

  const handleMoveSlide = (isRight: boolean) => {
    let nextItem
    if (isRight && params.currentItem === slides.length - 1) {
      nextItem = 0
    } else if (!isRight && params.currentItem === 0) {
      nextItem = slides.length - 1
    } else {
      nextItem = isRight ? params.currentItem + 1 : params.currentItem - 1
    }

    setParams({
      isRight,
      previousItem: params.currentItem,
      currentItem: nextItem,
    })
  }

  const handleClickSlide = (index: number) => {
    let isRight
    if (index > params.currentItem) {
      isRight = true
    } else if (index < params.currentItem) {
      isRight = false
    } else {
      return
    }

    setParams({
      isRight,
      previousItem: params.currentItem,
      currentItem: index,
    })
  }

  const slidesJSX = slides.map((slide: IImageSlide, index: number) => {
    const currentActive = params.currentItem === index
    return (
      <Fragment key={slide.id}>
        <img
          className={`${styles.slide} ${
            currentActive &&
            (params.isRight ? styles.slide__left : styles.slide__right)
          } ${
            params.previousItem === index &&
            (params.isRight
              ? styles.slide__prev_left
              : styles.slide__prev_right)
          }`}
          src={slide.location}
          alt='imgSlide'
        />
        <div
          className={`${styles.slide__info} ${
            currentActive && styles.slide__info__active
          }`}
        >
          <h2 className={styles.slide__title}>{slide.description}</h2>
          <p className={styles.slide__date}>{convertDate(slide.date)}</p>
        </div>
      </Fragment>
    )
  })

  const buttons = slides.map((slide: IImageSlide, index) => {
    return (
      <button
        onClick={() => handleClickSlide(index)}
        key={slide.id}
        className={`${styles.btn_dot} ${
          params.currentItem === index && styles.btn_dot__active
        }`}
      ></button>
    )
  })

  return (
    <>
      <LoaderData load={load} />
      <div className={styles.slider__overlay}></div>
      {slidesJSX}
      <div className={styles.slider__toolbar}>
        {slides.length > 1 && (
          <>
            <button
              className={`${styles.btn_arrow} ${styles.btn_arrow__left}`}
              onClick={() => handleMoveSlide(false)}
            >
              <BsArrowLeft />
            </button>
            <div className={styles.btn_dots}>{buttons}</div>
            <button
              className={`${styles.btn_arrow} ${styles.btn_arrow__right}`}
              onClick={() => handleMoveSlide(true)}
            >
              <BsArrowRight />
            </button>
          </>
        )}
      </div>
    </>
  )
}

export default Carousel
