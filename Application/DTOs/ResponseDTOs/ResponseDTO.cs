public class SuccessResponse<T>
{
    public T Data { get; set; }

    public SuccessResponse(T data)
    {
        Data = data;
    }
}


public class ErrorResponse
{
    public List<ErrorDetail> Errors { get; set; } = new List<ErrorDetail>();

    public class ErrorDetail
    {
        public string Title { get; set; }
        public string Message { get; set; }
    }
}