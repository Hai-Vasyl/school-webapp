import React from "react"
// @ts-ignore
import styles from "../styles/pages.module"

interface ISideNavbarProps {
  links: string[]
  active: string
  setActive: any
  exClass: string
}

const SideNavbar: React.FC<ISideNavbarProps> = ({
  links,
  active,
  setActive,
  exClass
}) => {
  const handleSetActive = (value: string) => {
    setActive(value)
  }

  const linksJSX = links.map((link: string, index: number) => {
    return (
      <button
        key={link + index}
        className={`${styles.side_link} ${
          active === link && styles.side_link__active
        }`}
        onClick={() => handleSetActive(link)}
      >
        {link}
      </button>
    )
  })

  return <div className={`${styles.side_navbar} ${exClass}`}>{linksJSX}</div>
}

export default SideNavbar
