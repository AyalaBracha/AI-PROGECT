namespace DTO
{
    
    
    public record ProductDto(int Id, string Name, string Image, int CategoryId);

    public record ProductDtoPost(string Name, string Image, int CategoryId);
}