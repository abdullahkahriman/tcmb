using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Xml;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace TCMB.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class KurController : ControllerBase
  {
    public ActionResult Get()
    {
      var client = new WebClient();
      string xml = client.DownloadString("https://www.tcmb.gov.tr/kurlar/today.xml");

      XmlDocument doc = new XmlDocument();
      doc.LoadXml(xml);

      //var currency = doc.SelectSingleNode("Tarih_Date/Currency[@Kod='USD']");

      var currency = doc.SelectNodes("Tarih_Date/Currency");
      string json = JsonConvert.SerializeObject(currency);
      return Ok(json);
    }


    //// GET api/values
    //[HttpGet]
    //public ActionResult<IEnumerable<string>> Get()
    //{
    //    return new string[] { "value1", "value2" };
    //}

    //// GET api/values/5
    //[HttpGet("{id}")]
    //public ActionResult<string> Get(int id)
    //{
    //    return "value";
    //}

    //// POST api/values
    //[HttpPost]
    //public void Post([FromBody] string value)
    //{
    //}

    //// PUT api/values/5
    //[HttpPut("{id}")]
    //public void Put(int id, [FromBody] string value)
    //{
    //}

    //// DELETE api/values/5
    //[HttpDelete("{id}")]
    //public void Delete(int id)
    //{
    //}
  }
}
