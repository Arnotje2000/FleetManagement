using Fleet_Management_BL.Interface;
using Fleet_Management_BL.Model;
using Fleet_Management_BL.DTOs;
using Fleet_Management_BL.Mapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace REST.Controllers
{
    [Route("api/tenant")]
    [ApiController]
    public class TenantController : ControllerBase
    {
        private readonly ITenantRepository repo;

        public TenantController(ITenantRepository _repo)
        {
            repo = _repo;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TenantDTO>>> GetAllTenants()
        {
            try
            {
                var tenants = await repo.GetAllTenantsAsync();
                return Ok(tenants.ToDTOList());
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest("Something went wrong while fetching tenants");
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddTenant([FromBody] TenantDTO tenantDto)
        {
            if (tenantDto == null)
            {
                return BadRequest("Tenant is null");
            }
            try
            {
                var tenant = new Tenant(tenantDto.CompanyName, tenantDto.VATNumber, tenantDto.IsDeleted);
                var addedTenant = await repo.AddTenantAsync(tenant);
                return CreatedAtAction(nameof(GetTenantById), new { tenantId = addedTenant.TenantId }, addedTenant.ToDTO());
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest("Something went wrong in the database");
            }
        }

        [HttpDelete("{tenantId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteTenant(int tenantId)
        {
            try
            {
                var tenant = await repo.GetTenantByIdAsync(tenantId);
                if (tenant == null)
                {
                    return NotFound($"Tenant with ID {tenantId} not found");
                }

                tenant.IsDeleted = true;
                await repo.UpdateTenantAsync(tenant);
                return Ok();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest("Something went wrong in the database");
            }
        }

        [HttpPut("{tenantId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateTenant(int tenantId, [FromBody] TenantDTO tenantDto)
        {
            if (tenantDto == null || tenantDto.TenantId != tenantId)
            {
                return BadRequest("Tenant data is incorrect");
            }

            try
            {
                var existingTenant = await repo.GetTenantByIdAsync(tenantId);
                if (existingTenant == null)
                {
                    return NotFound($"Tenant with ID {tenantId} not found");
                }

                existingTenant.CompanyName = tenantDto.CompanyName;
                existingTenant.VATNumber = tenantDto.VATNumber;
                existingTenant.IsDeleted = tenantDto.IsDeleted;

                var updatedTenant = await repo.UpdateTenantAsync(existingTenant);
                return Ok(updatedTenant.ToDTO());
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest("Something went wrong in the database");
            }
        }

        [HttpGet("{tenantId}")]
        public async Task<ActionResult<object>> GetTenantById(int tenantId)
        {
            Console.WriteLine($"Fetching tenant with ID: {tenantId}");
            try
            {
                var tenant = await repo.GetTenantByIdAsync(tenantId);
                if (tenant == null)
                {
                    return NotFound();
                }

                var response = new
                {
                    TenantId = tenant.TenantId,
                    CompanyName = tenant.CompanyName,
                    VATNumber = tenant.VATNumber,
                    IsDeleted = tenant.IsDeleted,
                    Users = (tenant.Users ?? Enumerable.Empty<User>()).Select(u => new
                    {
                        UserId = u.UserId,
                        Email = u.Email,
                        IsDeleted = u.IsDeleted
                    }),
                    CustomFields = (tenant.CustomFields ?? Enumerable.Empty<CustomField>())
                        .Where(cf => cf != null && !cf.IsDeleted)
                        .Select(cf => new
                        {
                            CustomFieldId = cf.CustomFieldId,
                            FieldName = cf.FieldName,
                            ValueType = cf.ValueType,
                            IsDeleted = cf.IsDeleted
                        }),
                    Vehicles = (tenant.Vehicles ?? Enumerable.Empty<Vehicle>())
                        .Where(v => v != null && !v.IsDeleted)
                        .Select(v => new
                        {
                            VehicleId = v.VehicleId,
                            Brand = v.Brand,
                            Model = v.Model,
                            LicensePlate = v.LicensePlate,
                            ChassisNumber = v.ChassisNumber,
                            FuelTypeId = v.FuelTypeId,
                            Color = v.Color,
                            VehicleTypeId = v.VehicleTypeId,
                            TenantId = v.TenantId,
                            IsDeleted = v.IsDeleted,
                            CustomFieldValues = (v.CustomFieldValues ?? Enumerable.Empty<CustomFieldValue>())
                                .Where(cfv => cfv != null && !cfv.IsDeleted)
                                .Select(cfv => new
                                {
                                    CustomFieldValueId = cfv.CustomFieldValueId,
                                    VehicleId = cfv.VehicleId,
                                    CustomFieldId = cfv.CustomFieldId,
                                    Value = cfv.Value,
                                    ValueType = cfv.CustomField?.ValueType,
                                    IsDeleted = cfv.IsDeleted,
                                    CustomField = cfv.CustomField != null ? new
                                    {
                                        CustomFieldId = cfv.CustomField.CustomFieldId,
                                        FieldName = cfv.CustomField.FieldName,
                                        ValueType = cfv.CustomField.ValueType,
                                        IsDeleted = cfv.CustomField.IsDeleted
                                    } : null
                                })
                        })
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest();
            }
        }

        [HttpGet("{tenantId}/users")]
        public async Task<ActionResult<List<User>>> GetUsersByTenantId(int tenantId)
        {
            Console.WriteLine($"Fetching users for tenant with ID: {tenantId}");
            try
            {
                var users = await repo.GetUsersByTenantIdAsync(tenantId);
                if (users == null || users.Count == 0)
                {
                    return NotFound($"No users found for tenant ID {tenantId}");
                }
                return Ok(users);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest("Something went wrong while fetching users");
            }
        }

        [HttpPost("{tenantId}/customfields")]
        public async Task<IActionResult> AddCustomField(int tenantId, [FromBody] CustomField customField)
        {
            if (customField == null)
            {
                return BadRequest("Custom field data is null");
            }

            try
            {
                var tenant = await repo.GetTenantByIdAsync(tenantId);
                if (tenant == null)
                {
                    return NotFound($"Tenant with ID {tenantId} not found");
                }

                customField.TenantId = tenantId;
                customField.IsDeleted = false;
                customField.CustomFieldValues = new List<CustomFieldValue>();
                customField.Tenant = null;

                var addedField = await repo.AddCustomFieldAsync(customField);
                return Ok(addedField);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest($"Something went wrong while adding the custom field: {ex.Message}");
            }
        }

        [HttpGet("{tenantId}/customfields")]
        public async Task<ActionResult<IEnumerable<CustomField>>> GetCustomFields(int tenantId)
        {
            try
            {
                var tenant = await repo.GetTenantByIdAsync(tenantId);
                if (tenant == null)
                {
                    return NotFound($"Tenant with ID {tenantId} not found");
                }

                var customFields = tenant.CustomFields.Where(cf => !cf.IsDeleted).ToList();
                return Ok(customFields);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest("Something went wrong while fetching custom fields");
            }
        }

        [HttpDelete("{tenantId}/customfields/{customFieldId}")]
        public async Task<IActionResult> DeleteCustomField(int tenantId, int customFieldId)
        {
            try
            {
                var tenant = await repo.GetTenantByIdAsync(tenantId);
                if (tenant == null)
                {
                    return NotFound($"Tenant with ID {tenantId} not found");
                }

                var customField = tenant.CustomFields.FirstOrDefault(cf => cf.CustomFieldId == customFieldId);
                if (customField == null)
                {
                    return NotFound($"Custom field with ID {customFieldId} not found");
                }

                await repo.DeleteCustomFieldAsync(customFieldId);
                return Ok();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest($"Something went wrong while deleting the custom field: {ex.Message}");
            }
        }

        [HttpPut("{tenantId}/customfields/{customFieldId}")]
        public async Task<IActionResult> UpdateCustomField(int tenantId, int customFieldId, [FromBody] CustomField customField)
        {
            if (customField == null || customField.CustomFieldId != customFieldId)
            {
                return BadRequest("Invalid custom field data");
            }

            try
            {
                var tenant = await repo.GetTenantByIdAsync(tenantId);
                if (tenant == null)
                {
                    return NotFound($"Tenant with ID {tenantId} not found");
                }

                var existingCustomField = tenant.CustomFields.FirstOrDefault(cf => cf.CustomFieldId == customFieldId);
                if (existingCustomField == null)
                {
                    return NotFound($"Custom field with ID {customFieldId} not found");
                }

                var updatedField = await repo.UpdateCustomFieldAsync(customField);
                return Ok(updatedField);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest($"Something went wrong while updating the custom field: {ex.Message}");
            }
        }
    }
}