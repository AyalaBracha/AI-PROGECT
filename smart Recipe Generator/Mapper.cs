using AutoMapper;
using DTO;


namespace smart_Recipe_Generator
{
    public class Mapper : Profile
    {
        public Mapper()
        {
            CreateMap<Product, ProductDto>();
            CreateMap<Category, CategoryDto>();
            

        }
    }
}
