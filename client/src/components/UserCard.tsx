import React from "react"
// @ts-ignore
import styles from "../styles/card.module"
import { useHistory } from "react-router-dom"
import { IOwner } from "../interfaces"
import { useSelector, useDispatch } from "react-redux"
import { RootStore } from "../redux/store"
import { CHAT_OPEN } from "../redux/toggle/toggleTypes"
import { SET_ACTIVE_CHAT } from "../redux/chatActive/chatActiveTypes"
import keyWords from "../modules/keyWords"
import UserAva from "./UserAva"
import { getUserAccess } from "../modules/accessModifiers"

interface IUserCardProps {
  isEnvChat: boolean
  isLink: boolean
  user: IOwner
}

const UserCard: React.FC<IUserCardProps> = ({ user, isEnvChat, isLink }) => {
  const { chats } = useSelector((state: RootStore) => state)
  const dispatch = useDispatch()
  const history = useHistory()
  let isPinned = false
  let chatId: string

  chats.forEach((chat) => {
    if (chat.owners && chat.owners.find((owner) => owner.id === user.id)) {
      isPinned = true
      chatId = chat.id
    }
  })

  const handleLink = () => {
    if (isLink) {
      history.push(`/profile/${user.id}`)
    } else {
      if (!isEnvChat) {
        dispatch({ type: CHAT_OPEN })
      }
      dispatch({
        type: SET_ACTIVE_CHAT,
        payload: {
          keyWord: isPinned ? keyWords.chatMessages : keyWords.userConnect,
          chatId: isPinned ? chatId : user.id,
        },
      })
    }
  }

  const userAccess = getUserAccess(user.role)

  return (
    <div className={styles.card}>
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
