import React from "react"
import { Link, useHistory } from "react-router-dom"
import { IPageSectionShort, IPageSectionFilter } from "../interfaces"
import { BsImages, BsInfoSquare } from "react-icons/bs"
// @ts-ignore
import styles from "../styles/pages.module"
import useFindFilter from "../hooks/useFindFilter"

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
  const history = useHistory()
  const { findFilterParams } = useFindFilter()

  const handleRedirectLink = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    link: string
  ) => {
    event.stopPropagation()
    history.push(link)
  }

  const linkParams = findFilterParams(info.filters, link ? link.keyWord : "")
  const subtitleParams = findFilterParams(
    info.filters,
    subtitle ? subtitle.keyWord : ""
  )
  const isUploads = !!info.uploads.length
  return (
    <div className={styles.item_info}>
      <button
        className={`${styles.content__preview} ${styles.content__preview__item_info}`}
        onClick={(event) => handleRedirectLink(event, itemLink)}
      >
        <span className={styles.content__overlay}>
          <span className={styles.item_info__more}>
            <BsInfoSquare className={styles.item_info__more_icon} />
            <span className={styles.item_info__more_text}>Детальніше</span>
          </span>
        </span>
        {isUploads ? (
          <img
            className={styles.content__img}
            src={info.uploads[0].location}
            alt='imgPreview'
          />
        ) : (
          <BsImages className={styles.content__icon} />
        )}
      </button>
      <div>
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
