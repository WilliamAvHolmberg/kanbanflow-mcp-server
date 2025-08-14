Create subtask
Description
Create a subtask. By default it will be added as the last subtask of its task, but you can optionally use a insertIndex query parameter to specify where in the subtask list it should be added.

Request format
curl -X POST https://kanbanflow.com/api/v1/tasks/<TASK_ID>/subtasks -H "Content-type: application/json" -d '{ "<PROPERTY_1>": <PROPERTY_VALUE_1>, "<PROPERTY_2>": <PROPERTY_VALUE_2>, ... "<PROPERTY_N>": <PROPERTY_VALUE_N> }'
Example request
curl -X POST https://kanbanflow.com/api/v1/tasks/T3s6UGyzY/subtasks -H "Content-type: application/json"
 -d '{ "name": "Proofread" }'
Example response
{
    "insertIndex": 0
}
Valid properties
Property	Type	Comment
name	String	Required. The name of the subtasks.
finished	Boolean	Optional (default=false). Use true to indicate if the subtask should be checked.
userId	String	Optional. Used for assigning a user to the subtask.
dueDateTimestamp	String	Optional. The UTC timestamp when the subtask is due.
dueDateTimestampLocal	String	Optional. Defaults to dueTimestamp if not given. The user's local timestamp when the subtask is due. Used for email reminders.