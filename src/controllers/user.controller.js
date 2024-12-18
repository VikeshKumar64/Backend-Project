import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";


const resgisterUser = asyncHandler( async (req, res) =>{
     
    const {userName, email, fullName, password} = req.body;
    console.log("email: ", email);
    console.log("userName: ", userName);
    console.log("fullName: ", fullName);
    

    if(
        [fullName, email, password, userName].some((filed) => 
        filed?.trim() === "") // directly check that the field is empty or not.
    ){
        throw new ApiError(400, " check that all the fileds are filled");
    }
    
    const existedUser = await User.findOne({
        $or: [{userName},{email}]
    })

    if(existedUser){
        throw new ApiError(409,"User with username or email exists");
    }

    // console.log(req.files);

    const avtarLocalPath = req.files?.avtar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;

    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if(!avtarLocalPath){
        throw new ApiError(400, "Avtar file is required");
    }


    // Upload on Cloudaniry

    const avtar = await uploadOnCloudinary(avtarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avtar){
        throw new ApiError(400, "Avtar file is required");
    }

    const user = await User.create({
        fullName,
        avtar: avtar.url,
        coverImage: coverImage.url || "",
        email,
        password,
        userName: userName.toLowerCase()
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "error while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(200, "User registered sucessfully")
    )
})
export {resgisterUser}