import { RiRestaurant2Line } from "react-icons/ri"

export const getColor = () => {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16)
  return "#" + randomColor
}
