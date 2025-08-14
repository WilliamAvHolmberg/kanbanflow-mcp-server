Create label
Description
Create a label. By default it will be added as the last label of its task, but you can optionally use a insertIndex query parameter to specify where in the label list it should be added.

Request format
curl -X POST https://kanbanflow.com/api/v1/tasks/<TASK_ID>/labels -H "Content-type: application/json" -d '{ "<PROPERTY_1>": <PROPERTY_VALUE_1>, "<PROPERTY_2>": <PROPERTY_VALUE_2>, ... "<PROPERTY_N>": <PROPERTY_VALUE_N> }'
Example request
curl -X POST https://kanbanflow.com/api/v1/tasks/T3s6UGyzY/labels -H "Content-type: application/json"
 -d '{ "name": "Project X" }'
Example response
{
    "insertIndex": 0
}
Valid properties
Property	Type	Comment
name	String	Required. The name of the label.
pinned	Boolean	Optional (default=false). Use true to indicate that the label should be pinned.