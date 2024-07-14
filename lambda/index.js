const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const sharp = require("sharp");

const s3 = new S3Client();

exports.handler = async (event, context, callback) => {
  const Bucket = event.Records[0].s3.bucket.name;
  const Key = decodeURIComponent(event.Records[0].s3.object.key);
  console.log(Bucket, Key);
  const filename = Key.split("/")[Key.split("/").length - 1];
  const ext = Key.split(".")[Key.split(".").length - 1].toLowerCase();
  const requiredFormat = ext === "jpg" ? "jpeg" : ext;
  console.log(
    "filename",
    filename,
    "ext",
    ext,
    "requiredFormat",
    requiredFormat
  );
  try {
    const getObjectCommand = new GetObjectCommand({ Bucket, Key });
    const s3Object = await s3.send(getObjectCommand);
    const resizedImage = await sharp(s3Object.Body)
      .resize(400, 400, { fit: "inside" })
      .toFormat(requiredFormat)
      .toBuffer();

    const putObjectCommand = new PutObjectCommand({
      Bucket,
      Key: `thumb/${filename}`,
      Body: resizedImage,
    });
    await s3.send(putObjectCommand);
    console.log("put", resizedImage.length);
    return callback(null, `thumb/${filename}`);
  } catch (error) {
    console.error(error);
    return callback(error);
  }
};
