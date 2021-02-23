import { useState } from "react"

type CarouselProps = (numSlides: number) => any

const useCarousel: CarouselProps = (numSlides) => {
  const [params, setParams] = useState({
    isRight: false,
    previousItem: 1,
    currentItem: 0,
  })

  const handleMoveSlide = (isRight: boolean) => {
    let nextItem
    if (isRight && params.currentItem === numSlides - 1) {
      nextItem = 0
    } else if (!isRight && params.currentItem === 0) {
      nextItem = numSlides - 1
    } else {
      nextItem = isRight ? params.currentItem + 1 : params.currentItem - 1
    }

    setParams({
      isRight,
      previousItem: params.currentItem,
      currentItem: nextItem,
    })
  }

  const handleClickSlide = (index: number) => {
    let isRight
    if (index > params.currentItem) {
      isRight = true
    } else if (index < params.currentItem) {
      isRight = false
    } else {
      return
    }

    setParams({
      isRight,
      previousItem: params.currentItem,
      currentItem: index,
    })
  }
  return { params, handleMoveSlide, handleClickSlide }
}

export default useCarousel
