using AutoMapper;
using DTO;

namespace smart_Recipe_Generator
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // ===== Category Mappings =====
            // מ-Category Entity ל-CategoryDto (עם ID)
            CreateMap<Category, CategoryDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.Image, opt => opt.MapFrom(src => src.Image));

            // מ-CategoryDtoPost (ללא ID) ל-Category Entity
            CreateMap<CategoryDtoPost, Category>()
                .ForMember(dest => dest.Id, opt => opt.Ignore()) // Id יווצר אוטומטית על ידי הDB
                .ForMember(dest => dest.Products, opt => opt.Ignore()) // Navigation property
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.Image, opt => opt.MapFrom(src => src.Image));

            // ===== Product Mappings =====
            // מ-Product Entity ל-ProductDto
            CreateMap<Product, ProductDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.Image, opt => opt.MapFrom(src => src.Image))
                .ForMember(dest => dest.CategoryId, opt => opt.MapFrom(src => src.CategoryId));

            // מ-ProductDtoPost ל-Product Entity
            CreateMap<ProductDtoPost, Product>()
                .ForMember(dest => dest.Id, opt => opt.Ignore()) // Id יווצר אוטומטית
                .ForMember(dest => dest.Category, opt => opt.Ignore()) // Navigation property
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.Image, opt => opt.MapFrom(src => src.Image))
                .ForMember(dest => dest.CategoryId, opt => opt.MapFrom(src => src.CategoryId));
        }
    }
}