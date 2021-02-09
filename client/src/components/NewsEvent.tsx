import React from "react"
// @ts-ignore
import styles from "../styles/newsevents.module"
import { INewsEvent } from "../interfaces"
import { getNewsParamsByKey } from "../modules/newsCategories"
import { Link } from "react-router-dom"
import { BsImage } from "react-icons/bs"

interface INewsEventProps {
  isNews: boolean
  info: INewsEvent
}

const NewsEvent: React.FC<INewsEventProps> = ({ isNews, info }) => {
  const linkPath = isNews
    ? `/news/details/${info.id}`
    : `/events/details/${info.id}`
  const linkParams = getNewsParamsByKey(info.category)

  return (
    <div className={styles.content} key={info.id}>
      <Link className={styles.content__preview} key={info.id} to={linkPath}>
        {info.preview ? (
          <img
            className={styles.content__image}
            src={info.preview.location}
            alt='image'
          />
        ) : (
          <div className={styles.content__icon}>
            <BsImage />
          </div>
        )}
      </Link>
      <div className={styles.content__main}>
        <div className={styles.content__date}>
          {info.date.split("-").join(" / ")}
        </div>
        <div>
          <Link className={styles.content__title} to={linkPath}>
            {info.title}
          </Link>
        </div>
        <div>
          <Link className={styles.content__categoty} to='/news'>
            {linkParams?.title}
          </Link>
        </div>
        <div className={styles.content__links}>
          {info.links.map((link, index) => {
            return (
              <a className={styles.content__link} key={index} href={link.link}>
                <span>{link.label}</span>
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default NewsEvent
