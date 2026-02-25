public class EmailRequestDto
{
    public string To { get; set; } = string.Empty;
    public string Subject { get; set; } = "המתכון שלך";
    public string Html { get; set; } = string.Empty;
}
