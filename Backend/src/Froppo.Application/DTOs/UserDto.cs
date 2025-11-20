namespace Froppo.Application.DTOs
{
    public class UserDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public string PlaceOfBirth { get; set; } = string.Empty;
        public string Residence { get; set; } = string.Empty;
        public string? CodiceFiscale { get; set; } = string.Empty;
        public string? Certificate { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class CreateUserDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? UserId { get; set; } = string.Empty; // Opzionale, verrà impostato dal controller
        public DateTime DateOfBirth { get; set; }
        public string PlaceOfBirth { get; set; } = string.Empty;
        public string Residence { get; set; } = string.Empty;
        public string? CodiceFiscale { get; set; } = string.Empty;
        public string? Certificate { get; set; } = string.Empty;
    }

    public class UpdateUserDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public string PlaceOfBirth { get; set; } = string.Empty;
        public string Residence { get; set; } = string.Empty;
        public string? CodiceFiscale { get; set; } = string.Empty;
        public string? Certificate { get; set; } = string.Empty;
    }
}
