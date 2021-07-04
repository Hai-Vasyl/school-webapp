import React from "react"
// @ts-ignore
import styles from "../styles/card.module"
import { useHistory } from "react-router-dom"
import { IOwner } from "../interfaces"
import UserAva from "./UserAva"
import { getUserAccess } from "../modules/accessModifiers"
import { BsCheck } from "react-icons/bs"

interface IUserCardProps {
  isLink: boolean
  user: IOwner
  minimize?: boolean
  check?(): any
  checked?: boolean
  exClass?: string
}

const UserCard: React.FC<IUserCardProps> = ({
  user,
  isLink,
  minimize,
  check,
  checked,
  exClass,
}) => {
  const history = useHistory()

  const handleLink = () => {
    if (isLink) {
      history.push(`/profile/${user.id}`)
    }
  }

  const userAccess = getUserAccess(user.role)

  return (
    <div
      className={`${styles.card} ${
        check && styles.card__checkbox_extra
      } ${exClass} ${minimize && styles.card__minimized}`}
    >
      {check && (
        <button className={styles.card__checkbox} onClick={check}>
          <BsCheck
            className={`${styles.card__check} ${
              checked && styles.card__check__active
            }`}
          />
        </button>
      )}
      <button onClick={handleLink} className={styles.card__link}>
        {userAccess.Icon && (
          <div className={styles.card__icon}>
            <userAccess.Icon />
          </div>
        )}
        <UserAva
          color={user.color}
          ava={user.ava}
          firstname={user.firstname}
          lastname={user.lastname}
        />
      </button>
      <div className={styles.card__about}>
        <button onClick={handleLink} className={styles.card__title}>
          {user.firstname} {user.lastname}
        </button>
        <p className={styles.card__subtitle}>{user.email}</p>
      </div>
    </div>
  )
}

export default UserCard
