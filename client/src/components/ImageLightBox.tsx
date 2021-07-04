import React from "react"
import { useSelector } from "react-redux"
import { RootStore } from "../redux/store"
// @ts-ignore
import styles from "../styles/lightbox.module"
// @ts-ignore
import stylesBtn from "../styles/button.module"
import { GET_IMAGE } from "../fetching/queries"
import { useQuery } from "@apollo/client"
import LoaderData from "./LoaderData"
import { getParamsByType, types } from "../modules/uploadTypes"
import { access } from "../modules/accessModifiers"
import {
  BsPencilSquare,
  BsX,
  BsChevronLeft,
  BsChevronRight,
} from "react-icons/bs"
import { LIGHTBOX_CLOSE } from "../redux/toggle/toggleTypes"
import { useDispatch } from "react-redux"
import ButtonTab from "./ButtonTab"
import { convertDate } from "../helpers/convertDate"
import UserCard from "./UserCard"
import { Link, useHistory } from "react-router-dom"
import { RiExternalLinkLine } from "react-icons/ri"
import { setPath } from "../index"

const ImageLightBox: React.FC = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const {
    auth: { user },
    toggle: {
      lightbox: {
        imageId,
        isLeft,
        isRight,
        toggle,
        singleImg,
        onMove,
        handleEditImage,
      },
    },
  } = useSelector((state: RootStore) => state)
  const { data: dataImage, loading: loadImage } = useQuery(GET_IMAGE, {
    variables: { imageId },
  })
  let image = {
    id: "",
    owner: {
      id: "",
      username: "",
      email: "",
      ava: "",
      color: "",
      firstname: "",
      lastname: "",
      role: "",
    },
    date: "",
    location: "",
    content: "",
    type: "",
    key: "",
    hashtags: "",
    description: "",
  }

  const handleSearchHashtag = (tag: string) => {
    history.push(`/gallery?search=${tag.replace("#", "hash_")}`)
    dispatch({ type: LIGHTBOX_CLOSE })
  }

  image = dataImage ? dataImage.getImage : image
  const imageParams: any = getParamsByType(image.type)
  const isNews = image.type === "news"
  const isEvent = image.type === "event"

  const handleRedirectToNewsEvent = () => {
    history.push((imageParams && imageParams.getLink(image.content)) || "")
    dispatch({ type: LIGHTBOX_CLOSE })
  }

  const hashtags =
    !!image.hashtags.length &&
    image.hashtags
      .split(" ")
      .reduce((acumulator: any, tag: string, index: number) => {
        if (tag) {
          acumulator.push(
            <button
              className={styles.btn_hashtag}
              key={tag + index}
              onClick={() => handleSearchHashtag(tag)}
            >
              <span className={styles.btn_hashtag__text}>{tag}</span>
            </button>
          )
        }

        return acumulator
      }, [])

  return (
    <div className={`${styles.lightbox} ${toggle && styles.lightbox__open}`}>
      <LoaderData load={loadImage} />
      {!loadImage && image.location && (
        <img
          className={styles.lightbox__image}
          src={setPath(image.location)}
          alt='image'
        />
      )}
      <div className={styles.lightbox__header_area}>
        <div className={styles.lightbox__header}>
          <span className={styles.lightbox__icon}>
            {imageParams && <imageParams.Icon />}
          </span>
          <span className={styles.lightbox__date}>
            {convertDate(image.date)}
          </span>
          {(user.role === access.admin.keyWord ||
            user.id === image.owner.id) && (
            <ButtonTab
              exClass={`${stylesBtn.btn_tab_glass} ${styles.lightbox__btn_overlay}`}
              Icon={BsPencilSquare}
              click={() => handleEditImage(imageId)}
            />
          )}
          <ButtonTab
            exClass={`${stylesBtn.btn_tab_glass} ${styles.lightbox__btn_overlay}`}
            Icon={BsX}
            click={() => dispatch({ type: LIGHTBOX_CLOSE })}
          />
        </div>
      </div>
      {!singleImg && (
        <>
          <div className={styles.lightbox__body_area}>
            <div className={styles.lightbox__body}>
              <button
                className={`${styles.lightbox__btn_arrow} ${
                  !isLeft && styles.lightbox__btn_arrow__disabled
                }`}
                onClick={() => (isLeft ? onMove(false, imageId) : {})}
              >
                <BsChevronLeft />
              </button>
            </div>
          </div>
          <div
            className={`${styles.lightbox__body_area} ${styles.lightbox__body_area__right}`}
          >
            <div
              className={`${styles.lightbox__body} ${styles.lightbox__body__right}`}
            >
              <button
                className={`${styles.lightbox__btn_arrow} ${
                  !isRight && styles.lightbox__btn_arrow__disabled
                }`}
                onClick={() => (isRight ? onMove(true, imageId) : {})}
              >
                <BsChevronRight />
              </button>
            </div>
          </div>
        </>
      )}
      <div className={styles.lightbox__footer}>
        <div className={styles.lightbox__description}>{image.description}</div>
        {image.type !== types.private.keyWord && (
          <div className={styles.lightbox__details}>
            <div className={styles.lightbox__owner}>
              <span className={styles.lightbox__owner_title}>Власник</span>
              {image.owner.role && (
                <UserCard
                  isLink={true}
                  user={image.owner}
                  minimize
                  exClass={styles.lightbox__usercard}
                />
              )}
            </div>
            {image.type !== types.other.keyWord && (
              <div className={styles.lightbox__adition}>
                {(isNews || isEvent) && (
                  <button
                    onClick={handleRedirectToNewsEvent}
                    className={styles.lightbox__link}
                  >
                    <RiExternalLinkLine
                      className={styles.lightbox__link_icon}
                    />
                    <span>Сторінка {isNews ? "новини" : "події"}</span>
                  </button>
                )}
                <div className={styles.lightbox__hashtags}>{hashtags}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageLightBox
