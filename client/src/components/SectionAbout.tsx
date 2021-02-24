import React from "react"
// @ts-ignore
import styles from "../styles/pages.module"
import { convertContent } from "../helpers/convertContentEditor"
import { IPageSection, IImageSlide } from "../interfaces"
import { convertDate } from "../helpers/convertDate"
import { BiTime } from "react-icons/bi"
import Carousel from "./Carousel"
import { types } from "../modules/uploadTypes"
import ImageSlide from "./ImageSlide"

interface ISectionAboutProps {
  info: IPageSection
  onCreate(): any
  onEdit(): any
  onRemove(): any
  loadImages?: boolean
  isOwnerContent: boolean
}

const SectionAbout: React.FC<ISectionAboutProps> = ({
  info,
  onCreate,
  onEdit,
  onRemove,
  loadImages,
  isOwnerContent,
}) => {
  const images = info.uploads
  return (
    <div className={styles.about}>
      <div className={styles.about__body}>
        <h2 className={`title-second ${styles.content__title}`}>
          {info.title}
        </h2>
        <div className={styles.about__subtitle}>
          <BiTime className={styles.content__subtitle_title} />
          <span className={styles.content__subtitle_text}>
            {convertDate(info.date)}
          </span>
        </div>
        <Carousel
          slides={images}
          load={loadImages}
          isOwnerContent={isOwnerContent}
          content={info.id}
          type={types.other.keyWord}
          onEdit={onEdit}
          onRemove={onRemove}
          onCreate={onCreate}
          exClass={!!images.length && styles.about__carousel}
        >
          {(params: any) =>
            images.map((slide: IImageSlide, index: number) => {
              return (
                <ImageSlide
                  key={slide.id}
                  info={slide}
                  index={index}
                  params={params}
                />
              )
            })
          }
        </Carousel>
        <div className={`${styles.content__main} ${styles.about__main}`}>
          {convertContent(info.content)}
        </div>
      </div>
    </div>
  )
}

export default SectionAbout
