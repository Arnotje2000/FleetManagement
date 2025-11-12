using Fleet_Management_BL.Interface;
using Fleet_Management_BL.Model;
using Microsoft.AspNetCore.Mvc;

namespace REST.Controllers
{
    [Route("api/customfieldvalues")]
    [ApiController]
    public class CustomFieldValueController : ControllerBase
    {
        private readonly IVehicleRepository repo;

        public CustomFieldValueController(IVehicleRepository _repo)
        {
            repo = _repo;
        }

        [HttpPost]
        public async Task<IActionResult> AddCustomFieldValue([FromBody] CustomFieldValue customFieldValue)
        {
            if (customFieldValue == null)
            {
                return BadRequest("CustomFieldValue is null");
            }
            try
            {
                var addedValue = await repo.AddCustomFieldValueAsync(customFieldValue);
                return Ok(addedValue);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest("Something went wrong in the database");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCustomFieldValue(int id, [FromBody] CustomFieldValue customFieldValue)
        {
            if (customFieldValue == null || customFieldValue.CustomFieldValueId != id)
            {
                return BadRequest("CustomFieldValue data is incorrect");
            }
            try
            {
                var updatedValue = await repo.UpdateCustomFieldValueAsync(customFieldValue);
                return Ok(updatedValue);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest("Something went wrong in the database");
            }
        }
    }
}