using Microsoft.EntityFrameworkCore;
using Reposetories;
using Services;
using Servicess;

var builder = WebApplication.CreateBuilder(args);

// ===================== DB =====================
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

// ===================== SERVICES =====================
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IRecipeService, RecipeService>();
builder.Services.AddScoped<IImageService, HuggingFaceImageService>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IEmailRepository, EmailRepository>();
builder.Services.AddScoped<IEmailService, EmailService>();

builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

// ===================== HTTP CLIENT =====================
// רק ImageService צריך HttpClient
builder.Services.AddHttpClient<IImageService, HuggingFaceImageService>()
    .ConfigurePrimaryHttpMessageHandler(() =>
        new HttpClientHandler
        {
            AllowAutoRedirect = true
        });


// ===================== CONTROLLERS =====================
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler =
            System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

// ===================== CORS =====================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// ===================== SWAGGER =====================
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ===================== PIPELINE =====================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAngular");
app.UseAuthorization();
app.MapControllers();

// ===================== DB CHECK =====================
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    if (dbContext.Database.CanConnect())
    {
        Console.WriteLine("✅ DB Connected");
        Console.WriteLine($"📦 Categories: {dbContext.Categories.Count()}");
    }
    else
    {
        Console.WriteLine("❌ DB NOT Connected");
    }
}

Console.WriteLine("🚀 Server running on https://localhost:7276");
app.Run();
