import React from "react"
import ButtonDownload from "./ButtonDownload"
// @ts-ignore
import styles from "../styles/pages.module"
import ButtonTab from "./ButtonTab"
import { useSelector, useDispatch } from "react-redux"
import { BsPlus } from "react-icons/bs"
import { RootStore } from "../redux/store"
import { access } from "../modules/accessModifiers"
import { IUploadSection } from "../interfaces"
import { MODIMAGE_OPEN } from "../redux/toggle/toggleTypes"
import { types } from "../modules/uploadTypes"

interface IFileAttachmentsProps {
  files: IUploadSection[]
  onEdit(): any
  onRemove(): any
  onCreate(): any
  contentId: string
}

const FilesAttachment: React.FC<IFileAttachmentsProps> = ({
  files,
  onEdit,
  onRemove,
  onCreate,
  contentId,
}) => {
  const {
    auth: { user },
  } = useSelector((state: RootStore) => state)
  const dispatch = useDispatch()

  const handlePopupCreateFile = () => {
    dispatch({
      type: MODIMAGE_OPEN,
      payload: {
        id: "",
        content: contentId,
        type: types.private.keyWord,
        onCreate,
        isFile: true,
      },
    })
  }

  const isAdmin = user.role === access.admin.keyWord

  return files.length || isAdmin ? (
    <div className={styles.uploads}>
      <div className={styles.uploads__title}>
        <span>Прикріплені файли{!!files.length && ` (${files.length})`}</span>
        {isAdmin && <ButtonTab Icon={BsPlus} click={handlePopupCreateFile} />}
      </div>
      {!!files.length && (
        <div className={styles.uploads__container}>
          {files.map((item) => {
            return (
              <ButtonDownload
                key={item.id}
                link={item.location}
                title={item.description}
                uloadId={item.id}
                contentId={item.content}
                onEdit={onEdit}
                onRemove={onRemove}
                onCreate={onCreate}
              />
            )
          })}
        </div>
      )}
    </div>
  ) : null
}

export default FilesAttachment
