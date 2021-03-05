import React from "react"
import Map from "./Map"
// @ts-ignore
import styles from "../styles/pages.module"
import { AiOutlinePhone } from "react-icons/ai"
import { BsAt } from "react-icons/bs"
import { GoLocation } from "react-icons/go"
import { Link } from "react-router-dom"
import { FaFacebook, FaInstagram, FaYoutube, FaTelegram } from "react-icons/fa"

const ContactsModule: React.FC = () => {
  const contacts = [
    {
      Icon: AiOutlinePhone,
      title: "+380322636263",
      value: "380322636263",
      ref: "tel:+",
    },
    {
      Icon: BsAt,
      title: "school@gmail.com",
      value: "school@gmail.com",
      ref: "mailto:",
    },
    {
      Icon: GoLocation,
      title: "вулиця Наукова, 25, Львів, Львівська область, 79000",
      value: "_",
      ref:
        "https://www.google.com/maps/place/%D0%9B%D1%96%D1%86%D0%B5%D0%B9+%E2%84%9645/@49.8021345,23.9904153,17z/data=!4m13!1m7!3m6!1s0x473ae7bb2a204d0b:0x809f6e33e33c5ab4!2z0LLRg9C70LjRhtGPINCd0LDRg9C60L7QstCwLCAyNSwg0JvRjNCy0ZbQsiwg0JvRjNCy0ZbQstGB0YzQutCwINC-0LHQu9Cw0YHRgtGMLCA3OTAwMA!3b1!8m2!3d49.8021345!4d23.992604!3m4!1s0x473ae7bc119d87cf:0xe5a8fd55df0df4d5!8m2!3d49.8021766!4d23.9928006",
    },
  ]

  return (
    <div className={styles.module_contacts}>
      <div className={styles.module_contacts__flex}>
        <div className={styles.module_contacts__body}>
          <div className={styles.module_contacts__contacts}>
            <div className={styles.module_contacts__title}>
              <Link to='/contacts' className={styles.module__title}>
                Залишайся на зв'язку
              </Link>
            </div>
            {contacts.map((item) => {
              return (
                <div key={item.value} className={styles.contact}>
                  <item.Icon className={styles.contact__icon} />
                  <a
                    className={styles.contact__link}
                    href={`${item.ref}${item.value}`}
                  >
                    {item.title}
                  </a>
                </div>
              )
            })}
            <div className={styles.module_contacts__social_media}>
              <a href='' className={styles.social}>
                <FaFacebook />
              </a>
              <a href='' className={styles.social}>
                <FaInstagram />
              </a>
              <a href='' className={styles.social}>
                <FaYoutube />
              </a>
              <a href='' className={styles.social}>
                <FaTelegram />
              </a>
            </div>
          </div>
        </div>
        <div className={styles.module_contacts__map}>
          <Map />
        </div>
      </div>
    </div>
  )
}

export default ContactsModule
