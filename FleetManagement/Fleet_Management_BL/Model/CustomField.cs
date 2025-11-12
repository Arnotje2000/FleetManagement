using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fleet_Management_BL.Model
{
    public class CustomField
    {
        public CustomField()
        {
            CustomFieldValues = new List<CustomFieldValue>();
        }
        public CustomField(int tenantId, string valueType, string fieldName, bool isDeleted)
        {
            TenantId = tenantId;
            ValueType = valueType;
            FieldName = fieldName;
            IsDeleted = isDeleted;
            CustomFieldValues = new List<CustomFieldValue>();
        }

        public CustomField(int customFieldId, int tenantId, string valueType, string fieldName, bool isDeleted)
        {
            CustomFieldId = customFieldId;
            TenantId = tenantId;
            ValueType = valueType;
            FieldName = fieldName;
            IsDeleted = isDeleted;
            CustomFieldValues = new List<CustomFieldValue>();
        }

        public int CustomFieldId { get; set; }
        public int TenantId { get; set; }
        public string ValueType { get; set; }
        public string FieldName { get; set; }
        public bool IsDeleted { get; set; }
        public Tenant Tenant { get; set; }
        public ICollection<CustomFieldValue> CustomFieldValues { get; set; }
    }
}
