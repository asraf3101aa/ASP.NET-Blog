using System.Text.Json.Serialization;

namespace Bislerium.Application.DTOs.ResponseDTOs;

public class ApiResponse<T>
{
    [JsonPropertyName("status")]
    public string Status { get; set; }

    [JsonPropertyName("message")]
    public string Message { get; set; }

    [JsonPropertyName("data")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public T Data { get; set; }

    [JsonPropertyName("errors")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public IDictionary<string, string[]> Errors { get; set; }

    [JsonPropertyName("error")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string Error { get; set; }

    public static ApiResponse<T> Success(T data, string message = "") => new ApiResponse<T>
    {
        Status = "success",
        Message = message,
        Data = data
    };

    public static ApiResponse<T> Fail(IDictionary<string, string[]> errors, string message = "Validation failed") => new ApiResponse<T>
    {
        Status = "fail",
        Message = message,
        Errors = errors
    };

    public static ApiResponse<T> ErrorResponse(string error, string message = "An error occurred") => new ApiResponse<T>
    {
        Status = "error",
        Message = message,
        Error = error
    };
}