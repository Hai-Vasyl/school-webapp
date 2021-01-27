import React from "react"
import ButtonTab from "./ButtonTab"
import { BsPencilSquare, BsTrash } from "react-icons/bs"
import { IOwner } from "../interfaces"
import UserCard from "./UserCard"
import { convertDate } from "../helpers/convertDate"
// @ts-ignore
import styles from "../styles/groups.module"
import { Link, useHistory } from "react-router-dom"
import { WARNING_OPEN, AUTHFORM_TOGGLE } from "../redux/toggle/toggleTypes"
import { useDispatch } from "react-redux"

interface IGroupPreviewProps {
  id: string
  name: string
  date: string
  owner: IOwner
  groupId: string
}

const GroupPreview: React.FC<IGroupPreviewProps> = ({
  id,
  name,
  date,
  owner,
  groupId,
}) => {
  const history = useHistory()
  const dispatch = useDispatch()

  const handleDeleteGroup = (groupId: string) => {
    console.log({ groupId })
  }

  return (
    <div
      className={`${styles.group} ${groupId === id && styles.group__active}`}
    >
      <div className={styles.group__header}>
        <Link to={`/groups/${id}`} className={styles.group__name}>
          {name}
        </Link>
        <ButtonTab
          exClass={styles.group__btn_edit}
          click={() => history.push(`/edit-group/${id}`)}
          Icon={BsPencilSquare}
        />
        <ButtonTab
          exClass={styles.group__btn_delete}
          click={() =>
            dispatch({
              type: WARNING_OPEN,
              payload: {
                action: () => handleDeleteGroup(id),
                title: `Видалити клас "${name}" та вcіх його учасників?`,
              },
            })
          }
          Icon={BsTrash}
        />
      </div>
      <div className={styles.group__body}>
        <p className={styles.group__owner_text}>Керівник</p>
        <UserCard isEnvChat={false} isLink={true} user={owner} />
      </div>
      <div className={styles.group__footer}>
        <span className={styles.group__date_text}>Останнє оновлення</span>
        <span className={styles.group__date}>{convertDate(date)}</span>
      </div>
    </div>
  )
}

export default GroupPreview
