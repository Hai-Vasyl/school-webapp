import React from "react"
// @ts-ignore
import styles from "../styles/pages.module"
import { IPageSection } from "../interfaces"
import { Link } from "react-router-dom"
import { convertContent } from "../helpers/convertContentEditor"
import useFindFilter from "../hooks/useFindFilter"
import ImgSection from "./ImgSection"
import Button from "./Button"
import ButtonTab from "./ButtonTab"
import { BsPlus } from "react-icons/bs"
import { MODIMAGE_OPEN } from "../redux/toggle/toggleTypes"
import { useDispatch } from "react-redux"
import { types } from "../modules/uploadTypes"

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
  onCreate(): any
  onEdit(): any
  onRemove(): any
}

const SectionInfo: React.FC<SectionInfoProps> = ({
  info,
  link,
  subtitle,
  onCreate,
  onEdit,
  onRemove,
}) => {
  const dispatch = useDispatch()
  const { findFilterParams } = useFindFilter()

  const linkParams = findFilterParams(info.filters, link ? link.keyWord : "")
  const subtitleParams = findFilterParams(
    info.filters,
    subtitle ? subtitle.keyWord : ""
  )

  // const handlePopupEditFile = (
  //   imageId: string,
  //   event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  // ) => {
  //   event && event.stopPropagation()
  //   dispatch({
  //     type: MODIMAGE_OPEN,
  //     payload: {
  //       id: imageId,
  //       content: info.id,
  //       type: types.private.keyWord,
  //       singleImg: true,
  //       onEdit,
  //       onRemove,
  //       onCreate,
  //     },
  //   })
  // }

  const handlePopupCreateFile = () => {
    dispatch({
      type: MODIMAGE_OPEN,
      payload: {
        id: "",
        content: info.id,
        type: types.private.keyWord,
        onCreate,
        isFile: true,
      },
    })
  }

  let files = []
  let images = []
  for (let i = 0; i < info.uploads.length; i++) {
    if (info.uploads[i].format === "file") {
      files.push(info.uploads[i])
    } else {
      images.push(info.uploads[i])
    }
  }

  return (
    <div className={`${styles.content} ${styles.content_info}`}>
      <ImgSection
        infoId={info.id}
        upload={images[0]}
        onEdit={onEdit}
        onRemove={onRemove}
        onCreate={onCreate}
        exClass={styles.content__image}
      />
      <div className={styles.content__body}>
        <h1
          className={`title-second ${styles.content__title} ${styles.content__title_big}`}
        >
          {info.title}
        </h1>
        {subtitle && (
          <div
            className={`${styles.content__subtitle} ${styles.content__subtitle__big}`}
          >
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
          <div
            className={`${styles.content__link} ${styles.content__link__big}`}
          >
            <span className={styles.content__link_title}>{link.title}:</span>
            <Link
              className={styles.content__link_text}
              to={link.text + linkParams?.value}
            >
              {linkParams?.value}
            </Link>
          </div>
        )}
        <div className={`${styles.content__main} ${styles.content__main_info}`}>
          {convertContent(info.content)}
        </div>
        <div>
          <ButtonTab Icon={BsPlus} click={handlePopupCreateFile} />
          {files.map((item) => {
            return (
              <a key={item.id} href={item.location} target='_blank'>
                {item.description}
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default SectionInfo
