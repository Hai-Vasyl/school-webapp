import React from "react"
// @ts-ignore
import styles from "../styles/newsevents.module"
import { INewsEvent } from "../interfaces"
import { getNewsParamsByKey } from "../modules/newsCategories"
import { Link } from "react-router-dom"
import ImgPreviewSection from "./ImgPreviewSection"
import { getParamsByType } from "../modules/uploadTypes"

interface INewsEventProps {
  isNews: boolean
  info: INewsEvent
}

const NewsEvent: React.FC<INewsEventProps> = ({ isNews, info }) => {
  const linkPath = isNews
    ? `/news/details/${info.id}`
    : `/events/details/${info.id}`
  const linkParams = getNewsParamsByKey(info.category)
  const contentType = getParamsByType(isNews ? "news" : "event")

  return (
    <div className={styles.content} key={info.id}>
      <ImgPreviewSection
        imgLocation={info.preview && info.preview.location}
        exClass={styles.content__preview}
        redirectStr={linkPath}
      />
      <div className={styles.content__main}>
        <div className={styles.content__date}>
          {contentType && (
            <contentType.Icon className={styles.content__date_icon} />
          )}
          <span>{info.date.split("-").join(" / ")}</span>
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
