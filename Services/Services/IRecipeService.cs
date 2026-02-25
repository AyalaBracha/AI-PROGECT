using smart_Recipe_Generator.Models;

namespace smart_Recipe_Generator.Services
{
    public interface IRecipeService
    {
    Task<RecipeDto> GenerateRecipeAsync(RecipeRequestDto request);
    }
}
