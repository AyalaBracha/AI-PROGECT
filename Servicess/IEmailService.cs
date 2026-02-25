using Models;

namespace Servicess
{
    public interface IEmailService
    {
        Task SendEmailAsync(EmailRequest request);
    }
}