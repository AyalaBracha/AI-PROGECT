namespace smart_Recipe_Generator.Services
{
    public interface IImageService
    {
        Task<string?> GenerateRecipeImageAsync(string dishName);
    }
}