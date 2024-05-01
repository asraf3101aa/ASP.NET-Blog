using Microsoft.AspNetCore.Http;
namespace Bislerium.Application.Common.Interfaces
{
    public interface IFileService
    {
        public (string, string) UploadFile(IFormFile file);
        public void DeleteFile(string filePath);
    }
}
