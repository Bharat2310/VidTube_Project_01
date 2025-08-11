const asyncHandler= (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next)
        
    } catch (error) {
        res.status(typeof error.statusCode === "number" && error.statusCode >= 100 && error.statusCode<100 ? error.status : 500).json({
            success : false,
            message : error.message
        })
    }

}
export default asyncHandler 