namespace Services
{
    public interface ICategoryService
    {
        Task<Category> AddCategoryAsync(Category category);
        Task<List<Category>> GetAllCategoriesAsync();
        Task<Product> GetProductByIdAsync(int productId);
        Task<List<Product>> GetProductsByCategoryAsync(int categoryId);
        Task<Product> AddProductAsync(Product product);
    }
}