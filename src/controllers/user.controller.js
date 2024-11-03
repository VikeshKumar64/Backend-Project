import {asyncHandler} from "../utils/asyncHandler.js";

const resgisterUser = asyncHandler( async (req, res) =>{
    res.status(200).json({
        message: "Hello Vikesh is Powerfull"
    })
})

export {resgisterUser}