import React from "react"
// @ts-ignore
import styles from "../styles/button.module"
import ButtonTab from "./ButtonTab"
import { BsPencilSquare, BsDownload } from "react-icons/bs"
import { useSelector, useDispatch } from "react-redux"
import { RootStore } from "../redux/store"
import { access } from "../modules/accessModifiers"
import { MODIMAGE_OPEN } from "../redux/toggle/toggleTypes"
import { types } from "../modules/uploadTypes"

interface IButtonDownloadProps {
  title?: string
  link: string
  uloadId: string
  contentId: string
  onEdit(): any
  onRemove(): any
  onCreate(): any
}

const ButtonDownload: React.FC<IButtonDownloadProps> = ({
  title,
  uloadId,
  contentId,
  link,
  onEdit,
  onRemove,
  onCreate,
}) => {
  const {
    auth: { user },
  } = useSelector((state: RootStore) => state)
  const dispatch = useDispatch()

  const handlePopupEditFile = (
    uploadId: string,
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event && event.stopPropagation()
    dispatch({
      type: MODIMAGE_OPEN,
      payload: {
        id: uploadId,
        content: contentId,
        type: types.private.keyWord,
        isFile: true,
        onEdit,
        onRemove,
        onCreate,
      },
    })
  }

  const isAdmin = user.role === access.admin.keyWord
  return (
    <div className={styles.btn_download}>
      <div
        className={`${styles.btn_download__wrapper} ${
          !isAdmin && styles.btn_download__wrapper__simple
        }`}
      >
        <BsDownload className={styles.btn_download__icon} />
        <a className={styles.btn_download__title} href={link} download>
          {title ? title : "Прикріплений файл"}
        </a>
      </div>
      {isAdmin && (
        <ButtonTab
          exClass={styles.btn_download__edit}
          Icon={BsPencilSquare}
          click={() => handlePopupEditFile(uloadId)}
        />
      )}
    </div>
  )
}

export default ButtonDownload
