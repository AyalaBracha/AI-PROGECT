using smart_Recipe_Generator.DTO;
using smart_Recipe_Generator.Models;
namespace smart_Recipe_Generator.Services
{
   
        public interface ICategoryService
        {
            Task<List<Category>> GetAllCategoriesAsync();
            Task<List<Product>> GetProductsByCategoryAsync(int categoryId);
            Task<Product> GetProductByIdAsync(int productId);
        }
    }
