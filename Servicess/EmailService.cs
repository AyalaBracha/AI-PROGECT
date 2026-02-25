using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Models;

namespace Servicess
{


    public class EmailService :IEmailService
    {
        private readonly IEmailRepository _repo;

        public EmailService(IEmailRepository repo)
        {
            _repo = repo;
        }

        public async Task SendEmailAsync(EmailRequest request)
        {
            await _repo.SendAsync(request.To, request.Subject, request.Html);
        }

       
    }

}
