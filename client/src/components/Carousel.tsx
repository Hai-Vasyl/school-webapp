import React from "react"
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
import ButtonTab from "./ButtonTab"
// @ts-ignore
import stylesBtn from "../styles/button.module"
import { useSelector, useDispatch } from "react-redux"
import { RootStore } from "../redux/store"
import { access } from "../modules/accessModifiers"
import useCarousel from "../hooks/useCarousel"
import { MODIMAGE_OPEN, LIGHTBOX_OPEN } from "../redux/toggle/toggleTypes"
import useLightBox from "../hooks/useLightBox"

interface ICarouselProps {
  slides: IImageSlide[]
  load: boolean
  content: string
  type: string
  isOwnerContent: boolean
  onEdit(): any
  onRemove(): any
  onCreate(): any
  exClass?: string
  children: any
}

const Carousel: React.FC<ICarouselProps> = ({
  slides,
  load,
  content,
  type,
  isOwnerContent,
  onEdit,
  onRemove,
  onCreate,
  exClass,
  children,
}) => {
  const {
    auth: { user },
  } = useSelector((state: RootStore) => state)
  const dispatch = useDispatch()
  const { params, handleMoveSlide, handleClickSlide } = useCarousel(
    slides.length
  )
  const { getLightBox } = useLightBox()

  const handlePopupEditImage = (
    imageId: string,
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event && event.stopPropagation()
    dispatch({
      type: MODIMAGE_OPEN,
      payload: {
        id: imageId,
        content,
        type,
        onEdit,
        onRemove,
        onCreate,
      },
    })
  }

  const handlePopupCreateImage = () => {
    dispatch({
      type: MODIMAGE_OPEN,
      payload: {
        id: "",
        content: content,
        type: type,
        onCreate,
      },
    })
  }

  const handlePopupLightBox = (imageId: string) => {
    const { getIndexImage, checkMoveAccess, onMove } = getLightBox(slides)
    const { isLeft, isRight } = checkMoveAccess(getIndexImage(imageId))
    dispatch({
      type: LIGHTBOX_OPEN,
      payload: {
        imageId,
        onMove,
        isLeft,
        isRight,
        handleEditImage: handlePopupEditImage,
      },
    })
  }

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
    <div
      className={`carousel ${exClass} ${
        !load &&
        !slides.length &&
        (isOwnerContent
          ? styles.newsevent__slider__minimize
          : styles.newsevent__slider__close)
      }`}
    >
      {load ? (
        <Loader center />
      ) : (
        <>
          {!!slides.length && (
            <>
              <div className={styles.slider__overlay}></div>
              {children(params)}
            </>
          )}
          {(!!slides.length || (!slides.length && isOwnerContent)) && (
            <div
              className={`${styles.slider__toolbar_wrapper} ${
                !slides.length &&
                isOwnerContent &&
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
                          !slides.length && isOwnerContent
                            ? stylesBtn.btn_tab
                            : stylesBtn.btn_tab_glass
                        } ${styles.slider__btn_create}`}
                        click={handlePopupCreateImage}
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
                            handlePopupEditImage(
                              slides[params.currentItem].id,
                              event
                            )
                          }
                          Icon={BsPencilSquare}
                        />
                      )}
                      <ButtonTab
                        exClass={`${stylesBtn.btn_tab_glass}`}
                        click={() =>
                          handlePopupLightBox(slides[params.currentItem].id)
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
    </div>
  )
}

export default Carousel
