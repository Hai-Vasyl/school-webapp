import React from "react"
import { Link } from "react-router-dom"
// @ts-ignore
import styles from "../styles/pages.module"
// @ts-ignore
import logoImg from "../images/logo.png"
import { FaFacebook, FaInstagram, FaYoutube, FaTelegram } from "react-icons/fa"

const FooterModule: React.FC = () => {
  const socialLinks = [
    {
      to: "",
      Icon: FaFacebook,
      title: "Facebook",
    },
    {
      to: "",
      Icon: FaInstagram,
      title: "Instagram",
    },
    {
      to: "",
      Icon: FaYoutube,
      title: "YouTube",
    },
    {
      to: "",
      Icon: FaTelegram,
      title: "Telegram",
    },
  ]
  const links = {
    stack_1: [
      {
        to: "/",
        title: "Головна",
      },
      { to: "/about", title: "Про школу" },
      { to: "/team", title: "Команда" },
      {
        to: "/news",
        title: "Новини",
      },
    ],
    stack_2: [
      {
        to: "/events",
        title: "Події",
      },
      {
        to: "/library",
        title: "Бібліотека",
      },
      {
        to: "/gallery",
        title: "Галерея",
      },
      {
        to: "/management",
        title: "Управління",
      },
    ],
    stack_3: [
      {
        to: "/projects",
        title: "Проекти",
      },
      {
        to: "/contacts",
        title: "Контакти",
      },
      {
        to: "/schedule",
        title: "Розклад занять",
      },
    ],
  }

  const reduceMapLinks = (
    native: boolean,
    links: { title: string; to: string; Icon?: any }[]
  ) => {
    return links.map((item) => {
      if (native) {
        return (
          <Link className={styles.footer_link} key={item.title} to={item.to}>
            {item.title}
          </Link>
        )
      }
      return (
        <a className={styles.footer_link} key={item.title} href={item.to}>
          <item.Icon className={styles.footer_link__icon} />
          <span>{item.title}</span>
        </a>
      )
    })
  }

  return (
    <div className={styles.module_footer}>
      <div className={`wrapper ${styles.module_footer__flex}`}>
        <div className={styles.module_footer__section}>
          <Link to='/' className={styles.module_footer__logo}>
            <img src={logoImg} alt='logoImg' />
          </Link>
        </div>
        <div className={styles.module_footer__section}>
          <div className={styles.module_footer__subsection}>
            {reduceMapLinks(true, links.stack_1)}
          </div>
          <div className={styles.module_footer__subsection}>
            {reduceMapLinks(true, links.stack_2)}
          </div>
          <div className={styles.module_footer__subsection}>
            {reduceMapLinks(true, links.stack_3)}
          </div>
        </div>
        <div className={styles.module_footer__section}>
          <div className={styles.module_footer__subsection}>
            {reduceMapLinks(false, socialLinks)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FooterModule
