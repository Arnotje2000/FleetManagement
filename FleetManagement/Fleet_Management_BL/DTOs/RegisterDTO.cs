using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fleet_Management_BL.DTOs
{
    public class RegisterDTO
    {
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? Code { get; set; }
    }
}
