// TODO: CRUD for collection create another handler collection.controller.js

import Collection from "../Models/Collection";
import asyncHandler from "../services/asyncHandler";
import customError from "../utils/customError";

/**************** 
@CreateCollection
@route http://localhost:4000/api/collection
@description create a collection
@params collection name
@returns collection object

*************************/
export const createCollection = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    throw new customError("Collection should have a name", 400);
  }
  // add the value to DB
  const collection = await Collection.save({ name });

  // Send the value to frontend

  res.status(200).json({
    success: true,
    message: "Collection created successfully",
    collection,
  });
});

/**************** 
@updateCollection
@route http://localhost:4000/api/updateCollection/:id
@description update a collection name
@params collection name and id
@returns collection object

*************************/
export const updateCollection = asyncHandler(async (req, res) => {
  //existing value to be udpated
  const { id: collectionId } = req.params;
  const { newName } = req.body;

  if (!newName) {
    throw new customError("Collection name is required", 400);
  }
  const updatedCollection = await Collection.findByIdAndUpdate(
    collectionId,
    {
      newName,
    },
    {
      new: true, // to get new updated value in response updatedCollection
      runValidators: true,
    }
  );

  // to check if we found the collection or not
  if (!updatedCollection) {
    throw new customError("Collection not found", 400);
  }

  // send response to frontend

  res.status(200).json({
    success: true,
    message: "Collection name is udpated",
    updateCollection,
  });
});

/**************** 
@deleteCollection
@route http://localhost:4000/api/deleteCollection/:id
@description delete a collection name
@params collection name and id
@returns collection object

*************************/

export const deleteCollection = asyncHandler(async (req, res) => {
  const { id: collectionId } = req.params;

  const collectionDeleted = await Collection.findByIdAndDelete(collectionId);

  // to check if we found the collection or not
  if (!collectionDeleted) {
    throw new customError("Collection not found", 400);
  }

  res.status(200).json({
    success: true,
    message: "Collection name is udpated",
    collectionDeleted,
  });
});

/**************** 
@showCollections
@route http://localhost:4000/api/showCollections
@description to show all collections
@params 
@returns collections object

*************************/

export const getAllCollections = asyncHandler(async (req, res) => {
  const collections = await Collection.find();

  if (!collections) {
    throw new customError("Collections not found", 400);
  }

  res.status(200).json({
    success: true,
    message: "List of all the collections",
    collections,
  });
});
