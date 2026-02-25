namespace Services
{
    public interface IImageService
    {
        Task<string?> GenerateRecipeImageAsync(string dishName);
    }
}