using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models
{
    public class ImageResponseDto
    {
        public string? ImageBase64 { get; set; }
        public bool Success { get; set; }
    }
}
