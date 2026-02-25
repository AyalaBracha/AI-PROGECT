
//using Microsoft.AspNetCore.Mvc;
//using System.Net.Mail;
//using System.Net;
//using Services;

//[Route("api/[controller]")]
//[ApiController]
//public class RecipeController : ControllerBase
//{
//    private readonly IRecipeService _recipeService;
//    private readonly IConfiguration _config;

//    public RecipeController(IRecipeService recipeService, IConfiguration config)
//    {
//        _recipeService = recipeService;
//        _config = config;
//    }

//    // יצירת מתכון
//    [HttpPost("generate")]
//    public async Task<ActionResult<RecipeDto>> GenerateRecipe([FromBody] RecipeRequestDto request)
//    {
//        if (request?.Ingredients == null || request.Ingredients.Count == 0)
//            return BadRequest("יש לספק רשימת מוצרים.");

//        var recipe = await _recipeService.GenerateRecipeAsync(request);
//        return Ok(recipe);
//    }


//}
using Microsoft.AspNetCore.Mvc;
using Services;
using Models;

[Route("api/[controller]")]
[ApiController]
public class RecipeController : ControllerBase
{
    private readonly IRecipeService _recipeService;
    private readonly IImageService _imageService;
    private readonly IConfiguration _config;
    private readonly ILogger<RecipeController> _logger;

    public RecipeController(
        IRecipeService recipeService,
        IImageService imageService,
        IConfiguration config,
        ILogger<RecipeController> logger)
    {
        _recipeService = recipeService;
        _imageService = imageService;
        _config = config;
        _logger = logger;
    }

    /// <summary>
    /// יצירת מתכון (ללא תמונה)
    /// </summary>
    [HttpPost("generate")]
    public async Task<ActionResult<RecipeDto>> GenerateRecipe([FromBody] RecipeRequestDto request)
    {
        try
        {
            if (request?.Ingredients == null || request.Ingredients.Count == 0)
                return BadRequest("יש לספק רשימת מוצרים.");

            _logger.LogInformation("🍳 מתחיל ליצור מתכון עבור {Count} מצרכים", request.Ingredients.Count);

            var recipe = await _recipeService.GenerateRecipeAsync(request);

            _logger.LogInformation("✅ מתכון נוצר בהצלחה: {Title}", recipe.Title);

            return Ok(recipe);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ שגיאה ביצירת מתכון");
            return StatusCode(500, "אירעה שגיאה ביצירת המתכון");
        }
    }

    /// <summary>
    /// יצירת תמונה למתכון קיים
    /// </summary>
    [HttpPost("generate-image")]
    public async Task<ActionResult<ImageResponseDto>> GenerateImage([FromBody] ImageRequestDto request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request?.DishName))
                return BadRequest("יש לספק שם מנה");

            _logger.LogInformation("📸 מתחיל ליצור תמונה עבור: {DishName}", request.DishName);

            var imageBase64 = await _imageService.GenerateRecipeImageAsync(request.DishName);

            if (string.IsNullOrEmpty(imageBase64))
            {
                _logger.LogWarning("⚠️ לא הצלחתי ליצור תמונה עבור: {DishName}", request.DishName);
                return Ok(new ImageResponseDto { ImageBase64 = null, Success = false });
            }

            _logger.LogInformation("✅ תמונה נוצרה בהצלחה עבור: {DishName}", request.DishName);

            return Ok(new ImageResponseDto
            {
                ImageBase64 = imageBase64,
                Success = true
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ שגיאה ביצירת תמונה");
            return StatusCode(500, "אירעה שגיאה ביצירת התמונה");
        }
    }

    /// <summary>
    /// יצירת מתכון + תמונה ביחד
    /// </summary>
    [HttpPost("generate-with-image")]
    public async Task<ActionResult<RecipeDto>> GenerateRecipeWithImage([FromBody] RecipeRequestDto request)
    {
        try
        {
            if (request?.Ingredients == null || request.Ingredients.Count == 0)
                return BadRequest("יש לספק רשימת מוצרים.");

            _logger.LogInformation("🍳📸 מתחיל ליצור מתכון ותמונה עבור {Count} מצרכים", request.Ingredients.Count);

            // שלב 1: יצירת המתכון
            var recipe = await _recipeService.GenerateRecipeAsync(request);
            _logger.LogInformation("✅ מתכון נוצר: {Title}", recipe.Title);

            // שלב 2: יצירת תמונה למתכון
            string? imageBase64 = null;
            try
            {
                imageBase64 = await _imageService.GenerateRecipeImageAsync(recipe.Title);
                if (!string.IsNullOrEmpty(imageBase64))
                {
                    _logger.LogInformation("✅ תמונה נוצרה בהצלחה");
                }
                else
                {
                    _logger.LogWarning("⚠️ לא הצלחתי ליצור תמונה, ממשיך בלי תמונה");
                }
            }
            catch (Exception imgEx)
            {
                _logger.LogError(imgEx, "❌ שגיאה ביצירת תמונה, ממשיך בלי תמונה");
                // ממשיכים גם בלי תמונה
            }

            // החזרת המתכון עם/בלי תמונה
            var result = new RecipeDto
            {
                Title = recipe.Title,
                Description = recipe.Description,
                Ingredients = recipe.Ingredients,
                Instructions = recipe.Instructions,
                Nutrition = recipe.Nutrition,
                Notes = recipe.Notes,
                ImageBase64 = imageBase64
            };

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ שגיאה ביצירת מתכון ותמונה");
            return StatusCode(500, "אירעה שגיאה ביצירת המתכון");
        }
    }
}