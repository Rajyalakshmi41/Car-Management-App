import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response, NextFunction } from "express";
import { apiError } from "../utils/apiError";
import { apiResponse } from "../utils/apiResponse";
import { IUser } from "../models/user.model";
import User from "../models/user.model";
import Product from "../models/product.model";
import mongoose from "mongoose";
import { handleCloudinary } from "../utils/cloudinary";

const handleCreateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { data } = req.body;
    console.log(data);
    
    const { userData } = data;
    console.log(userData);
    
    if (!data) throw new apiError(400, "No data provided");
    const isUserExist = await User.findOne({ email: userData?.email });
    if (isUserExist) throw new apiError(400, "User already exist");
    const user = new User({
      name: userData?.name,
      email: userData?.email,
      password: userData?.password,
    });
    const userResponse = await user.save();
    userResponse.password = "";
    res
      .status(201)
      .json(new apiResponse(201, userResponse, "User created successfully"));
  }
);

// Login
const handleLogin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // user enter email
    // check against the entered email if user already exist or not
    // check password is correct or not
    // generate accesstoken
    // send token

    const { data } = req.body;
    const {loginData}=data;
    if (!data) throw new apiError(400, "No data provided");
      const user = await User.findOne({ email: loginData.email });
      if (!user) throw new apiError(400, "User not exist");
     
    const checkPassword = await user.checkPassword(loginData.password);
    if (!checkPassword) throw new apiError(400, "Invalid credentials");
    const accessToken = user.accessTokenMethod();

    user.password = "";
    res
      .status(200)
      .json(
        new apiResponse(200, { user, accessToken }, "Logged in successfully")
      );
  }
);
// upload
const handleUpload = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const { title,description,tag} = req.body;
    const  productData={
      title,
      description,
      tag
    } 
    if ( !productData) throw new apiError(400, "No data provided");
    if (!req.files.image) throw new apiError(400, "Image is required");
    // const localAvatarPath = req.files?.avatar[0]?.path;
    
    const imagePaths = req.files?.image?.map((file: any) => file.path);
    
    const image: string[] = await handleCloudinary(imagePaths);
    const product = new Product({
      title: productData.title,
      description: productData.description,
      tag: productData.tag,
      image,
      owner: req.user._id,
    });
    const productResponse = await product.save();
    res
      .status(201)
      .json(new apiResponse(201, productResponse, "Product created"));
  }
);

// Update
const handleUpdate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { data } = req.body;
    const { productData } = data;
    if (!data || !productData) throw new apiError(400, "No data provided");
    const product = await Product.findByIdAndUpdate(
      productData._id,
      {
        title: productData.title,
        description: productData.description,
        tag: productData.tag,
      },
      { new: true }
    );
    if (!product) throw new apiError(400, "Product not exist");
    res.status(200).json(new apiResponse(200, { product }, "Updated"));
  }
);

// Delete
const handleDelete = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { data } = req.body;
    const { productData } = data;
    if (!data || !productData) throw new apiError(400, "No data provided");
    const product = await Product.findByIdAndDelete(productData._id);
    if (!product) throw new apiError(400, "Product not exist");
    res.status(200).json(new apiResponse(200, product, "Deleted"));
  }
);

// Fetch product detail single
const handleFetchOne = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { data } = req.body;
    const { productData } = data;
    if (!data || !productData) throw new apiError(400, "No data provided");
    const product = await Product.findById(productData._id);
    if (!product) throw new apiError(400, "Product not exist");
    res.status(201).json(new apiResponse(200, product, "Fetched"));
  }
);

// fetch all
const handleFetch = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const { user } = req;
    
    
    const product = await Product.find({ owner: user._id });
    
    
    if (!product.length) throw new apiError(400, "Product not exist");
    res.status(200).json(new apiResponse(200, {product}, "Fetched"));
  }
);

// fetch user
const handleFetchUser = asyncHandler(async(req:any,res:Response,next:NextFunction)=>{
  const user = await User.findById({_id:req.user._id})
  
  if(!user) throw new apiError(400,"No user found")
    user.password=""
    res.status(200).json(new apiResponse(200, {user}, "Fetched"));
})

export {
  handleCreateUser,
  handleLogin,
  handleUpload,
  handleUpdate,
  handleDelete,
  handleFetchOne,
  handleFetch,
  handleFetchUser
};
