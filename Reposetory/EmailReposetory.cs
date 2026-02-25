using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;


public class EmailRepository : IEmailRepository
{
    private readonly IConfiguration _config;

    public EmailRepository(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendAsync(string to, string subject, string htmlBody)
    {
        var email = _config["EmailSettings:Email"];
        var password = _config["EmailSettings:AppPassword"];

        var smtpClient = new SmtpClient("smtp.gmail.com")
        {
            Port = 587,
            Credentials = new NetworkCredential(email, password),
            EnableSsl = true
        };

        var mailMessage = new MailMessage
        {
            From = new MailAddress(email, "מחולל מתכונים"),
            Subject = subject,
            Body = htmlBody,
            IsBodyHtml = true
        };

        mailMessage.To.Add(to);

        await smtpClient.SendMailAsync(mailMessage);
    }
}
