import { IUploadSection } from "../interfaces"

const useFilterFiles = () => {
  const filterFiles = (uploads: IUploadSection[]) => {
    let files = []
    let images = []
    for (let i = 0; i < uploads.length; i++) {
      if (uploads[i].format === "file") {
        files.push(uploads[i])
      } else {
        images.push(uploads[i])
      }
    }
    return { files, images }
  }
  return { filterFiles }
}

export default useFilterFiles
