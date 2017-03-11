using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity;
using System.Linq;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Web;
using System.Data.Entity.Core.EntityClient;
using System.Data.Common;

namespace LanesoknadNS.Models
{
    public class Lanesoknad
    {
        [Key]
        public int id { get; set; }
        public Int64 personnummer { get; set; }
        public string telefonnummer { get; set; }
        public string email { get; set; }
        public int lanebelop { get; set; }
        public int ar { get; set; }
        public string manedsbelop { get; set; }


    }

    public class LanesoknadContext : DbContext
    {
        public LanesoknadContext()
          : base("name=Kunde")
        {
            Database.CreateIfNotExists();
        }

        // konstruktøren under brukes kun under test!
        public LanesoknadContext(DbConnection connection)
                : base(connection,true)
        {
        }
      
        public DbSet<Lanesoknad> Lanesoknader { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }


}