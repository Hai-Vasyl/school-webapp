import React, { Fragment, useEffect } from "react"
import { links, buttons } from "../modules/routes"
import { RootStore } from "../redux/store"
import { NavLink, Link } from "react-router-dom"
import { BsSearch, BsBell, BsChatDots } from "react-icons/bs"
import { AiOutlineLogout, AiOutlineCheckCircle } from "react-icons/ai"
import { useSelector, useDispatch } from "react-redux"
import {
  DROPDOWN_TOGGLE,
  AUTHFORM_TOGGLE,
  RESET_TOGGLE,
  CHAT_TOGGLE,
  NOTIFICATIONS_TOGGLE,
} from "../redux/toggle/toggleTypes"
// @ts-ignore
import styles from "../styles/navbar.module"
import { useQuery } from "@apollo/client"
import {
  GET_USER_NOTIFICATIONS,
  GET_UNREAD_MESSAGES,
} from "../fetching/queries"
import { SET_NOTIFICATIONS } from "../redux/notifications/notifTypes"
import { SET_UNREAD_MESSAGES } from "../redux/unreadMsgs/msgsTypes"
import ButtonAction from "./ButtonAction"
import NavigLink from "./NavigLink"
// @ts-ignore
import logo from "../images/logo.png"
import { access } from "../modules/accessModifiers"
import { ILink } from "../interfaces"
import UserAva from "./UserAva"

const Navbar: React.FC = () => {
  const {
    auth: { user, token },
    toggle: { dropDown, authForm, chat, notifications: notifToggle },
    notifications: { notifications },
    unreadMsgs: { messages },
  } = useSelector((state: RootStore) => state)
  const dispatch = useDispatch()
  const { data: dataNotifications } = useQuery(GET_USER_NOTIFICATIONS)
  const { data: dataMessages } = useQuery(GET_UNREAD_MESSAGES)

  useEffect(() => {
    const notifData = dataNotifications && dataNotifications.getNotifications
    if (notifData) {
      dispatch({ type: SET_NOTIFICATIONS, payload: notifData })
    }
  }, [dispatch, dataNotifications])

  useEffect(() => {
    const messages = dataMessages && dataMessages.getUnreadMessages
    if (messages) {
      dispatch({ type: SET_UNREAD_MESSAGES, payload: messages })
    }
  }, [dispatch, dataMessages])

  const handleDropDown = () => {
    dispatch({ type: DROPDOWN_TOGGLE })
  }

  const handleLogout = () => {
    console.log("LOGOUT!")
  }

  const getActionButtons = () => {
    return Object.keys(buttons).map((key) => {
      // @ts-ignore
      switch (key) {
        case buttons.search.keyWord:
          return (
            <ButtonAction
              key={key}
              Icon={buttons.search.Icon}
              click={() => {}}
            />
          )
        case buttons.chat.keyWord:
          return (
            <ButtonAction
              key={key}
              Icon={buttons.chat.Icon}
              click={() => dispatch({ type: CHAT_TOGGLE })}
            />
          )
        case buttons.notif.keyWord:
          return (
            <ButtonAction
              key={key}
              Icon={buttons.notif.Icon}
              click={() => dispatch({ type: NOTIFICATIONS_TOGGLE })}
            />
          )
      }
    })
  }

  const reduceMapLins = (links: ILink[]) => {
    return links.map(({ to, exact, title, extraLinks }) => {
      if (extraLinks) {
        return (
          <div className={styles.link__wrapper_dropdown}>
            <button className={`${styles.link} ${styles.link__drop}`}>
              <span className={styles.link__text}>{title}</span>
            </button>
            <div className={styles.link__dropdown}>
              {extraLinks.map((link: ILink) => {
                return (
                  <NavigLink
                    key={link.to}
                    title={link.title}
                    exact={!!link.exact}
                    to={link.to || ""}
                  />
                )
              })}
            </div>
          </div>
        )
      }
      return <NavigLink key={to} title={title} exact={!!exact} to={to || ""} />
    })
  }

  const getLinks = () => {
    switch (user.role) {
      case access.admin.keyWord:
        return reduceMapLins(links.admin)
      case access.teacher.keyWord:
        return reduceMapLins(links.teacher)
      case access.student.keyWord:
        return reduceMapLins(links.student)
      case access.user.keyWord:
        return reduceMapLins(links.user)
      default:
        return reduceMapLins(links.unregistered)
    }
  }

  let countUnreadNotif = 0
  notifications.forEach((notif) => {
    if (!notif.active) {
      countUnreadNotif++
    }
  })
  return (
    <div className={styles.nav}>
      <div className={styles.nav__actions_wrapper}>
        <div className={styles.nav__actions}>
          <Link to='/' className={styles.nav__logo}>
            <img src={logo} className={styles.nav__logo_img} alt='logotype' />
          </Link>
          <div className={styles.nav__title}>
            <Link to='/'>Lorem ipsum dolor sit amet</Link>
          </div>
          <div className={styles.nav__action_btns}>{getActionButtons()}</div>
        </div>
      </div>
      <div className={styles.nav__wrapper_menu}>
        <div className={styles.nav__menu}>
          <div className={styles.nav__links}>{getLinks()}</div>
          {token.length ? (
            <div className={styles.user}>
              <button className={styles.user__btn}>
                <span className={styles.user__firstname}>
                  {user.firstname.slice(0, 1)}
                </span>
                <span className={styles.user__lastname}>
                  {user.lastname.slice(0, 1)}
                </span>
                <div className={styles.user__ava}>
                  <UserAva
                    color={user.color}
                    ava={user.ava}
                    firstname={user.firstname}
                    lastname={user.lastname}
                  />
                </div>
              </button>
              <div className={styles.user__dropdown}>
                <NavigLink to={`/profile/${user.id}`} title='Мій кабінет' />
                <button className={styles.link} onClick={handleLogout}>
                  <span className={styles.link__text}>Вийти</span>
                </button>
              </div>
            </div>
          ) : (
            <button className={styles.btn_login}>
              <span className={styles.btn_login__text}>Увійти</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar
