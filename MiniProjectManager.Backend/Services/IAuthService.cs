using MiniProjectManager.Dtos;
using MiniProjectManager.Models;


namespace MiniProjectManager.Services
{
    public interface IAuthService
    {
        Task<string> Register(UserRegisterDto userRegisterDto);
        Task<string> Login(UserLoginDto userLoginDto);
        Task<User> GetUserFromToken(string token);
    }
}