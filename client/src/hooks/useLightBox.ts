import { IImage } from "../interfaces"
import { useDispatch } from "react-redux"
import { LIGHTBOX_MOVE } from "../redux/toggle/toggleTypes"

const useLightBox = () => {
  const dispatch = useDispatch()

  const getLightBox = (images: IImage[]) => {
    const getIndexImage = (imageId: string) => {
      let index
      for (let i = 0; i < images.length; i++) {
        if (images[i].id === imageId) {
          index = i
          break
        }
      }

      return index || 0
    }

    const checkMoveAccess = (indexImage: number) => {
      const quantity = images.length
      let isLeft = false
      let isRight = false
      if (indexImage + 1 < quantity) {
        isRight = true
      }
      if (indexImage + 1 > 1) {
        isLeft = true
      }
      return { isLeft, isRight }
    }

    const onMove = (isRightArrow: boolean, imageId: string) => {
      const index = getIndexImage(imageId)
      const newIndexImage = isRightArrow ? index + 1 : index - 1
      const nextImageId = images[newIndexImage].id
      const { isLeft, isRight } = checkMoveAccess(newIndexImage)

      dispatch({
        type: LIGHTBOX_MOVE,
        payload: {
          imageId: nextImageId,
          isLeft,
          isRight,
        },
      })
    }

    return {
      getIndexImage,
      checkMoveAccess,
      onMove,
    }
  }

  return { getLightBox }
}

export default useLightBox
