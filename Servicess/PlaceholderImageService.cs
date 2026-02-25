using System.Net.Http;
using System.Text;
using Microsoft.Extensions.Logging;

namespace Services
{
    /// <summary>
    /// שירות גיבוי ליצירת תמונות במקרה ש-Hugging Face לא עובד
    /// משתמש ב-Unsplash או DummyImage כגיבוי
    /// </summary>
    public class PlaceholderImageService : IImageService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<PlaceholderImageService> _logger;

        public PlaceholderImageService(HttpClient httpClient, ILogger<PlaceholderImageService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }

        public async Task<string?> GenerateRecipeImageAsync(string dishName)
        {
            try
            {
                _logger.LogInformation("🖼️ משתמש בשירות תמונות גיבוי עבור: {DishName}", dishName);

                // אופציה 1: Unsplash (דורש API Key)
                // var imageUrl = $"https://source.unsplash.com/600x400/?food,{Uri.EscapeDataString(dishName)}";

                // אופציה 2: DummyImage (לא דורש API Key)
                var imageUrl = "https://via.placeholder.com/600x400/667eea/ffffff?text=Recipe+Image";

                _logger.LogInformation("📥 מוריד תמונה מ: {Url}", imageUrl);

                var imageBytes = await _httpClient.GetByteArrayAsync(imageUrl);

                if (imageBytes.Length == 0)
                {
                    _logger.LogWarning("⚠️ התמונה ריקה");
                    return null;
                }

                string base64Image = Convert.ToBase64String(imageBytes);
                _logger.LogInformation("✅ תמונת placeholder נוצרה בהצלחה");

                return base64Image;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ שגיאה ביצירת תמונת placeholder");
                return null;
            }
        }
    }
}