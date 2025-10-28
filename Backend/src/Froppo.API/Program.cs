using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Froppo.Application.Services;
using Froppo.Application.Interfaces;
using Froppo.Domain.Entities;
using Froppo.Domain.DTOs;
using Froppo.Domain.Interfaces;
using Froppo.Infrastructure.Repositories;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Rate Limiting per prevenire attacchi brute force
builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("LoginPolicy", opt =>
    {
        opt.PermitLimit = 5; // 5 tentativi
        opt.Window = TimeSpan.FromMinutes(15); // ogni 15 minuti
        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        opt.QueueLimit = 2;
    });
    
    options.AddFixedWindowLimiter("GeneralPolicy", opt =>
    {
        opt.PermitLimit = 100; // 100 richieste
        opt.Window = TimeSpan.FromMinutes(1); // al minuto
        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        opt.QueueLimit = 10;
    });
});

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(
                builder.Configuration["Jwt:Secret"] ?? "MySuperSecretKeyThatIsAtLeast32CharactersLong!")),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "Froppo",
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"] ?? "FroppoUsers",
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

// CORS per produzione
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(
            "https://froppo-gestionale.vercel.app",
            "https://froppo-gestionale-git-main.vercel.app",
            "https://froppo-gestionale-git-develop.vercel.app",
            "http://localhost:3000" // Per sviluppo locale
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

// Anti-forgery
builder.Services.AddAntiforgery(options =>
{
    options.HeaderName = "X-CSRF-TOKEN";
    options.SuppressXFrameOptionsHeader = false;
});


// Services
builder.Services.AddScoped<AuthService>();
builder.Services.AddSingleton<Froppo.API.Services.FileStorageService>();

// In-memory data store for demo
var users = new List<User>
{
    new User { Id = 1, FirstName = "Mario", LastName = "Rossi", Email = "mario.rossi@email.com", UserId = "2", DateOfBirth = new DateTime(1985, 3, 15), PlaceOfBirth = "Roma", Residence = "Milano", Certificate = "attestato_mario.pdf", CreatedAt = DateTime.UtcNow.AddDays(-10) },
    new User { Id = 2, FirstName = "Giulia", LastName = "Bianchi", Email = "giulia.bianchi@email.com", UserId = "2", DateOfBirth = new DateTime(1990, 7, 22), PlaceOfBirth = "Napoli", Residence = "Torino", Certificate = "attestato_giulia.pdf", CreatedAt = DateTime.UtcNow.AddDays(-5) },
    new User { Id = 3, FirstName = "Luca", LastName = "Verdi", Email = "luca.verdi@email.com", UserId = "3", DateOfBirth = new DateTime(1988, 11, 8), PlaceOfBirth = "Firenze", Residence = "Bologna", Certificate = "attestato_luca.pdf", CreatedAt = DateTime.UtcNow.AddDays(-2) },
    new User { Id = 4, FirstName = "Anna", LastName = "Neri", Email = "anna.neri@email.com", UserId = "3", DateOfBirth = new DateTime(1992, 1, 30), PlaceOfBirth = "Venezia", Residence = "Genova", Certificate = "attestato_anna.pdf", CreatedAt = DateTime.UtcNow.AddDays(-1) },
    new User { Id = 5, FirstName = "Paolo", LastName = "Blu", Email = "paolo.blu@email.com", UserId = "2", DateOfBirth = new DateTime(1987, 5, 12), PlaceOfBirth = "Palermo", Residence = "Catania", Certificate = "attestato_paolo.pdf", CreatedAt = DateTime.UtcNow.AddDays(-3) }
};

var userAccounts = new List<UserAccount>
{
    new UserAccount 
    { 
        Id = "1", 
        Username = "admin", 
        Email = "admin@myproject.com", 
        PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
        Role = "Admin",
        CreatedAt = DateTime.UtcNow.AddDays(-30),
        IsActive = true
    },
    new UserAccount 
    { 
        Id = "2", 
        Username = "user1", 
        Email = "user1@myproject.com", 
        PasswordHash = BCrypt.Net.BCrypt.HashPassword("user123"),
        Role = "User",
        CreatedAt = DateTime.UtcNow.AddDays(-10),
        IsActive = true
    },
    new UserAccount 
    { 
        Id = "3", 
        Username = "user2", 
        Email = "user2@myproject.com", 
        PasswordHash = BCrypt.Net.BCrypt.HashPassword("user123"),
        Role = "User",
        CreatedAt = DateTime.UtcNow.AddDays(-5),
        IsActive = true
    }
};

builder.Services.AddSingleton(users);
builder.Services.AddSingleton(userAccounts);

// Registra il repository in-memory
builder.Services.AddScoped<IUserRepository>(provider => 
    new InMemoryUserRepository(provider.GetRequiredService<List<User>>()));
builder.Services.AddScoped<IUserService, UserService>();


var app = builder.Build();

// Configure the HTTP request pipeline.
// Configurazione per produzione
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    // In produzione, disabilita Swagger
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Froppo API v1");
        c.RoutePrefix = "api-docs"; // Accessibile solo tramite URL specifico
    });
}

app.UseHttpsRedirection();
app.UseCors("AllowReactApp");
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();
app.UseAntiforgery();

// Authentication Endpoints
app.MapPost("/api/auth/login", [EnableRateLimiting("LoginPolicy")] (LoginRequest request, List<UserAccount> userAccounts, AuthService authService, ILogger<Program> logger) =>
{
    // Validazione input
    if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
    {
        logger.LogWarning("Tentativo di login con credenziali vuote da IP: {RemoteIpAddress}", 
            request.GetHashCode()); // In produzione usare HttpContext.Connection.RemoteIpAddress
        return Results.BadRequest(new { message = "Username e password sono obbligatori" });
    }

    // Sanitizzazione input
    request.Username = request.Username.Trim().ToLowerInvariant();
    
    if (request.Username.Length < 3 || request.Username.Length > 50)
    {
        logger.LogWarning("Tentativo di login con username non valido: {Username}", request.Username);
        return Results.BadRequest(new { message = "Username non valido" });
    }

    if (request.Password.Length < 6 || request.Password.Length > 100)
    {
        logger.LogWarning("Tentativo di login con password non valida per username: {Username}", request.Username);
        return Results.BadRequest(new { message = "Password non valida" });
    }

    var user = userAccounts.FirstOrDefault(u => u.Username.ToLowerInvariant() == request.Username && u.IsActive);
    
    // Sempre lo stesso tempo di risposta per prevenire timing attacks
    var isValidPassword = user != null && authService.VerifyPassword(request.Password, user.PasswordHash);
    
    if (!isValidPassword)
    {
        logger.LogWarning("Tentativo di login fallito per username: {Username}", request.Username);
        return Results.Unauthorized();
    }

    try
    {
        user!.LastLoginAt = DateTime.UtcNow;
        var token = authService.GenerateJwtToken(user);
        var response = authService.CreateLoginResponse(user, token);
        
        logger.LogInformation("Login riuscito per username: {Username}, ruolo: {Role}", user.Username, user.Role);
        return Results.Ok(response);
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Errore durante la generazione del token per username: {Username}", user!.Username);
        return Results.Problem("Errore interno del server");
    }
});

app.MapPost("/api/auth/register", [EnableRateLimiting("GeneralPolicy")] (RegisterRequest request, List<UserAccount> userAccounts, AuthService authService, ILogger<Program> logger) =>
{
    // Validazione input
    if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Email) || 
        string.IsNullOrWhiteSpace(request.Password) || string.IsNullOrWhiteSpace(request.Role))
    {
        return Results.BadRequest(new { message = "Tutti i campi sono obbligatori" });
    }

    // Sanitizzazione e validazione
    request.Username = request.Username.Trim().ToLowerInvariant();
    request.Email = request.Email.Trim().ToLowerInvariant();
    
    if (request.Username.Length < 3 || request.Username.Length > 50)
    {
        return Results.BadRequest(new { message = "Username deve essere tra 3 e 50 caratteri" });
    }

    if (request.Password.Length < 8 || request.Password.Length > 100)
    {
        return Results.BadRequest(new { message = "Password deve essere tra 8 e 100 caratteri" });
    }

    if (!IsValidEmail(request.Email))
    {
        return Results.BadRequest(new { message = "Email non valida" });
    }

    if (!new[] { "Admin", "User" }.Contains(request.Role))
    {
        return Results.BadRequest(new { message = "Ruolo non valido" });
    }

    if (userAccounts.Any(u => u.Username.ToLowerInvariant() == request.Username || 
                             u.Email.ToLowerInvariant() == request.Email))
    {
        logger.LogWarning("Tentativo di registrazione con username o email già esistenti: {Username}, {Email}", 
            request.Username, request.Email);
        return Results.BadRequest(new { message = "Username o email già esistenti" });
    }

    try
    {
        var newUser = new UserAccount
        {
            Id = Guid.NewGuid().ToString(),
            Username = request.Username,
            Email = request.Email,
            PasswordHash = authService.HashPassword(request.Password),
            Role = request.Role,
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };

        userAccounts.Add(newUser);
        
        var token = authService.GenerateJwtToken(newUser);
        var response = authService.CreateLoginResponse(newUser, token);
        
        logger.LogInformation("Registrazione riuscita per username: {Username}, ruolo: {Role}", 
            newUser.Username, newUser.Role);
        return Results.Ok(response);
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Errore durante la registrazione per username: {Username}", request.Username);
        return Results.Problem("Errore interno del server");
    }
});

app.MapGet("/api/auth/me", (ClaimsPrincipal user) =>
{
    if (user.Identity?.IsAuthenticated != true)
        return Results.Unauthorized();

    return Results.Ok(new
    {
        Id = user.FindFirst(ClaimTypes.NameIdentifier)?.Value,
        Username = user.FindFirst(ClaimTypes.Name)?.Value,
        Email = user.FindFirst(ClaimTypes.Email)?.Value,
        Role = user.FindFirst(ClaimTypes.Role)?.Value
    });
}).RequireAuthorization();

app.MapPost("/api/auth/logout", [EnableRateLimiting("GeneralPolicy")] (ClaimsPrincipal user, ILogger<Program> logger) =>
{
    if (user.Identity?.IsAuthenticated == true)
    {
        var username = user.FindFirst(ClaimTypes.Name)?.Value;
        logger.LogInformation("Logout effettuato per username: {Username}", username);
    }
    
    // In un'applicazione reale, qui potresti invalidare il token
    // Per ora restituiamo semplicemente un messaggio di successo
    return Results.Ok(new { message = "Logout effettuato con successo" });
});

// Account Management Endpoints (Admin only)
app.MapGet("/api/admin/accounts", (List<UserAccount> userAccounts) =>
{
    return Results.Ok(userAccounts.Select(u => new UserAccountDto
    {
        Id = u.Id,
        Username = u.Username,
        Email = u.Email,
        Role = u.Role,
        CreatedAt = u.CreatedAt,
        LastLoginAt = u.LastLoginAt,
        IsActive = u.IsActive
    }));
}).RequireAuthorization(policy => policy.RequireRole("Admin"));

app.MapPost("/api/admin/accounts", (RegisterRequest request, List<UserAccount> userAccounts, AuthService authService) =>
{
    if (userAccounts.Any(u => u.Username == request.Username || u.Email == request.Email))
    {
        return Results.BadRequest("Username or email already exists");
    }

    var newUser = new UserAccount
    {
        Id = Guid.NewGuid().ToString(),
        Username = request.Username,
        Email = request.Email,
        PasswordHash = authService.HashPassword(request.Password),
        Role = request.Role,
        CreatedAt = DateTime.UtcNow,
        IsActive = true
    };

    userAccounts.Add(newUser);
    
    return Results.Ok(new UserAccountDto
    {
        Id = newUser.Id,
        Username = newUser.Username,
        Email = newUser.Email,
        Role = newUser.Role,
        CreatedAt = newUser.CreatedAt,
        LastLoginAt = newUser.LastLoginAt,
        IsActive = newUser.IsActive
    });
}).RequireAuthorization(policy => policy.RequireRole("Admin"));

app.MapPut("/api/admin/accounts/{id}/toggle-status", (string id, List<UserAccount> userAccounts) =>
{
    var account = userAccounts.FirstOrDefault(u => u.Id == id);
    if (account == null)
    {
        return Results.NotFound();
    }

    account.IsActive = !account.IsActive;
    return Results.Ok(account);
}).RequireAuthorization(policy => policy.RequireRole("Admin"));

app.MapDelete("/api/admin/accounts/{id}", (string id, List<UserAccount> userAccounts) =>
{
    var account = userAccounts.FirstOrDefault(u => u.Id == id);
    if (account == null)
    {
        return Results.NotFound();
    }

    userAccounts.Remove(account);
    return Results.NoContent();
}).RequireAuthorization(policy => policy.RequireRole("Admin"));

// API Endpoints usando il servizio
app.MapGet("/api/users", async (IUserService userService, HttpContext context) =>
{
    // Ottieni l'utente corrente dal token JWT
    var userIdClaim = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    var roleClaim = context.User.FindFirst(ClaimTypes.Role)?.Value;
    
    if (userIdClaim == null || roleClaim == null)
    {
        return Results.Unauthorized();
    }
    
    var allUsers = await userService.GetAllUsersAsync();
    
    // Se è admin, mostra tutti i dipendenti
    // Se è user normale, mostra solo i suoi dipendenti
    var filteredUsers = roleClaim == "Admin" 
        ? allUsers 
        : allUsers.Where(u => u.UserId == userIdClaim);
    
    return Results.Ok(filteredUsers);
}).RequireAuthorization();

app.MapGet("/api/users/{id}", async (int id, IUserService userService) =>
{
    var user = await userService.GetUserByIdAsync(id);
    if (user == null)
        return Results.NotFound();
    
    return Results.Ok(user);
}).RequireAuthorization();

app.MapPost("/api/users", async (Froppo.Application.DTOs.CreateUserDto request, IUserService userService, HttpContext context) =>
{
    // Ottieni l'utente corrente dal token JWT
    var userIdClaim = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    var roleClaim = context.User.FindFirst(ClaimTypes.Role)?.Value;
    
    if (userIdClaim == null || roleClaim == null)
    {
        return Results.Unauthorized();
    }
    
    // Imposta l'userId se non è già impostato
    if (string.IsNullOrEmpty(request.UserId))
    {
        request.UserId = userIdClaim;
    }
    
    try
    {
        var user = await userService.CreateUserAsync(request);
        return Results.Created($"/api/users/{user.Id}", user);
    }
    catch (Exception ex)
    {
        return Results.BadRequest(ex.Message);
    }
}).RequireAuthorization();

app.MapPut("/api/users/{id}", async (int id, Froppo.Application.DTOs.UpdateUserDto request, IUserService userService) =>
{
    if (id != request.Id)
    {
        return Results.BadRequest("ID mismatch");
    }
    
    try
    {
        var user = await userService.UpdateUserAsync(request);
        return Results.Ok(user);
    }
    catch (ArgumentException ex)
    {
        return Results.NotFound(ex.Message);
    }
    catch (Exception ex)
    {
        return Results.BadRequest(ex.Message);
    }
}).RequireAuthorization();

app.MapDelete("/api/users/{id}", async (int id, IUserService userService) =>
{
    try
    {
        await userService.DeleteUserAsync(id);
        return Results.NoContent();
    }
    catch (Exception ex)
    {
        return Results.BadRequest(ex.Message);
    }
}).RequireAuthorization();

// Endpoint per gestione file PDF
app.MapPost("/api/files/upload", async (HttpContext context, Froppo.API.Services.FileStorageService fileStorageService) =>
{
    try
    {
        var form = await context.Request.ReadFormAsync();
        var file = form.Files["certificate"];
        
        if (file == null || file.Length == 0)
        {
            return Results.BadRequest("Nessun file fornito");
        }

        // Ottieni l'ID utente dal token JWT
        var userIdClaim = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null || !int.TryParse(userIdClaim, out var userId))
        {
            return Results.Unauthorized();
        }

        var result = await fileStorageService.UploadFileAsync(file, userId);
        
        return Results.Ok(new
        {
            fileName = result.FileName,
            originalName = result.OriginalName,
            size = result.Size,
            isDuplicate = result.IsDuplicate,
            message = result.IsDuplicate ? "File già esistente" : "File caricato con successo"
        });
    }
    catch (ArgumentException ex)
    {
        return Results.BadRequest(ex.Message);
    }
    catch (Exception ex)
    {
        return Results.BadRequest($"Errore durante il caricamento: {ex.Message}");
    }
}).RequireAuthorization();

app.MapGet("/api/files/{filename}", (string filename, Froppo.API.Services.FileStorageService fileStorageService) =>
{
    var fileContent = fileStorageService.GetFile(filename);
    if (fileContent == null)
    {
        return Results.NotFound("File non trovato");
    }

    var metadata = fileStorageService.GetFileMetadata(filename);
    var contentType = metadata?.ContentType ?? "application/pdf";
    
    return Results.File(fileContent, contentType, metadata?.OriginalName ?? filename);
}).RequireAuthorization();

app.MapDelete("/api/files/{filename}", (string filename, Froppo.API.Services.FileStorageService fileStorageService) =>
{
    var deleted = fileStorageService.DeleteFile(filename);
    return deleted ? Results.NoContent() : Results.NotFound();
}).RequireAuthorization();

app.Run();

// Helper function for email validation
static bool IsValidEmail(string email)
{
    try
    {
        var addr = new System.Net.Mail.MailAddress(email);
        return addr.Address == email;
    }
    catch
    {
        return false;
    }
}

// Models

public class CreateAccountRequest
{
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Role { get; set; } = "User";
}