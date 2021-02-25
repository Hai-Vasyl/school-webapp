import React from "react"
import { GET_IMAGES } from "../fetching/queries"
import { useQuery } from "@apollo/client"
import { IImage } from "../interfaces"
import { getParamsByType } from "../modules/uploadTypes"
// @ts-ignore
import styles from "../styles/pages.module"
import useLightBox from "../hooks/useLightBox"
import { MODIMAGE_OPEN, LIGHTBOX_OPEN } from "../redux/toggle/toggleTypes"
import { useDispatch, useSelector } from "react-redux"
import { types } from "../modules/uploadTypes"
import { convertDate } from "../helpers/convertDate"
import Loader from "./Loader"
import ButtonTab from "./ButtonTab"
// @ts-ignore
import stylesBtn from "../styles/button.module"
import { access } from "../modules/accessModifiers"
import { RootStore } from "../redux/store"
import { BsPencilSquare } from "react-icons/bs"

const GalleryModule: React.FC = () => {
  const dispatch = useDispatch()
  const { getLightBox } = useLightBox()
  const {
    auth: { user },
  } = useSelector((state: RootStore) => state)

  const {
    data: dataImages,
    loading: loadImages,
    refetch: refetchImages,
  } = useQuery(GET_IMAGES, {
    variables: {
      from: 0,
      to: 7,
      search: "",
      type: "",
    },
  })

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
        onEdit: () => {
          refetchImages()
        },
        onRemove: () => {
          refetchImages()
        },
        onCreate: () => {
          refetchImages()
        },
      },
    })
  }

  const handlePopupLightBox = (imageId: string) => {
    const { getIndexImage, checkMoveAccess, onMove } = getLightBox(
      dataImages && dataImages.getImages.images
    )
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

  const images = dataImages ? dataImages.getImages.images : []

  const imagesJSX = images.map((image: IImage) => {
    const imageParams: any = getParamsByType(image.type)
    return (
      <div
        className={styles.image}
        key={image.id}
        onClick={() => handlePopupLightBox(image.id)}
      >
        <img
          className={styles.image__preview}
          src={image.location}
          alt='imgItem'
        />
        <span className={styles.image__overlay}></span>
        <span className={styles.image__icon}>
          <imageParams.Icon />
        </span>
        {(user.role === access.admin.keyWord || user.id === image.owner.id) && (
          <ButtonTab
            exClass={`${stylesBtn.btn_tab_glass} ${styles.image__btn_overlay}`}
            Icon={BsPencilSquare}
            click={(event) => handlePopupEditImage(image.id, event)}
          />
        )}
        <span className={styles.image__date}>
          <span>{convertDate(image.date)}</span>
        </span>
      </div>
    )
  })
  return (
    <div className={styles.module_gallery}>
      {loadImages ? (
        <Loader />
      ) : (
        <div className={styles.module_gallery__grid}>{imagesJSX}</div>
      )}
    </div>
  )
}

export default GalleryModule
