Create/update custom field value for task
Description
Create/update custom field value for task. If no value exists for custom field it is added, otherwise it is replaced.

Request format
curl -X POST https://kanbanflow.com/api/v1/tasks/<TASK_ID>/custom-fields/<CUSTOM_FIELD_ID> -H "Content-type: application/json" -d '{ "<PROPERTY_1>": <PROPERTY_VALUE_1>, "<PROPERTY_2>": <PROPERTY_VALUE_2>, ... "<PROPERTY_N>": <PROPERTY_VALUE_N> }'
Example request
curl -X POST https://kanbanflow.com/api/v1/tasks/g3aB3m/custom-fields -H "Content-type: application/json"
 -d '{ "value": { "text": "London" } }'
Valid properties
Property	Type	Comment
value	Object	The value to set for the custom field on this task. For Text or Dropdown custom fields it has a single property "text". For Number it has a single property "number". Examples: { "text": "London" }, { "number": 123.45 }