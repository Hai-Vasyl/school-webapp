import React from "react"
// @ts-ignore
import styles from "../styles/newsevents.module"
import { INewsEventSlider } from "../interfaces"
import { getNewsParamsByKey } from "../modules/newsCategories"
import { Link } from "react-router-dom"
import ImgPreviewSection from "./ImgPreviewSection"
import { getParamsByType } from "../modules/uploadTypes"
import { RiExternalLinkLine } from "react-icons/ri"
import { setPath } from "../index"

interface INewsEventProps {
  isNews: boolean
  info: INewsEventSlider
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
        imgLocation={info.preview && setPath(info.preview.location)}
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
          <Link
            className={styles.content__categoty}
            to={`/news?page=1&category=${info.category}`}
          >
            <RiExternalLinkLine className={styles.content__categoty_icon} />
            <span>{linkParams?.title}</span>
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
