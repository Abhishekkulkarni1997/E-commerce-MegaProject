import Product from "../Models/product";
import formidable from "formidable";
import fs from "fs"; // node builtin module
import { deleteFile, s3FileUpload } from "../services/imageUploader";
import Mongoose from "mongoose";
import asyncHandler from "../services/asyncHandler";
import customError from "../utils/customError";
import config from "../config/index";

/**************** 
@addProduct
@route http://localhost:4000/api/addProduct
@description to add a product
@params name
@returns product object

*************************/
export const addProduct = asyncHandler(async (req, res) => {
  const form = formidable({
    multiples: true,
    keepExtensions: true,
  });

  form.parse(req, async function (err, fields, files) {
    try {
      if (err) {
        throw new customError(err.message || "something went wrong", 500);

        let productId = new Mongoose.Types.ObjectId().toHexString(); //we are generating ID using mongoose to store in DB

        //console.log(fie, files);
        if (
          !fields.name ||
          !fields.price ||
          !fields.description ||
          !fields.collectionId
        ) {
          throw new customError("Fill all the details", 500);
        }

        // handling images
        let imgArrayResp = Promise.all(
          Object.keys(files).map(async (fileKey, index) => {
            const element = files[fileKey]; //mandatory step in formidable docs

            const data = fs.readFileSync(element.filepath);

            const upload = await s3FileUpload({
              bucketName: config.S3_BUCKET_NAME,
              key: `products/${productId}/photo_${index + 1}.png`,
              body: data,
              contentType: element.mimetype,
            });
            return {
              secure_url: upload.Location,
            };
          })
        );
        let imgArray = await imgArrayResp;

        const product = await Product.create({
          _id: productId,
          photos: imgArray,
          ...fields,
        });
        if (!product) {
          throw new customError("product was not created", 400);
          // if failed then remove image
        }

        res.status(200).json({
          success: true,
          product,
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || "something went wrong",
      });
    }
  });
});
