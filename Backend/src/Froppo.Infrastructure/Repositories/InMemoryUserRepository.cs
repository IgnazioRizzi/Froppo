using Froppo.Domain.Entities;
using Froppo.Domain.Interfaces;

namespace Froppo.Infrastructure.Repositories
{
    public class InMemoryUserRepository : IUserRepository
    {
        private readonly List<User> _users;

        public InMemoryUserRepository(List<User> users)
        {
            _users = users;
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await Task.FromResult(_users.AsEnumerable());
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await Task.FromResult(_users.FirstOrDefault(u => u.Id == id));
        }

        public async Task<User> CreateAsync(User user)
        {
            // Genera un nuovo ID se non è impostato
            if (user.Id == 0)
            {
                user.Id = _users.Count > 0 ? _users.Max(u => u.Id) + 1 : 1;
            }
            
            _users.Add(user);
            return await Task.FromResult(user);
        }

        public async Task<User> UpdateAsync(User user)
        {
            var existingUser = _users.FirstOrDefault(u => u.Id == user.Id);
            if (existingUser != null)
            {
                var index = _users.IndexOf(existingUser);
                _users[index] = user;
            }
            return await Task.FromResult(user);
        }

        public async Task DeleteAsync(int id)
        {
            var user = _users.FirstOrDefault(u => u.Id == id);
            if (user != null)
            {
                _users.Remove(user);
            }
            await Task.CompletedTask;
        }
    }
}
