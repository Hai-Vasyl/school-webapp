import React from "react"
import { NavLink } from "react-router-dom"
// @ts-ignore
import styles from "../styles/navbar.module.scss"
import { RESET_TOGGLE } from "../redux/toggle/toggleTypes"
import { useDispatch } from "react-redux"

interface INavLinkProps {
  to: string
  exact?: boolean
  title: string
  dropdown?: boolean
  Icon?: any
}

const NavigLink: React.FC<INavLinkProps> = ({
  to,
  exact,
  title,
  dropdown,
  Icon,
}) => {
  const dispatch = useDispatch()

  return (
    <NavLink
      onClick={() => dispatch({ type: RESET_TOGGLE })}
      to={to}
      exact={exact}
      className={`${styles.link} ${dropdown && styles.link__dropdown_menu}`}
      activeClassName={styles.link__active}
    >
      {Icon && <Icon className={styles.link__text_icon} />}
      <span className={styles.link__text}>{title}</span>
    </NavLink>
  )
}

export default NavigLink
