using Froppo.Application.DTOs;
using Froppo.Application.Interfaces;
using Froppo.Domain.Entities;
using Froppo.Domain.Interfaces;

namespace Froppo.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
        {
            var users = await _userRepository.GetAllAsync();
            return users.Select(MapToDto);
        }

        public async Task<UserDto?> GetUserByIdAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            return user != null ? MapToDto(user) : null;
        }

        public async Task<UserDto> CreateUserAsync(CreateUserDto createUserDto)
        {
            var user = new User
            {
                FirstName = createUserDto.FirstName,
                LastName = createUserDto.LastName,
                Email = createUserDto.Email,
                UserId = createUserDto.UserId ?? string.Empty,
                DateOfBirth = createUserDto.DateOfBirth,
                PlaceOfBirth = createUserDto.PlaceOfBirth,
                Residence = createUserDto.Residence,
                Certificate = createUserDto.Certificate,
                CreatedAt = DateTime.UtcNow
            };

            var createdUser = await _userRepository.CreateAsync(user);
            return MapToDto(createdUser);
        }

        public async Task<UserDto> UpdateUserAsync(UpdateUserDto updateUserDto)
        {
            var existingUser = await _userRepository.GetByIdAsync(updateUserDto.Id);
            if (existingUser == null)
                throw new ArgumentException("User not found");

            existingUser.FirstName = updateUserDto.FirstName;
            existingUser.LastName = updateUserDto.LastName;
            existingUser.Email = updateUserDto.Email;
            existingUser.UserId = updateUserDto.UserId;
            existingUser.DateOfBirth = updateUserDto.DateOfBirth;
            existingUser.PlaceOfBirth = updateUserDto.PlaceOfBirth;
            existingUser.Residence = updateUserDto.Residence;
            existingUser.Certificate = updateUserDto.Certificate;
            existingUser.UpdatedAt = DateTime.UtcNow;

            var updatedUser = await _userRepository.UpdateAsync(existingUser);
            return MapToDto(updatedUser);
        }

        public async Task DeleteUserAsync(int id)
        {
            await _userRepository.DeleteAsync(id);
        }

        private static UserDto MapToDto(User user)
        {
            return new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                UserId = user.UserId,
                DateOfBirth = user.DateOfBirth,
                PlaceOfBirth = user.PlaceOfBirth,
                Residence = user.Residence,
                Certificate = user.Certificate,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            };
        }
    }
}
