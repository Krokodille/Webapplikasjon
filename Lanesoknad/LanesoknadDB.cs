using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Web;
using LanesoknadNS.Models;

namespace LanesoknadNS
{
    public class LanesoknadDB 
    {
        LanesoknadContext db = new LanesoknadContext();
        
        public List<lanesoknad> hentAlleLanesoknader()
        {
            List<lanesoknad> alleLanesoknader = db.Lanesoknader.Select(s=> new lanesoknad()
                                      {
                                          id = s.id,
                                          personnummer = s.personnummer,
                                          telefonnummer = s.telefonnummer,
                                          email = s.email,
                                          lanebelop = s.lanebelop,
                                          ar = s.ar,
                                          manedsbelop = s.manedsbelop
                                      }).ToList();
            return alleLanesoknader;
        }
        /*
        public soknad hentEnSoknad(int id)
        {
            Soknad enDBSoknad = db.Soknad.Find(id); 

            var enSoknad = new soknad()
            {
                personnummer = enDBSoknad.personnummer,
                telefonnummer = enDBSoknad.telefonnummer,
                email = enDBSoknad.email,
                lanebelop = enDBSoknad.lanebelop,
                ar = enDBSoknad.ar,
                manedsbelop = enDBSoknad.manedsbelop
            };
            return enSoknad;
        }
          
        public bool lagreSoknad(lanesoknad innSoknad)
        {
            var nySoknad = new Lanesoknad
            {
                personnummer = innSoknad.personnummer,
                telefonnummer = innSoknad.telefonnummer,
                email = innSoknad.email,
                lanebelop = innSoknad.lanebelop,
                ar = innSoknad.ar,
                manedsbelop = innSoknad.manedsbelop
            };

            return true;
        }    
        */
        public bool lagreSoknad(lanesoknad innSoknad)
        {
            /*
            var enSoknad = new Lanesoknad
            {
                personnummer = innSoknad.personnummer,
                telefonnummer = innSoknad.telefonnummer,
                email = innSoknad.email,
                lanebelop = innSoknad.lanebelop,
                ar = innSoknad.ar,
                manedsbelop = innSoknad.manedsbelop
            };
            try
            {
                // lagre søknad
                System.Diagnostics.Debug.WriteLine(enSoknad.personnummer);
                db.Lanesoknader.Add(enSoknad);
                db.SaveChanges();
            }
            catch (Exception feil)
            {
                return false;
            }
            return true;*/

            //Lanesoknad funnetSoknad = db.Lanesoknader.Find(innSoknad.personnummer);
            Lanesoknad funnetSoknad = db.Lanesoknader.SingleOrDefault(soknad => soknad.personnummer == innSoknad.personnummer);

            if (funnetSoknad != null)
            {
                return false;
            }

            var nySoknad = new Lanesoknad
            {
                personnummer = innSoknad.personnummer,
                telefonnummer = innSoknad.telefonnummer,
                email = innSoknad.email,
                lanebelop = innSoknad.lanebelop,
                ar = innSoknad.ar,
                manedsbelop = innSoknad.manedsbelop
            };
            
            try
            {
                // lagre kunden
                db.Lanesoknader.Add(nySoknad);
                db.SaveChanges();
            }
            catch (Exception feil)
            {
                return false;
            }
            return true;
        }
        /*
          Poststed funnetPoststed = db.Poststeder.Find(innKunde.postnr);
          if (funnetPoststed == null)
          {
              // lag poststedet
              var nyttPoststed = new Poststed
              {
                  postnr = innKunde.postnr,
                  poststed = innKunde.poststed
              };
              // legg det inn i den nye kunden
              nyKunde.poststed = nyttPoststed;

          }
          try
          {
              // lagre kunden
              db.Kunder.Add(nyKunde);
              db.SaveChanges();
          }
          catch(Exception feil)
          {
              return false;
          }
          return true;
      }
      public bool endreEnKunde(int id, kunde innKunde)
      {
          // finn kunden
          Kunde funnetKunde = db.Kunder.FirstOrDefault(k => k.id == id);
          if (funnetKunde == null)
          {
              return false;
          }
          // legg inn ny verdier i denne fra innKunde
          funnetKunde.fornavn = innKunde.fornavn;
          funnetKunde.etternavn = innKunde.etternavn;
          funnetKunde.adresse = innKunde.adresse;
          funnetKunde.postnr = innKunde.postnr;

          // finn ut om postnummer finnes fra før
          Poststed funnetPoststed = db.Poststeder.Find(innKunde.postnr);
          if(funnetPoststed==null)
          {
              // lag poststedet
              var nyttPoststed = new Poststed
              {
                  postnr = innKunde.postnr,
                  poststed = innKunde.poststed
              };
              // legg det inn i kunden
              funnetKunde.poststed = nyttPoststed;
          }
          try
          {
              // lagre kunden
              db.SaveChanges();
          }
          catch(Exception feil)
          {
              return false;
          }
          return true;
      }

      public bool slettEnKunde(int id)
      {
          try
          {
              Kunde finnKunde = db.Kunder.Find(id);
              db.Kunder.Remove(finnKunde);
              db.SaveChanges();
          }
          catch(Exception feil)
          {
              return false;
          }
          return true;
      }*/
    }
}