using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fleet_Management_BL.Model
{
    public class CustomFieldValue
    {
        public CustomFieldValue()
        {
        }
        public CustomFieldValue(int vehicleId, int customFieldId, string value, bool isDeleted)
        {
            VehicleId = vehicleId;
            CustomFieldId = customFieldId;
            Value = value;
            IsDeleted = isDeleted;
        }

        public CustomFieldValue(int customFieldValueId, int vehicleId, int customFieldId, string value, bool isDeleted)
        {
            CustomFieldValueId = customFieldValueId;
            VehicleId = vehicleId;
            CustomFieldId = customFieldId;
            Value = value;
            IsDeleted = isDeleted;
        }

        public int CustomFieldValueId { get; set; }
        public int VehicleId { get; set; }
        public int CustomFieldId { get; set; }
        public string Value { get; set; }
        public bool IsDeleted { get; set; }
        public string ValueType { get; set; }
        public CustomField CustomField { get; set; }
        public Vehicle Vehicle { get; set; }

        public object GetTypedValue()
        {
            if (CustomField == null) return Value;

            switch (CustomField.ValueType.ToLower())
            {
                case "string":
                    return Value;
                case "int":
                    return int.TryParse(Value, out int intValue) ? intValue : 0;
                case "datetime":
                    return DateTime.TryParse(Value, out DateTime dateValue) ? dateValue : DateTime.MinValue;
                case "boolean":
                    return bool.TryParse(Value, out bool boolValue) ? boolValue : false;
                default:
                    return Value;
            }
        }

        public void SetTypedValue(object value)
        {
            Value = value?.ToString() ?? string.Empty;
        }
    }
}
