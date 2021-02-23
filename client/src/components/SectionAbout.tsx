import React from "react"
// @ts-ignore
import styles from "../styles/pages.module"
import { convertContent } from "../helpers/convertContentEditor"
import { IPageSection } from "../interfaces"
import { convertDate } from "../helpers/convertDate"
import { BiTime } from "react-icons/bi"

interface ISectionAboutProps {
  info: IPageSection
  // link?: {
  //   title: string
  //   text: string
  //   keyWord: string
  // }
  // subtitle?: {
  //   title: string
  //   text: string
  //   keyWord: string
  // }
  // onCreate(): any
  // onEdit(): any
  // onRemove(): any
}

const SectionAbout: React.FC<ISectionAboutProps> = ({ info }) => {
  return (
    <div className={styles.about}>
      {/* <ImgSection
        infoId={info.id}
        upload={info.uploads[0]}
        onEdit={onEdit}
        onRemove={onRemove}
        onCreate={onCreate}
      /> */}
      <div className={styles.about__body}>
        {/* {link && (
          <div className={styles.content__link}>
            <span className={styles.content__link_title}>{link.title}:</span>
            <Link
              className={styles.content__link_text}
              to={link.text + linkParams?.value}
            >
              {linkParams?.value}
            </Link>
          </div>
        )} */}
        <h2 className={`title-second ${styles.content__title}`}>
          {info.title}
        </h2>
        <div className={styles.about__subtitle}>
          <BiTime className={styles.content__subtitle_title} />
          <span className={styles.content__subtitle_text}>
            {convertDate(info.date)}
          </span>
        </div>
        <div className={`${styles.content__main} ${styles.about__main}`}>
          {convertContent(info.content)}
        </div>
      </div>
    </div>
  )
}

export default SectionAbout
