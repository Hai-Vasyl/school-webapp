import React from "react"
// @ts-ignore
import styles from "../styles/pages.module"
import { IPageSection } from "../interfaces"
import { Link } from "react-router-dom"
import { convertContent } from "../helpers/convertContentEditor"
import useFindFilter from "../hooks/useFindFilter"
import ImgSection from "./ImgSection"

interface ISectionPersonProps {
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

const SectionPerson: React.FC<ISectionPersonProps> = ({
  info,
  link,
  subtitle,
  onCreate,
  onEdit,
  onRemove,
}) => {
  const { findFilterParams } = useFindFilter()

  const linkParams = findFilterParams(info.filters, link ? link.keyWord : "")
  const subtitleParams = findFilterParams(
    info.filters,
    subtitle ? subtitle.keyWord : ""
  )

  return (
    <div className={styles.content}>
      <ImgSection
        infoId={info.id}
        upload={info.uploads[0]}
        onEdit={onEdit}
        onRemove={onRemove}
        onCreate={onCreate}
      />
      <div className={styles.content__body}>
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
        <div className={styles.content__main}>
          {convertContent(info.content)}
        </div>
      </div>
    </div>
  )
}

export default SectionPerson
