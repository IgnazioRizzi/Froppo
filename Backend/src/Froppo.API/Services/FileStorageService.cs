using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Http;

namespace Froppo.API.Services
{
    public class FileStorageService
    {
        private readonly Dictionary<string, byte[]> _fileStorage;
        private readonly Dictionary<string, FileMetadata> _fileMetadata;
        private readonly string _storagePath;

        public FileStorageService()
        {
            _fileStorage = new Dictionary<string, byte[]>();
            _fileMetadata = new Dictionary<string, FileMetadata>();
            _storagePath = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
            
            // Crea la directory se non esiste
            if (!Directory.Exists(_storagePath))
            {
                Directory.CreateDirectory(_storagePath);
            }
        }

        public async Task<FileUploadResult> UploadFileAsync(IFormFile file, int userId)
        {
            try
            {
                // Validazioni
                if (file == null || file.Length == 0)
                    throw new ArgumentException("Nessun file fornito");

                if (file.ContentType != "application/pdf")
                    throw new ArgumentException("Solo file PDF sono accettati");

                if (file.Length > 10 * 1024 * 1024) // 10MB max
                    throw new ArgumentException("File troppo grande (max 10MB)");

                // Genera nome file univoco
                var fileExtension = Path.GetExtension(file.FileName);
                var uniqueFileName = $"{userId}_{DateTime.UtcNow:yyyyMMddHHmmss}_{Guid.NewGuid():N}{fileExtension}";
                
                // Calcola hash del file per deduplicazione
                var fileHash = await CalculateFileHashAsync(file);
                
                // Controlla se il file esiste già
                var existingFile = _fileMetadata.Values.FirstOrDefault(f => f.Hash == fileHash);
                if (existingFile != null)
                {
                    return new FileUploadResult
                    {
                        FileName = existingFile.FileName,
                        OriginalName = file.FileName,
                        Size = file.Length,
                        Hash = fileHash,
                        IsDuplicate = true
                    };
                }

                // Leggi il contenuto del file
                using var memoryStream = new MemoryStream();
                await file.CopyToAsync(memoryStream);
                var fileContent = memoryStream.ToArray();

                // Salva nel storage in-memory
                _fileStorage[uniqueFileName] = fileContent;

                // Salva metadata
                var metadata = new FileMetadata
                {
                    FileName = uniqueFileName,
                    OriginalName = file.FileName,
                    Size = file.Length,
                    ContentType = file.ContentType,
                    Hash = fileHash,
                    UploadedAt = DateTime.UtcNow,
                    UserId = userId
                };
                
                _fileMetadata[uniqueFileName] = metadata;

                return new FileUploadResult
                {
                    FileName = uniqueFileName,
                    OriginalName = file.FileName,
                    Size = file.Length,
                    Hash = fileHash,
                    IsDuplicate = false
                };
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Errore durante l'upload: {ex.Message}", ex);
            }
        }

        public byte[]? GetFile(string fileName)
        {
            return _fileStorage.TryGetValue(fileName, out var content) ? content : null;
        }

        public FileMetadata? GetFileMetadata(string fileName)
        {
            return _fileMetadata.TryGetValue(fileName, out var metadata) ? metadata : null;
        }

        public bool DeleteFile(string fileName)
        {
            var removed = _fileStorage.Remove(fileName);
            _fileMetadata.Remove(fileName);
            return removed;
        }

        public IEnumerable<FileMetadata> GetUserFiles(int userId)
        {
            return _fileMetadata.Values.Where(f => f.UserId == userId);
        }

        private async Task<string> CalculateFileHashAsync(IFormFile file)
        {
            using var sha256 = SHA256.Create();
            using var stream = file.OpenReadStream();
            var hashBytes = await sha256.ComputeHashAsync(stream);
            return Convert.ToHexString(hashBytes);
        }
    }

    public class FileMetadata
    {
        public string FileName { get; set; } = string.Empty;
        public string OriginalName { get; set; } = string.Empty;
        public long Size { get; set; }
        public string ContentType { get; set; } = string.Empty;
        public string Hash { get; set; } = string.Empty;
        public DateTime UploadedAt { get; set; }
        public int UserId { get; set; }
    }

    public class FileUploadResult
    {
        public string FileName { get; set; } = string.Empty;
        public string OriginalName { get; set; } = string.Empty;
        public long Size { get; set; }
        public string Hash { get; set; } = string.Empty;
        public bool IsDuplicate { get; set; }
    }
}
