using AutoMapper;
using Microsoft.Extensions.Logging;
using Reposetories;

namespace Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _repository;
        private readonly ILogger<CategoryService> _logger;
        private readonly IMapper _mapper;

        public CategoryService(
            ICategoryRepository repository,
            ILogger<CategoryService> logger,
            IMapper mapper)
        {
            _repository = repository;
            _logger = logger;
            _mapper = mapper;
        }

        public async Task<List<Category>> GetAllCategoriesAsync()
        {
            return await _repository.GetAllCategoriesAsync();
        }

        public async Task<List<Product>> GetProductsByCategoryAsync(int categoryId)
        {
            return await _repository.GetProductsByCategoryAsync(categoryId);
        }

        public async Task<Product> GetProductByIdAsync(int productId)
        {
            return await _repository.GetProductByIdAsync(productId);
        }

        public async Task<Category> AddCategoryAsync(Category category)
        {
            return await _repository.AddCategoryAsync(category);
        }

        public async Task<Product> AddProductAsync(Product product)
        {
            return await _repository.AddProductAsync(product);
        }
    }
}