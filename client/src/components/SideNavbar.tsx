import React from "react"
// @ts-ignore
import styles from "../styles/pages.module"

interface ILink {
  title: string
  id: string
}

interface ISideNavbarProps {
  links: ILink[]
  active: string
  setActive: any
  exClass: string
}

const SideNavbar: React.FC<ISideNavbarProps> = ({
  links,
  active,
  setActive,
  exClass,
}) => {
  const handleSetActive = (value: string) => {
    setActive(value)
  }

  const linksJSX = links.map((link: ILink) => {
    return (
      <button
        key={link.id}
        className={`${styles.side_link} ${
          active === link.id && styles.side_link__active
        }`}
        onClick={() => handleSetActive(link.id)}
      >
        {link.title}
      </button>
    )
  })

  return <div className={`${styles.side_navbar} ${exClass}`}>{linksJSX}</div>
}

export default SideNavbar
