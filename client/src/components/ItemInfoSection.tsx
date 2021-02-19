import React from "react"
import { Link, useHistory } from "react-router-dom"
import { IPageSectionShort, IPageSectionFilter } from "../interfaces"
import { BsImages } from "react-icons/bs"
// @ts-ignore
import styles from "../styles/pages.module"
// @ts-ignore
import stylesBtn from "../styles/button.module"
import { useSelector, useDispatch } from "react-redux"
import { RootStore } from "../redux/store"
import { access } from "../modules/accessModifiers"
import ButtonTab from "../components/ButtonTab"

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
  const {
    auth: { user },
  } = useSelector((state: RootStore) => state)
  const dispatch = useDispatch()
  const history = useHistory()

  const findFilterParams = (filters: IPageSectionFilter[], keyWord: string) => {
    return filters.find((filter) => filter.keyWord === keyWord)
  }

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
        {isUploads && (
          <span className={styles.content__overlay}>
            {info.uploads[0].description && (
              <span className={styles.content__overlay_text}>
                {info.uploads[0].description}
              </span>
            )}
          </span>
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
      </button>
      <div>
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
        <Link to={itemLink}>{info.title}</Link>
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
