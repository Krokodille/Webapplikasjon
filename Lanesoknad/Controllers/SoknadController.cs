using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;
using System.Web.Script.Serialization;
using System.Net.Http.Formatting;
using System.Data.Common;

using LanesoknadNS.Models;

namespace LanesoknadNS
{
    public class SoknadController : ApiController
    {
        LanesoknadDB LanesoknadDb = new LanesoknadDB();
        // GET api/Kunde

        public HttpResponseMessage Get()
        {
            List<lanesoknad> alleLanesoknader = LanesoknadDb.hentAlleLanesoknader();

            var Json = new JavaScriptSerializer();
            string JsonString = Json.Serialize(alleLanesoknader);

            return new HttpResponseMessage()
            {
                Content = new StringContent(JsonString, Encoding.UTF8, "application/json"),
                StatusCode = HttpStatusCode.OK
            };
        }       

        [HttpPost]
        public HttpResponseMessage Post([FromBody]lanesoknad innSoknad)
        {
            if (ModelState.IsValid)
            {
                bool OK = LanesoknadDb.lagreSoknad(innSoknad);
                if (OK)
                {
                    return new HttpResponseMessage()
                    {
                        StatusCode = HttpStatusCode.OK
                    };
                }
            } else
            {
                System.Diagnostics.Debug.WriteLine(string.Join(",",
                    ModelState.Values.Where(E => E.Errors.Count > 0)
                    .SelectMany(E => E.Errors)
                    .Select(E => E.ErrorMessage)
                    .ToArray()));
            }
            return new HttpResponseMessage()
            {
                StatusCode = HttpStatusCode.BadRequest,
                Content = new StringContent("Kunne ikke sette inn kunden i DB")
            };
        }         
    }
}