import React from "react"
// @ts-ignore
import styles from "../styles/gallery.module"
// @ts-ignore
import stylesBtn from "../styles/button.module"
import { IImage } from "../interfaces"
import { getParamsByType, types } from "../modules/uploadTypes"
import { access } from "../modules/accessModifiers"
import { useSelector, useDispatch } from "react-redux"
import { RootStore } from "../redux/store"
import ButtonTab from "../components/ButtonTab"
import { BsPencilSquare } from "react-icons/bs"
import { convertDate } from "../helpers/convertDate"
import { LIGHTBOX_OPEN, MODIMAGE_OPEN } from "../redux/toggle/toggleTypes"
import useLightBox from "../hooks/useLightBox"

interface IImageCardProps {
  info: IImage
  images: IImage[]
  onEdit: any
  onRemove: any
  onCreate: any
}

const ImageCard: React.FC<IImageCardProps> = ({
  info,
  images,
  onEdit,
  onRemove,
  onCreate,
}) => {
  const dispatch = useDispatch()
  const {
    auth: { user },
  } = useSelector((state: RootStore) => state)

  const { getLightBox } = useLightBox()

  const handlePopupEditImage = (
    imageId: string,
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event && event.stopPropagation()
    dispatch({
      type: MODIMAGE_OPEN,
      payload: {
        id: imageId,
        content: null,
        type: types.image.keyWord,
        onEdit,
        onRemove,
        onCreate,
      },
    })
  }

  const handlePopupLightBox = (imageId: string) => {
    const { getIndexImage, checkMoveAccess, onMove } = getLightBox(images)
    const { isLeft, isRight } = checkMoveAccess(getIndexImage(imageId))
    dispatch({
      type: LIGHTBOX_OPEN,
      payload: {
        imageId,
        onMove,
        isLeft,
        isRight,
        handleEditImage: handlePopupEditImage,
      },
    })
  }

  const imageParams: any = getParamsByType(info.type)

  return (
    <div className={styles.image} onClick={() => handlePopupLightBox(info.id)}>
      <img
        className={styles.image__preview}
        src={info.location}
        alt='imgItem'
      />
      <span className={styles.image__overlay}></span>
      <span className={styles.image__icon}>
        {imageParams && <imageParams.Icon />}
      </span>
      {(user.role === access.admin.keyWord || user.id === info.owner.id) && (
        <ButtonTab
          exClass={`${stylesBtn.btn_tab_glass} ${styles.image__btn_overlay}`}
          Icon={BsPencilSquare}
          click={(event) => handlePopupEditImage(info.id, event)}
        />
      )}
      <span className={styles.image__date}>{convertDate(info.date)}</span>
    </div>
  )
}

export default ImageCard
