import React from "react"
import { NavLink } from "react-router-dom"
// @ts-ignore
import styles from "../styles/navbar.module.scss"

interface INavLinkProps {
  to: string
  exact?: boolean
  title: string
}

const NavigLink: React.FC<INavLinkProps> = ({ to, exact, title }) => {
  return (
    <NavLink to={to} exact={exact} className={styles.link}>
      <span className={styles.link__text}>{title}</span>
    </NavLink>
  )
}

export default NavigLink
