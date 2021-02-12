import React from "react"
// @ts-ignore
import styles from "../styles/button.module"

interface IButtonMenuProps {
  click: any
  active: string
  links: string[]
}

const ButtonMenu: React.FC<IButtonMenuProps> = ({ click, active, links }) => {
  const btns = links.map((link, index) => {
    return (
      <button
        key={link + index}
        onClick={click}
        className={`${styles.btn_menu__link} ${
          active === link && styles.btn_menu__link__active
        }`}
      >
        {link}
      </button>
    )
  })

  return (
    <div className={styles.btn_menu}>
      <button className={styles.btn_menu__toggle}>
        <div>
          <span className={styles.btn_menu__line}></span>
          <span className={styles.btn_menu__line}></span>
          <span className={styles.btn_menu__line}></span>
        </div>
      </button>
      <div className={styles.btn_menu__dropdown}>{btns}</div>
    </div>
  )
}

export default ButtonMenu
