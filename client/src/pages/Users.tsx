import React, { useEffect, useRef } from "react"
import Title from "../components/Title"
import NewsEventsModuleContainer from "../components/NewsEventsModuleContainer"
import NewsEventsModule from "../components/NewsEventsModule"
import FooterModule from "../components/FooterModule"
import { INewsEventSlider } from "../interfaces"
import { GET_USERS } from "../fetching/queries"
import { useQuery } from "@apollo/client"
import Loader from "../components/Loader"
import { Link } from "react-router-dom"
import { getUserAccess } from "../modules/accessModifiers"
import { useSelector } from "react-redux"
import { RootStore } from "../redux/store"
// @ts-ignore
import styles from "../styles/users.module"
import UserAva from "../components/UserAva"

interface IUserCard {
  id: string
  email: string
  ava: string
  color: string
  firstname: string
  lastname: string
  role: string
}

const Users: React.FC = () => {
  const anchor = useRef<HTMLDivElement>(null)
  const {
    auth: { user },
  } = useSelector((state: RootStore) => state)
  const { data: users, loading: loadUsers } = useQuery(GET_USERS)

  useEffect(() => {
    anchor.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [])

  const cards =
    users &&
    users.getAllUsers.map((item: IUserCard) => {
      const userParams = getUserAccess(item.role)
      return (
        <div
          key={item.id}
          className={`${styles.card} ${
            user.id === item.id && styles.card__active
          }`}
        >
          <Link to={`/profile/${item.id}`} className={styles.card__preview}>
            <UserAva
              color={item.color}
              ava={item.ava}
              firstname={item.firstname}
              lastname={item.lastname}
              middle
            />
            <span className={styles.card__icon}>
              {userParams && <userParams.Icon />}
            </span>
          </Link>
          <div className={styles.card__body}>
            <Link className={styles.card__title} to={`/profile/${item.id}`}>
              {item.firstname} {item.lastname}
            </Link>
            <span className={styles.card__subtitle}>{item.email}</span>
          </div>
        </div>
      )
    })

  return (
    <div className='container'>
      <div ref={anchor}></div>
      <Title title='Усі користувачі' path='/profile' />
      <div className='wrapper'>
        {loadUsers ? <Loader /> : <div className={styles.users}>{cards}</div>}
      </div>
      <NewsEventsModuleContainer isNews={true}>
        {(items: INewsEventSlider[], loading: boolean, isNews: boolean) => (
          <NewsEventsModule items={items} loading={loading} isNews={isNews} />
        )}
      </NewsEventsModuleContainer>
      <FooterModule />
    </div>
  )
}

export default Users
