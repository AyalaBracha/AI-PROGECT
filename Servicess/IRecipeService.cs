
namespace Services
{
    public interface IRecipeService
    {
    Task<RecipeDto> GenerateRecipeAsync(RecipeRequestDto request);
    }
}
