import React from "react"
// @ts-ignore
import styles from "../styles/pages.module"
import { IPageSection } from "../interfaces"
import { Link } from "react-router-dom"
import { convertContent } from "../helpers/convertContentEditor"
import useFindFilter from "../hooks/useFindFilter"
import ImgSection from "./ImgSection"
import ButtonTab from "./ButtonTab"
import { BsPlus } from "react-icons/bs"
import { MODIMAGE_OPEN } from "../redux/toggle/toggleTypes"
import { useDispatch } from "react-redux"
import { types } from "../modules/uploadTypes"
import ButtonDownload from "./ButtonDownload"
import { useSelector } from "react-redux"
import { RootStore } from "../redux/store"
import { access } from "../modules/accessModifiers"
import useFilterFiles from "../hooks/useFilterFiles"

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
  const {
    auth: { user },
  } = useSelector((state: RootStore) => state)
  const { findFilterParams } = useFindFilter()
  const { filterFiles } = useFilterFiles()

  const linkParams = findFilterParams(info.filters, link ? link.keyWord : "")
  const subtitleParams = findFilterParams(
    info.filters,
    subtitle ? subtitle.keyWord : ""
  )

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

  const { files, images } = filterFiles(info.uploads)

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
      <div className={`${styles.content__body} ${styles.content_info__body}`}>
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
        <div className={styles.content_info__uploads_title}>
          <span>Прикріплені файли{!!files.length && ` (${files.length})`}</span>
          {user.role === access.admin.keyWord && (
            <ButtonTab Icon={BsPlus} click={handlePopupCreateFile} />
          )}
        </div>
        {!!files.length ? (
          <div className={styles.content_info__uploads}>
            {files.map((item) => {
              return (
                <ButtonDownload
                  key={item.id}
                  link={item.location}
                  title={item.description}
                  uloadId={item.id}
                  contentId={item.content}
                  onEdit={onEdit}
                  onRemove={onRemove}
                  onCreate={onCreate}
                />
              )
            })}
          </div>
        ) : (
          <div className='plug-text'>Порожньо</div>
        )}
      </div>
    </div>
  )
}

export default SectionInfo
