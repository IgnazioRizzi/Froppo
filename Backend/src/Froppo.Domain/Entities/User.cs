using System.ComponentModel.DataAnnotations;

namespace Froppo.Domain.Entities
{
    public class User
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string FirstName { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string LastName { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        [StringLength(50)]
        public string UserId { get; set; } = string.Empty; // ID dell'utente che possiede questo dipendente
        
        [Required]
        public DateTime DateOfBirth { get; set; } // Data di nascita
        
        [Required]
        [StringLength(100)]
        public string PlaceOfBirth { get; set; } = string.Empty; // Luogo di nascita
        
        [Required]
        [StringLength(100)]
        public string Residence { get; set; } = string.Empty; // Residenza
        
        [StringLength(255)]
        public string? Certificate { get; set; } = string.Empty; // Allegato attestato (nome file)
        
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
