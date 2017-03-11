using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace LanesoknadNS.Models
{
    public class lanesoknad
    {
        public int id { get; set; }
        [Required]
        [RegularExpression(@"^\d{11}$")]
        public Int64 personnummer { get; set; }
        [Required]
        [RegularExpression(@"^\d{8,12}$")]
        public string telefonnummer { get; set; }
        [Required]
        [RegularExpression(@"^\w+@\w+[.]\w{2,3}$")]
        public string email { get; set; }
        [Required]
        public int lanebelop { get; set; }
        [Required]
        public int ar { get; set; }
        [Required]
        public string manedsbelop { get; set; }
    }
}