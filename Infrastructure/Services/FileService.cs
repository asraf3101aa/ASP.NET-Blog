using Bislerium.Application.Common.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace Bislerium.Infrastructure.Services
{
    public class FileService : IFileService
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        public FileService(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }
        private (string, string) CheckFileExtension(IFormFile file)
        {
            var validImageExtensions = new List<string> { ".jpg", ".jpeg", ".png" };
            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (validImageExtensions.Contains(fileExtension))
                return (fileExtension, string.Empty); // Return the file extension if it's a valid image type
            return (string.Empty, "JPG, JPEG and PNG are only supported");
        }

        private (string, string) CheckFileSize(IFormFile file)
        {
            if (file.Length < 3 * 1024 * 1024)
                return (file.Length.ToString(), string.Empty); // The file is an image and is less than 2MB
            return ("", "Image must be less than 3 MB");
        }
        private (string, string) Save(IFormFile file)
        {
            if (file != null)
            {
                try
                {
                    var relativeFilePath = "app/images";
                    string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, relativeFilePath);
                    var dir = Path.GetDirectoryName(uploadsFolder);
                    if (!Directory.Exists(Path.GetDirectoryName(dir))) Directory.CreateDirectory(dir);
                    string uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                    string filePath = Path.Combine(uploadsFolder, uniqueFileName);
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        file.CopyTo(fileStream);
                    }
                    return (Path.Combine(relativeFilePath, uniqueFileName), string.Empty);
                }
                catch (Exception ex)
                {
                    return (string.Empty, "Error while uploading file");
                }
            }
            return (string.Empty, "Please provide a file");
        }
        public (string, string) UploadFile(IFormFile file)
        {
            var (extension, extensionError) = CheckFileExtension(file);
            if (extensionError != string.Empty) return (string.Empty, extensionError);
            var (size, sizeError) = CheckFileSize(file);
            if (sizeError != string.Empty) return (string.Empty, sizeError);
            return Save(file);
        }
        public void DeleteFile(string filePath)
        {
            if (File.Exists(filePath))
                File.Delete(filePath);
        }
    }
}
