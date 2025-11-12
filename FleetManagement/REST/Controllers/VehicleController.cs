using Fleet_Management_BL.Interface;
using Fleet_Management_BL.Model;
using Fleet_Management_BL.DTOs;
using Fleet_Management_BL.Mapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace REST.Controllers
{
    [Route("api/vehicles")]
    [ApiController]
    public class VehicleController : ControllerBase
    {
        private readonly IVehicleRepository repo;

        public VehicleController(IVehicleRepository _repo)
        {
            repo = _repo;
        }

        [HttpPost]
        public async Task<IActionResult> AddVehicle([FromBody] VehicleDTO vehicleDto)
        {
            if (vehicleDto == null)
            {
                return BadRequest("Vehicle is null");
            }
            try
            {
                var vehicle = new Vehicle(
                    new Tenant { TenantId = vehicleDto.TenantId },
                    new VehicleType { VehicleTypeId = vehicleDto.VehicleTypeId },
                    vehicleDto.Brand,
                    vehicleDto.Model,
                    vehicleDto.ChassisNumber,
                    vehicleDto.LicensePlate,
                    new FuelType { FuelTypeId = vehicleDto.FuelTypeId },
                    vehicleDto.Color,
                    vehicleDto.IsDeleted
                );

                var addedVehicle = await repo.AddVehicleAsync(vehicle);
                return CreatedAtAction(nameof(GetVehicleDetails), 
                    new { tenantId = addedVehicle.TenantId, vehicleId = addedVehicle.VehicleId }, 
                    addedVehicle.ToDTO());
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest("Something went wrong in the database");
            }
        }

        [HttpDelete("{vehicleId}")]
        public async Task<IActionResult> DeleteVehicle(int vehicleId)
        {
            try
            {
                var deletedVehicle = await repo.DeleteVehicleAsync(vehicleId);
                if (deletedVehicle == null)
                {
                    return NotFound($"Vehicle with ID {vehicleId} not found");
                }
                return Ok(deletedVehicle.ToDTO());
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest("Something went wrong in the database");
            }
        }

        [HttpPut("{vehicleId}")]
        public async Task<IActionResult> UpdateVehicle(int vehicleId, [FromBody] VehicleDTO vehicleDto)
        {
            if (vehicleDto == null || vehicleDto.VehicleId != vehicleId)
            {
                return BadRequest("Vehicle data is incorrect");
            }

            try
            {
                var existingVehicle = await repo.GetVehicleByIdAsync(vehicleId);
                if (existingVehicle == null)
                {
                    return NotFound($"Vehicle with ID {vehicleId} not found");
                }

                // Update basic properties
                existingVehicle.Brand = vehicleDto.Brand;
                existingVehicle.Model = vehicleDto.Model;
                existingVehicle.ChassisNumber = vehicleDto.ChassisNumber;
                existingVehicle.LicensePlate = vehicleDto.LicensePlate;
                existingVehicle.Color = vehicleDto.Color;
                existingVehicle.IsDeleted = vehicleDto.IsDeleted;
                existingVehicle.TenantId = vehicleDto.TenantId;
                existingVehicle.VehicleTypeId = vehicleDto.VehicleTypeId;
                existingVehicle.FuelTypeId = vehicleDto.FuelTypeId;

                // Update custom field values
                if (vehicleDto.CustomFieldValues != null)
                {
                    foreach (var customFieldValue in vehicleDto.CustomFieldValues)
                    {
                        var existingValue = existingVehicle.CustomFieldValues
                            .FirstOrDefault(cfv => cfv.CustomFieldId == customFieldValue.CustomFieldId);

                        if (existingValue != null)
                        {
                            // Update existing value
                            existingValue.Value = customFieldValue.Value;
                            existingValue.ValueType = customFieldValue.ValueType;
                        }
                        else
                        {
                            // Create new value
                            var newValue = new CustomFieldValue
                            {
                                VehicleId = vehicleId,
                                CustomFieldId = customFieldValue.CustomFieldId,
                                Value = customFieldValue.Value,
                                ValueType = customFieldValue.ValueType,
                                IsDeleted = false
                            };
                            existingVehicle.CustomFieldValues.Add(newValue);
                        }
                    }
                }

                var updatedVehicle = await repo.UpdateVehicleAsync(existingVehicle);
                return Ok(updatedVehicle.ToDTO());
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating vehicle: {ex}");
                return BadRequest($"Error updating vehicle: {ex.Message}");
            }
        }

        [HttpGet("{tenantId}/vehicles/{vehicleId}")]
        public async Task<ActionResult<VehicleDTO>> GetVehicleDetails(int tenantId, int vehicleId)
        {
            try
            {
                var vehicle = await repo.GetVehicleByIdAsync(vehicleId);
                if (vehicle == null || vehicle.TenantId != tenantId)
                {
                    return NotFound();
                }
                return Ok(vehicle.ToDTO());
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest();
            }
        }

        [HttpGet("types")]
        public async Task<ActionResult<IEnumerable<VehicleType>>> GetVehicleTypes()
        {
            try
            {
                var vehicleTypes = await repo.GetVehicleTypesAsync();
                return Ok(vehicleTypes);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest("Something went wrong while fetching vehicle types");
            }
        }

        [HttpGet("fueltypes")]
        public async Task<ActionResult<IEnumerable<FuelType>>> GetFuelTypes()
        {
            try
            {
                var fuelTypes = await repo.GetFuelTypesAsync();
                return Ok(fuelTypes);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest("Something went wrong while fetching fuel types");
            }
        }

        [HttpGet("{tenantId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetVehicles(int tenantId)
        {
            try
            {
                var vehicles = await repo.GetVehiclesAsync(tenantId);
                
                // Create a simplified response without circular references
                var response = vehicles.Select(v => new
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
                    CustomFieldValues = v.CustomFieldValues
                        .Where(cfv => !cfv.IsDeleted)
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
                });

                return Ok(response);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest("Something went wrong in the database");
            }
        }

        [HttpGet("tenant/{tenantId}/allcustomfields")]
        public async Task<ActionResult<IEnumerable<CustomField>>> GetAllCustomFields(int tenantId)
        {
            try
            {
                var customFields = await repo.GetAllCustomFieldsAsync(tenantId);
                return Ok(customFields);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest("Something went wrong while fetching custom fields");
            }
        }
    }
}