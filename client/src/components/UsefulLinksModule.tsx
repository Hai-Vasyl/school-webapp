import React from "react"
// @ts-ignore
import styles from "../styles/pages.module"
// @ts-ignore
import logo_1 from "../images/root_quality_edu.svg"
// @ts-ignore
import logo_2 from "../images/tmp_ua_gerb.png"
// @ts-ignore
import logo_3 from "../images/logo_education_inst.png"
// @ts-ignore
import logo_4 from "../images/schooltoday.png"

const UsefulLinksModule: React.FC = () => {
  const links = [
    { logo: logo_1, link: "https://mon.gov.ua/ua" },
    { logo: logo_2, link: "http://www.sqe.gov.ua/index.php/uk-ua/" },
    { logo: logo_3, link: "https://testportal.gov.ua/" },
    { logo: logo_4, link: "https://school-today.com/" },
  ]

  return (
    <div className={styles.module_links}>
      <div className={styles.module_links__wrapper}>
        <div className={styles.module_links__flex}>
          {links.map((link) => {
            return (
              <a href={link.link} key={link.link} className={styles.link}>
                <img src={link.logo} alt='linkLogo' />
              </a>
            )
          })}
        </div>
        <div className={styles.module_links__flex}>
          {links.map((link) => {
            return (
              <a href={link.link} key={link.link} className={styles.link}>
                <img src={link.logo} alt='linkLogo' />
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default UsefulLinksModule
