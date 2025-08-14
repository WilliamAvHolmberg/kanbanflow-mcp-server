Update label
Description
Updates a label by name. Name is case-sensistive. Only supply the properties you want to change.

Request format
curl -X POST https://kanbanflow.com/api/v1/tasks/<TASK_ID>/labels/by-name/<NAME> -H "Content-type: application/json" -d '{ "<PROPERTY_1>": <PROPERTY_VALUE_1>, "<PROPERTY_2>": <PROPERTY_VALUE_2>, ... "<PROPERTY_N>": <PROPERTY_VALUE_N> }'
Example request
curl -X POST https://kanbanflow.com/api/v1/tasks/T3s6UGyzY/labels/by-name/Priority -H "Content-type: application/json"
 -d '{ "pinned": true }'
Valid properties
Property	Type	Comment
name	String	The name of the label
pinned	Boolean	Use true to indicate if the label should be pinned.