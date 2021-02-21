import React from "react"
// @ts-ignore
import styles from "../styles/pages.module"
// @ts-ignore
import stylesBtn from "../styles/button.module"
import { BsImages, BsPlus, BsPencilSquare } from "react-icons/bs"
import ButtonTab from "./ButtonTab"
import { access } from "../modules/accessModifiers"
import { IUploadSection } from "../interfaces"
import { useSelector, useDispatch } from "react-redux"
import { RootStore } from "../redux/store"
import useLightBox from "../hooks/useLightBox"
import { MODIMAGE_OPEN, LIGHTBOX_OPEN } from "../redux/toggle/toggleTypes"
import { types } from "../modules/uploadTypes"

interface IImgSectionProps {
  infoId: string
  upload: IUploadSection
  onEdit(): any
  onRemove(): any
  onCreate(): any
  exClass?: string
}

const ImgSection: React.FC<IImgSectionProps> = ({
  infoId,
  upload,
  onEdit,
  onRemove,
  onCreate,
  exClass,
}) => {
  const {
    auth: { user },
  } = useSelector((state: RootStore) => state)
  const { getLightBox } = useLightBox()
  const dispatch = useDispatch()

  const handlePopupEditImage = (
    imageId: string,
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event && event.stopPropagation()
    dispatch({
      type: MODIMAGE_OPEN,
      payload: {
        id: imageId,
        content: infoId,
        type: types.private.keyWord,
        singleImg: true,
        onEdit,
        onRemove,
        onCreate,
      },
    })
  }

  const handlePopupCreateImage = () => {
    dispatch({
      type: MODIMAGE_OPEN,
      payload: {
        id: "",
        content: infoId,
        type: types.private.keyWord,
        onCreate,
      },
    })
  }

  const handlePopupLightBox = (imageId: string) => {
    const { getIndexImage, checkMoveAccess, onMove } = getLightBox([upload])
    const { isLeft, isRight } = checkMoveAccess(getIndexImage(imageId))
    dispatch({
      type: LIGHTBOX_OPEN,
      payload: {
        imageId,
        onMove,
        isLeft,
        isRight,
        singleImg: true,
        handleEditImage: handlePopupEditImage,
      },
    })
  }

  return (
    <div
      className={`${styles.content__preview} ${exClass}`}
      onClick={() => (upload ? handlePopupLightBox(upload.id) : {})}
    >
      {user.role === access.admin.keyWord && (
        <ButtonTab
          exClass={`${upload ? stylesBtn.btn_tab_glass : stylesBtn.btn_tab} ${
            styles.content__btn
          }`}
          Icon={upload ? BsPencilSquare : BsPlus}
          click={(event) =>
            upload
              ? handlePopupEditImage(upload.id, event)
              : handlePopupCreateImage()
          }
        />
      )}
      {upload && (
        <div className={styles.content__overlay}>
          {upload.description && (
            <span className={styles.content__overlay_text}>
              {upload.description}
            </span>
          )}
        </div>
      )}
      {upload ? (
        <img
          className={styles.content__img}
          src={upload.location}
          alt='imgPreview'
        />
      ) : (
        <BsImages className={styles.content__icon} />
      )}
    </div>
  )
}

export default ImgSection
