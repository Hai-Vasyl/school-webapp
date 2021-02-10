import React, { useState, Fragment } from "react"
import { IImageSlide } from "../interfaces"
// @ts-ignore
import styles from "../styles/carousel.module"
import Loader from "../components/Loader"
import {
  BsArrowLeft,
  BsArrowRight,
  BsPlus,
  BsPencilSquare,
  BsPip,
} from "react-icons/bs"
import { convertDate } from "../helpers/convertDate"
import ButtonTab from "./ButtonTab"
// @ts-ignore
import stylesBtn from "../styles/button.module"
import { useSelector } from "react-redux"
import { RootStore } from "../redux/store"
import { access } from "../modules/accessModifiers"

interface ICarouselProps {
  slides: IImageSlide[]
  load: boolean
  isContentOwner: boolean
  popupLightBox(imageId: string): any
  popupCreateImage(): any
  popupEditImage(
    imageId: string,
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): any
}

const Carousel: React.FC<ICarouselProps> = ({
  slides,
  load,
  isContentOwner,
  popupLightBox,
  popupCreateImage,
  popupEditImage,
}) => {
  const {
    auth: { user },
  } = useSelector((state: RootStore) => state)
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

  const isImageOwner =
    user.role === access.admin.keyWord ||
    user.id === slides[params.currentItem].owner.id

  return (
    <>
      {load ? (
        <Loader center />
      ) : (
        <>
          {!!slides.length && (
            <>
              <div className={styles.slider__overlay}></div>
              {slidesJSX}
            </>
          )}
          {(!!slides.length || (!slides.length && isContentOwner)) && (
            <div
              className={`${styles.slider__toolbar_wrapper} ${
                !slides.length &&
                isContentOwner &&
                styles.slider__toolbar_wrapper__minimize
              }`}
            >
              <div className={styles.slider__toolbar}>
                <>
                  {isImageOwner && (
                    <div className={styles.slider__add_img}>
                      {!slides.length && <span>Добавити зображення</span>}
                      <ButtonTab
                        exClass={`${
                          !slides.length && isContentOwner
                            ? stylesBtn.btn_tab
                            : stylesBtn.btn_tab_glass
                        } ${styles.slider__btn_create}`}
                        click={popupCreateImage}
                        Icon={BsPlus}
                      />
                    </div>
                  )}
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
                  {slides.length > 0 && (
                    <div className={styles.slider__btns}>
                      {isImageOwner && (
                        <ButtonTab
                          exClass={`${stylesBtn.btn_tab_glass}`}
                          click={(event) =>
                            popupEditImage(slides[params.currentItem].id, event)
                          }
                          Icon={BsPencilSquare}
                        />
                      )}
                      <ButtonTab
                        exClass={`${stylesBtn.btn_tab_glass}`}
                        click={() =>
                          popupLightBox(slides[params.currentItem].id)
                        }
                        Icon={BsPip}
                      />
                    </div>
                  )}
                </>
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}

export default Carousel
