import React from "react"
// @ts-ignore
import styles from "../styles/pages.module"
import { IPageSection, IPageSectionFilter } from "../interfaces"
import { BsImages, BsPlus, BsPencilSquare } from "react-icons/bs"
import { Link } from "react-router-dom"
import { convertContent } from "../helpers/convertContentEditor"
import ButtonTab from "./ButtonTab"
import { useSelector, useDispatch } from "react-redux"
import { MODIMAGE_OPEN, LIGHTBOX_OPEN } from "../redux/toggle/toggleTypes"
import { types } from "../modules/uploadTypes"
import useLightBox from "../hooks/useLightBox"
// @ts-ignore
import stylesBtn from "../styles/button.module"
import { RootStore } from "../redux/store"
import { access } from "../modules/accessModifiers"
import useFindFilter from "../hooks/useFindFilter"

interface SectionInfoProps {
  info: IPageSection
  link?: {
    title: string
    text: string
    keyWord: string
  }
  subtitle?: {
    title: string
    text: string
    keyWord: string
  }
  refetchSection(): any
}

const SectionInfo: React.FC<SectionInfoProps> = ({
  info,
  link,
  subtitle,
  refetchSection,
}) => {
  const dispatch = useDispatch()
  const {
    auth: { user },
  } = useSelector((state: RootStore) => state)
  const { getLightBox } = useLightBox()
  const { findFilterParams } = useFindFilter()

  // const findFilterParams = (filters: IPageSectionFilter[], keyWord: string) => {
  //   return filters.find((filter) => filter.keyWord === keyWord)
  // }

  const handlePopupEditImage = (
    imageId: string,
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event && event.stopPropagation()
    dispatch({
      type: MODIMAGE_OPEN,
      payload: {
        id: imageId,
        content: info.id,
        type: types.private.keyWord,
        singleImg: true,
        onEdit: () => {
          refetchSection()
        },
        onRemove: () => {
          refetchSection()
        },
        onCreate: () => {
          refetchSection()
        },
      },
    })
  }

  const handlePopupCreateImage = () => {
    dispatch({
      type: MODIMAGE_OPEN,
      payload: {
        id: "",
        content: info.id,
        type: types.private.keyWord,
        onCreate: () => {
          refetchSection()
        },
      },
    })
  }

  const handlePopupLightBox = (imageId: string) => {
    const { getIndexImage, checkMoveAccess, onMove } = getLightBox(info.uploads)
    const { isLeft, isRight } = checkMoveAccess(getIndexImage(imageId))
    dispatch({
      type: LIGHTBOX_OPEN,
      payload: {
        imageId,
        onMove,
        isLeft,
        isRight,
        singleImg: true,
        handleEditImage: handlePopupEditImage,
      },
    })
  }

  const linkParams = findFilterParams(info.filters, link ? link.keyWord : "")
  const subtitleParams = findFilterParams(
    info.filters,
    subtitle ? subtitle.keyWord : ""
  )
  const isUploads = !!info.uploads.length

  return (
    <div className={styles.content}>
      <div
        className={styles.content__preview}
        onClick={() =>
          isUploads ? handlePopupLightBox(info.uploads[0].id) : {}
        }
      >
        {user.role === access.admin.keyWord && (
          <ButtonTab
            exClass={`${
              isUploads ? stylesBtn.btn_tab_glass : stylesBtn.btn_tab
            } ${styles.content__btn}`}
            Icon={isUploads ? BsPencilSquare : BsPlus}
            click={(event) =>
              isUploads
                ? handlePopupEditImage(info.uploads[0].id, event)
                : handlePopupCreateImage()
            }
          />
        )}
        {isUploads && (
          <div className={styles.content__overlay}>
            {info.uploads[0].description && (
              <span className={styles.content__overlay_text}>
                {info.uploads[0].description}
              </span>
            )}
          </div>
        )}
        {isUploads ? (
          <img
            className={styles.content__img}
            src={info.uploads[0].location}
            alt='imgPreview'
          />
        ) : (
          <BsImages className={styles.content__icon} />
        )}
      </div>
      <div className={styles.content__body}>
        <h2 className={`title-second ${styles.content__title}`}>
          {info.title}
        </h2>
        {subtitle && (
          <div className={styles.content__subtitle}>
            <span className={styles.content__subtitle_title}>
              {subtitle.title}:
            </span>
            <Link
              className={styles.content__subtitle_text}
              to={subtitle.text + subtitleParams?.value}
            >
              {subtitleParams?.value}
            </Link>
          </div>
        )}
        {link && (
          <div className={styles.content__link}>
            <span className={styles.content__link_title}>{link.title}:</span>
            <Link
              className={styles.content__link_text}
              to={link.text + linkParams?.value}
            >
              {linkParams?.value}
            </Link>
          </div>
        )}
        <div className={styles.content__main}>
          {convertContent(info.content)}
        </div>
      </div>
    </div>
  )
}

export default SectionInfo
