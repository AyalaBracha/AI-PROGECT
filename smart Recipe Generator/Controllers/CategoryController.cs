using AutoMapper;
using DTO;
using Microsoft.AspNetCore.Mvc;
using Services;

namespace smart_Recipe_Generator.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        private readonly ILogger<CategoryController> _logger;
        IMapper _mapper;

        public CategoryController(ICategoryService categoryService, ILogger<CategoryController> logger, IMapper mapper)
        {
            _categoryService = categoryService;
            _logger = logger;
            _mapper = mapper;
        }

        // GET: api/Category
        [HttpGet]
        public async Task<ActionResult<List<CategoryDto>>> GetAllCategories()
        {
            try
            {
                var categories = await _categoryService.GetAllCategoriesAsync();
                var categoriesDto = _mapper.Map<List<CategoryDto>>(categories);
                return Ok(categoriesDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "שגיאה בשליפת קטגוריות");
                return StatusCode(500, "אירעה שגיאה בשליפת הקטגוריות");
            }
        }

        // GET: api/Category/{categoryId}/products
        [HttpGet("{categoryId}/products")]
        public async Task<ActionResult<List<ProductDto>>> GetProductsByCategory(int categoryId)
        {
            try
            {
                var products = await _categoryService.GetProductsByCategoryAsync(categoryId);
                var productsDto = _mapper.Map<List<ProductDto>>(products);

                // אם אין מוצרים - זה OK, פשוט מחזירים רשימה ריקה
                // לא צריך לזרוק שגיאה או NotFound
                if (productsDto == null || productsDto.Count == 0)
                {
                    _logger.LogInformation("לא נמצאו מוצרים לקטגוריה {CategoryId}", categoryId);
                    return Ok(new List<ProductDto>()); // מחזירים רשימה ריקה במקום NotFound
                }

                return Ok(productsDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "שגיאה בשליפת מוצרים לקטגוריה {CategoryId}", categoryId);
                return StatusCode(500, "אירעה שגיאה בשליפת המוצרים");
            }
        }

        // GET: api/Category/product/{productId}
        [HttpGet("product/{productId}")]
        public async Task<ActionResult<ProductDto>> GetProductById(int productId)
        {
            try
            {
                var product = await _categoryService.GetProductByIdAsync(productId);

                if (product == null)
                {
                    // כאן זה באמת NotFound כי מחפשים מוצר ספציפי
                    _logger.LogWarning("לא נמצא מוצר עם מזהה {ProductId}", productId);
                    return NotFound($"לא נמצא מוצר עם מזהה {productId}");
                }

                var productDto = _mapper.Map<ProductDto>(product);
                return Ok(productDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "שגיאה בשליפת מוצר {ProductId}", productId);
                return StatusCode(500, "אירעה שגיאה בשליפת המוצר");
            }
        }

        // POST: api/Category
        [HttpPost]
        public async Task<ActionResult<CategoryDto>> AddCategory([FromBody] CategoryDtoPost categoryDto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(categoryDto.Name))
                {
                    _logger.LogWarning("ניסיון להוסיף קטגוריה ללא שם");
                    return BadRequest("שם הקטגוריה הוא שדה חובה");
                }

                var category = _mapper.Map<Category>(categoryDto);
                var created = await _categoryService.AddCategoryAsync(category);
                var result = _mapper.Map<CategoryDto>(created);

                _logger.LogInformation("קטגוריה חדשה נוספה בהצלחה: {CategoryId} - {CategoryName}", created.Id, created.Name);
                return CreatedAtAction(nameof(GetAllCategories), new { id = created.Id }, result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "שגיאה בהוספת קטגוריה");
                return StatusCode(500, "שגיאה בהוספת קטגוריה");
            }
        }

        // POST: api/Category/product
        [HttpPost("product")]
        public async Task<ActionResult<ProductDto>> AddProduct([FromBody] ProductDtoPost productDto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(productDto.Name))
                {
                    _logger.LogWarning("ניסיון להוסיף מוצר ללא שם");
                    return BadRequest("שם המוצר הוא שדה חובה");
                }

                if (productDto.CategoryId <= 0)
                {
                    _logger.LogWarning("ניסיון להוסיף מוצר עם מזהה קטגוריה לא תקין: {CategoryId}", productDto.CategoryId);
                    return BadRequest("מזהה קטגוריה לא תקין");
                }

                var product = _mapper.Map<Product>(productDto);
                var created = await _categoryService.AddProductAsync(product);
                var result = _mapper.Map<ProductDto>(created);

                _logger.LogInformation("מוצר חדש נוסף בהצלחה: {ProductId} - {ProductName} לקטגוריה {CategoryId}",
                    created.Id, created.Name, productDto.CategoryId);

                return CreatedAtAction(nameof(GetProductById), new { productId = created.Id }, result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "שגיאה בהוספת מוצר");
                return StatusCode(500, "שגיאה בהוספת מוצר");
            }
        }
    }
}