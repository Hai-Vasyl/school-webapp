import React from "react"
import { INewsEventShort } from "../interfaces"
// @ts-ignore
import styles from "../styles/newsevents.module"
import { getParamsByType } from "../modules/uploadTypes"
import { Link, useHistory } from "react-router-dom"
import { RiExternalLinkLine } from "react-icons/ri"
import { BsImages } from "react-icons/bs"

interface INewsEventCardProps {
  info: INewsEventShort
}

const NewsEventCard: React.FC<INewsEventCardProps> = ({ info }) => {
  const history = useHistory()
  const type = info.type === "news" ? "news" : "events"

  const handleRedirectToPage = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    history.push(`/${type}/details/${info.id}`)
  }

  const infoParams = getParamsByType(info.type)

  return (
    <div className={styles.card} onClick={handleRedirectToPage}>
      {info.preview && info.preview.location ? (
        <img
          className={styles.card__preview}
          src={info.preview.location}
          alt='imgItem'
        />
      ) : (
        <span className={styles.card__plug}>
          <BsImages className={styles.card__plug_icon} />
        </span>
      )}
      <div className={styles.card__body}>
        <Link
          className={styles.card__category}
          to={`/${type}?page=1&category=${info.category}`}
        >
          <RiExternalLinkLine className={styles.card__category_icon} />
          <span>{infoParams?.label}</span>
        </Link>
        <Link className={styles.card__title} to={`/${type}/details/${info.id}`}>
          {info.title}
        </Link>
        <div className={styles.card__date}>
          {infoParams && <infoParams.Icon className={styles.card__date_icon} />}
          <span>{info.type === "news" ? info.date : info.dateEvent}</span>
        </div>
      </div>
    </div>
  )
}

export default NewsEventCard
