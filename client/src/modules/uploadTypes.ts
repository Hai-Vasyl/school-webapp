import { BsNewspaper, BsCalendar, BsImage } from "react-icons/bs"

export const types = {
  image: {
    keyWord: "image",
    label: "Зображення",
    Icon: BsImage,
  },
  news: {
    keyWord: "news",
    label: "Новини",
    Icon: BsNewspaper,
  },
  event: {
    keyWord: "event",
    label: "Події",
    Icon: BsCalendar,
  },
}

export const getParamsByType = (type: string) => {
  switch (type) {
    case types.image.keyWord:
      return types.image
    case types.news.keyWord:
      return types.news
    case types.event.keyWord:
      return types.event
  }
}
