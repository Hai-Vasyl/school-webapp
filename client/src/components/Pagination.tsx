import React from "react"
// @ts-ignore
import styles from "../styles/button.module"
import { BsArrowLeft, BsArrowRight } from "react-icons/bs"

interface IPaginatonProps {
  quantityItem: number
  amountItemsPage: number
  currentPageNumber: number
  getRedirectLink(number: number): any
  isTop?: boolean
}

const Pagination: React.FC<IPaginatonProps> = ({
  quantityItem,
  amountItemsPage,
  currentPageNumber,
  getRedirectLink,
  isTop,
}) => {
  const handleRedirectPage = (number: number) => {
    getRedirectLink(number)
  }

  const getQuantityPages = () => {
    const numPages = Math.ceil(quantityItem / amountItemsPage)
    return numPages
  }

  const checkPageNumber = (number: number) => {
    const limit = getQuantityPages()
    if (number < limit) {
      return { current: true, next: true }
    } else if (number === limit) {
      return { current: true, next: false }
    } else {
      return { current: false, next: false }
    }
  }

  let countNumber = currentPageNumber - 2
  if (countNumber <= 0) {
    countNumber = 1
  }
  let pageNumbers = []
  let i = 0
  while (i !== 5) {
    const { current, next } = checkPageNumber(countNumber)
    if (current && next) {
      pageNumbers.push(countNumber)
      countNumber++
      i++
    } else if (current) {
      pageNumbers.push(countNumber)
      break
    } else {
      break
    }
  }

  const handleMoveToPage = (isRight: boolean) => {
    getRedirectLink(isRight ? currentPageNumber + 1 : currentPageNumber - 1)
  }

  const pageNumbersJSX = pageNumbers.map((number) => {
    const equalNumbers = currentPageNumber === number
    return (
      <button
        key={number}
        className={`${styles.btn_pagination} ${
          equalNumbers && styles.btn_pagination__active
        }`}
        onClick={() => (equalNumbers ? {} : handleRedirectPage(number))}
      >
        <span>{number}</span>
      </button>
    )
  })

  const btnArrowLeft =
    currentPageNumber - 1
      ? checkPageNumber(currentPageNumber - 1).current
      : false
  const btnArrowRight = checkPageNumber(currentPageNumber + 1).current
  return (
    <div
      className={`${styles.btns_pagination} ${
        isTop && styles.btns_pagination__top
      }`}
    >
      <button
        className={`${styles.btn_pagination} ${styles.btn_pagin_arrow} ${
          !btnArrowLeft && styles.btn_pagin_arrow__disabled
        }`}
        onClick={() => (btnArrowLeft ? handleMoveToPage(false) : {})}
      >
        <BsArrowLeft />
      </button>
      {pageNumbersJSX}
      <button
        className={`${styles.btn_pagination} ${styles.btn_pagin_arrow} ${
          !btnArrowRight && styles.btn_pagin_arrow__disabled
        }`}
        onClick={() => (btnArrowRight ? handleMoveToPage(true) : {})}
      >
        <BsArrowRight />
      </button>
    </div>
  )
}

export default Pagination
