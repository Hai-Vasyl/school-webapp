import React from "react"
import { IPageSection } from "../interfaces"
// @ts-ignore
import styles from "../styles/pages.module"
import { convertContent } from "../helpers/convertContentEditor"
import { convertDate } from "../helpers/convertDate"
import { BiTime } from "react-icons/bi"

interface IPageSectionModuleProps {
  info: IPageSection
}

const PageSectionModule: React.FC<IPageSectionModuleProps> = ({ info }) => {
  return (
    <div className={styles.section}>
      <h2 className={`title-second ${styles.section__title}`}>{info.title}</h2>
      <p className={styles.section__date}>
        <BiTime className={styles.section__icon_date} />
        <span>{convertDate(info.date)}</span>
      </p>
      <div className={styles.section__content}>
        {convertContent(info.content)}
      </div>
    </div>
  )
}

export default PageSectionModule
