using Microsoft.AspNetCore.Mvc;
using Models;
using Servicess;

[ApiController]
[Route("api/[controller]")]
public class EmailController : ControllerBase
{
    private readonly IEmailService _emailService;

    public EmailController(IEmailService emailService)
    {
        _emailService = emailService;
    }

    [HttpPost("send")]
    public async Task<IActionResult> SendEmail([FromBody] EmailRequest request)
    {
        if (string.IsNullOrEmpty(request.To) ||
            string.IsNullOrEmpty(request.Subject) ||
            string.IsNullOrEmpty(request.Html))
        {
            return BadRequest("Missing required fields.");
        }

        try
        {
            await _emailService.SendEmailAsync(request);
            return Ok(new { success = true, message = "Email sent successfully!" });
        }
        catch (System.Exception ex)
        {
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }
}


