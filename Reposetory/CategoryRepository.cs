using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Reposetories
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<CategoryRepository> _logger;

        public CategoryRepository(ApplicationDbContext context, ILogger<CategoryRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<List<Category>> GetAllCategoriesAsync()
        {
            try
            {
                return await _context.Categories
                    .OrderBy(c => c.Id)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "שגיאה ב-Repository בשליפת קטגוריות");
                throw;
            }
        }

        public async Task<List<Product>> GetProductsByCategoryAsync(int categoryId)
        {
            try
            {
                return await _context.Products
                    .Where(p => p.CategoryId == categoryId)
                    .OrderBy(p => p.Name)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "שגיאה ב-Repository בשליפת מוצרים לקטגוריה {CategoryId}", categoryId);
                throw;
            }
        }

        public async Task<Product?> GetProductByIdAsync(int productId)
        {
            try
            {
                return await _context.Products
                    .FirstOrDefaultAsync(p => p.Id == productId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "שגיאה ב-Repository בשליפת מוצר {ProductId}", productId);
                throw;
            }
        }

        public async Task<Category> AddCategoryAsync(Category category)
        {
            try
            {
                _context.Categories.Add(category);
                await _context.SaveChangesAsync();
                return category;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "שגיאה בהוספת קטגוריה");
                throw;
            }
        }

        public async Task<Product> AddProductAsync(Product product)
        {
            try
            {
                _context.Products.Add(product);
                await _context.SaveChangesAsync();
                return product;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "שגיאה בהוספת מוצר");
                throw;
            }
        }
    }
}