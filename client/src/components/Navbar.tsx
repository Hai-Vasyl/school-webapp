import React, { useEffect, useState } from "react"
import { getLinks } from "../modules/routes"
import { RootStore } from "../redux/store"
import { NavLink, Link } from "react-router-dom"
import { BsSearch, BsCaretRightFill } from "react-icons/bs"
import { AiOutlineLogout, AiOutlineCheckCircle } from "react-icons/ai"
import { BiUserCircle } from "react-icons/bi"
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
import NavigLink from "./NavigLink"
// @ts-ignore
import logo from "../images/logo.png"
import { access } from "../modules/accessModifiers"
import { ILink } from "../interfaces"
import UserAva from "./UserAva"
import { RESET_AUTH } from "../redux/auth/authTypes"

const Navbar: React.FC = () => {
  const {
    auth: { user, token },
    toggle: { dropDown, authForm, chat, notifications: notifToggle },
    notifications: { notifications },
    unreadMsgs: { messages },
  } = useSelector((state: RootStore) => state)
  const [search, setSearch] = useState("")
  const [changeNav, setChangeNav] = useState(false)
  const dispatch = useDispatch()
  const { data: dataNotifications } = useQuery(GET_USER_NOTIFICATIONS)
  const { data: dataMessages } = useQuery(GET_UNREAD_MESSAGES)

  useEffect(() => {
    window.addEventListener("scroll", changeNavbar)
    return () => {
      window.removeEventListener("scroll", changeNavbar)
    }
  })

  const changeNavbar = () => {
    if (window.scrollY > 80) {
      setChangeNav(true)
    } else {
      setChangeNav(false)
    }
  }

  // useEffect(() => {
  //   const notifData = dataNotifications && dataNotifications.getNotifications
  //   if (notifData) {
  //     dispatch({ type: SET_NOTIFICATIONS, payload: notifData })
  //   }
  // }, [dispatch, dataNotifications])

  // useEffect(() => {
  //   const messages = dataMessages && dataMessages.getUnreadMessages
  //   if (messages) {
  //     dispatch({ type: SET_UNREAD_MESSAGES, payload: messages })
  //   }
  // }, [dispatch, dataMessages])

  const handleDropDown = () => {
    dispatch({ type: DROPDOWN_TOGGLE })
  }

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  const handleSubmitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log("SEARCH!")
  }

  const handleLogout = () => {
    dispatch({ type: RESET_TOGGLE })
    dispatch({ type: RESET_AUTH })
  }

  const reduceMapLins = (links: ILink[]) => {
    return links.map(({ to, exact, title, extraLinks }) => {
      if (extraLinks) {
        return (
          <div key={title} className={styles.link__wrapper_dropdown}>
            <button
              className={`${styles.link} ${styles.link__drop}`}
              onClick={() => dispatch({ type: RESET_TOGGLE })}
            >
              <span className={styles.link__text}>{title}</span>
              <BsCaretRightFill className={styles.link__icon} />
            </button>
            <div className={styles.link__dropdown}>
              {extraLinks.map((link: ILink) => {
                return (
                  <NavigLink
                    key={link.to}
                    title={link.title}
                    exact={!!link.exact}
                    dropdown
                    to={link.to || ""}
                  />
                )
              })}
            </div>
          </div>
        )
      }
      return (
        <NavigLink key={title} title={title} exact={!!exact} to={to || ""} />
      )
    })
  }

  let countUnreadNotif = 0
  notifications.forEach((notif) => {
    if (!notif.active) {
      countUnreadNotif++
    }
  })
  return (
    <div className={`${styles.nav} ${changeNav && styles.nav__reduce}`}>
      <div className={styles.nav__border}></div>
      <div className={styles.nav__actions_wrapper}>
        <div className={styles.nav__actions}>
          <Link
            to='/'
            className={styles.nav__logo}
            onClick={() => dispatch({ type: RESET_TOGGLE })}
          >
            <img
              src='https://school-website-upload-bucket.s3-eu-west-1.amazonaws.com/logo_45_2.svg'
              className={styles.nav__logo_img}
              alt='logotype'
            />
            {/* <img
              src='https://school-website-upload-bucket.s3-eu-west-1.amazonaws.com/logo_45_1.svg'
              className={styles.nav__logo_img}
              alt='logotype'
            /> */}
          </Link>
          <div className={styles.nav__title}>
            <Link to='/' onClick={() => dispatch({ type: RESET_TOGGLE })}>
              Назва навчального закладу
            </Link>
          </div>
          <form onSubmit={handleSubmitSearch} className={styles.search}>
            <input
              type='text'
              value={search}
              className={styles.search__input}
              placeholder='Пошук'
              onChange={handleChangeSearch}
            />
            <BsSearch className={styles.search__button} />
          </form>
        </div>
      </div>
      <div className={styles.nav__border_second}>
        <div></div>
        <div className={styles.nav__border_second__content}>
          <div></div>
          <div></div>
        </div>
        <div></div>
      </div>
      <div className={styles.nav__wrapper_menu}>
        <div className={styles.nav__menu}>
          <div className={styles.nav__links}>
            {reduceMapLins(getLinks(user.role))}
          </div>
          {token.length ? (
            <div className={`${styles.link__wrapper_dropdown} ${styles.user}`}>
              <button
                className={`${styles.user__btn} ${styles.link__drop}`}
                onClick={() => dispatch({ type: RESET_TOGGLE })}
              >
                <div className={styles.user__name}>
                  <span className={styles.user__firstname}>
                    {user.firstname.slice(0, 1)}
                  </span>
                  <span className={styles.user__lastname}>
                    {user.lastname.slice(0, 1)}
                  </span>
                </div>
                <div className={styles.user__ava}>
                  <UserAva
                    color={user.color}
                    ava={user.ava}
                    firstname={user.firstname}
                    lastname={user.lastname}
                  />
                </div>
              </button>
              <div
                className={`${styles.link__dropdown} ${styles.link__dropdown_right}`}
              >
                <NavigLink
                  to={`/profile/${user.id}`}
                  title='Мій кабінет'
                  dropdown
                  Icon={BiUserCircle}
                />
                <button
                  className={`${styles.link} ${styles.link__dropdown_menu}`}
                  onClick={handleLogout}
                >
                  <AiOutlineLogout className={styles.link__text_icon} />
                  <span className={styles.link__text}>Вийти</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              className={`${styles.btn_login} ${
                authForm && styles.btn_login__active
              }`}
              onClick={() => dispatch({ type: AUTHFORM_TOGGLE })}
            >
              <span className={styles.btn_login__text}>Увійти</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar
