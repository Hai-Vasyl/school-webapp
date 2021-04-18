import React from "react"
import { Link } from "react-router-dom"
import { IPageSectionShort } from "../interfaces"
// @ts-ignore
import styles from "../styles/pages.module"
import useFindFilter from "../hooks/useFindFilter"
import ImgPreviewSection from "./ImgPreviewSection"
import useFilterFiles from "../hooks/useFilterFiles"
import { setPath } from "../index"

interface IItemInfoSectionProps {
  info: IPageSectionShort
  itemLink: string
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
}

const ItemInfoSection: React.FC<IItemInfoSectionProps> = ({
  itemLink,
  info,
  link,
  subtitle,
}) => {
  const { findFilterParams } = useFindFilter()
  const { filterFiles } = useFilterFiles()

  const linkParams = findFilterParams(info.filters, link ? link.keyWord : "")
  const subtitleParams = findFilterParams(
    info.filters,
    subtitle ? subtitle.keyWord : ""
  )

  const { images } = filterFiles(info.uploads)

  return (
    <div className={styles.item_info}>
      <ImgPreviewSection
        imgLocation={images[0] && setPath(images[0].location)}
        exClass={styles.content__preview__item_info}
        redirectStr={itemLink}
      />
      <div className={styles.item_info__body}>
        <Link className={styles.item_info__title} to={itemLink}>
          {info.title}
        </Link>
        {link && (
          <div>
            <span className={styles.content__link_title}>{link.title}:</span>
            <Link
              className={styles.content__link_text}
              to={link.text + linkParams?.value}
            >
              {linkParams?.value}
            </Link>
          </div>
        )}
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
      </div>
    </div>
  )
}

export default ItemInfoSection
