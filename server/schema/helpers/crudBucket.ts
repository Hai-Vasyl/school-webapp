import { config } from "dotenv"
import { v4 as uuidv4 } from "uuid"
import AWS from "aws-sdk"
const stream = require("stream")
config()
const { AWS_ID, AWS_SECRET } = process.env

const s3 = new AWS.S3({
  accessKeyId: AWS_ID,
  secretAccessKey: AWS_SECRET,
})

const getInitParams = (
  filename: string,
  createReadStream: any,
  Bucket: string
) => {
  return {
    ACL: "public-read",
    Bucket,
    Key: `${uuidv4()}.${filename}`,
    Body: createReadStream(),
  }
}

const deleteFileBucket = async (fileKey: string, Bucket: string) => {
  if (fileKey) {
    // @ts-ignore
    await s3
      .deleteObject({
        Key: fileKey,
        Bucket,
      })
      .promise()
  }
}

export const uploadFile = async (file: any, Bucket: string) => {
  try {
    const { createReadStream, filename } = await file
    const params: any = getInitParams(filename, createReadStream, Bucket)

    const uploaded = await s3.upload(params).promise()
    return uploaded
  } catch (error) {
    throw new Error(`Uploading file to aws bucket error: ${error.message}`)
  }
}

export const updateFile = async (
  file: any,
  fileKey: string,
  Bucket: string
) => {
  try {
    const { createReadStream, filename } = await file

    deleteFileBucket(fileKey, Bucket)

    const params: any = getInitParams(filename, createReadStream, Bucket)

    const uploaded = await s3.upload(params).promise()
    return uploaded
  } catch (error) {
    throw new Error(`Updating file in aws bucket error: ${error.message}`)
  }
}

export const deleteFile = async (fileKey: string, Bucket: string) => {
  try {
    deleteFileBucket(fileKey, Bucket)
  } catch (error) {
    throw new Error(`Deleting file in aws bucket error: ${error.message}`)
  }
}
