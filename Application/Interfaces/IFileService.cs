using Microsoft.AspNetCore.Http;
namespace Bislerium.Application.Interfaces
{
    public interface IFileService
    {
        public (string, string) UploadFile(IFormFile file);
        public void DeleteFile(string filePath);
        public string GetFullUrl(string relativePath);
    }
}
