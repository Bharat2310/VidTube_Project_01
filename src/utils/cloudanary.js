import { v2 as cloudanary} from 'cloudinary';   
import fs from "fs"

cloudanary.config({ 
        cloud_name: process.env.CLOUDANARY_CLOUD_NAME, 
        api_key: process.env.CLOUDANARY_API_KEY, 
        api_secret: process.env.CLOUDANARY_API_SECRET       
    })

const uploadOnCloudinary = async (localfilepath) => {
    try {
        if(!localfilepath) return null
        const response = await cloudanary.uploader.upload(localfilepath, {
            resource_type: 'auto'
        })
        console.log(`file uploaded successfully : ${response.url}`);
        return response        
    } catch (error) {
        fs.unlinkSync(localfilepath) 
        return null
        
    }

}


export default uploadOnCloudinary