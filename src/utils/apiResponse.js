class ApiResponse{
    constructor(
        statusCode, data, message="Success"
    )
    {this.statuscode = statusCode,
    this.message= message,
    this.data = data,
    this.success= statuscode < 400}
}