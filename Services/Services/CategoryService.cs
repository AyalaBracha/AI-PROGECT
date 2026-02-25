using AutoMapper;
using smart_Recipe_Generator.DTO;
using smart_Recipe_Generator.Models;
using smart_Recipe_Generator.Repositories;

namespace smart_Recipe_Generator.Services
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
           

                return  await _repository.GetProductByIdAsync(productId);

               
               
        }
    }
}