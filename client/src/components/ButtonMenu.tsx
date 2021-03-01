import React from "react"
// @ts-ignore
import styles from "../styles/button.module"
import { useSelector, useDispatch } from "react-redux"
import { MENU_PAGE_TOGGLE } from "../redux/toggle/toggleTypes"
import { RootStore } from "../redux/store"

interface IButtonMenuProps {
  active?: string
  setActive: any
  links: string[]
}

const ButtonMenu: React.FC<IButtonMenuProps> = ({
  active,
  links,
  setActive,
}) => {
  const {
    toggle: { menuPage },
  } = useSelector((state: RootStore) => state)
  const dispatch = useDispatch()

  const handleSetActive = (value: string) => {
    setActive(value)
    dispatch({ type: MENU_PAGE_TOGGLE })
  }

  const btns = links.map((link, index) => {
    return (
      <button
        key={link + index}
        onClick={() => handleSetActive(link)}
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
      <button
        className={`${styles.btn_menu__toggle} ${
          menuPage && styles.btn_menu__toggle__active
        }`}
        onClick={() => dispatch({ type: MENU_PAGE_TOGGLE })}
      >
        <div>
          <span className={styles.btn_menu__line}></span>
          <span className={styles.btn_menu__line}></span>
          <span className={styles.btn_menu__line}></span>
        </div>
      </button>
      <div
        className={`${styles.btn_menu__dropdown} ${
          menuPage && styles.btn_menu__dropdown__open
        }`}
      >
        {btns}
      </div>
    </div>
  )
}

export default ButtonMenu
