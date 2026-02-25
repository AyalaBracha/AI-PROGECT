
public interface IEmailRepository
{
    Task SendAsync(string to, string subject, string htmlBody);
}