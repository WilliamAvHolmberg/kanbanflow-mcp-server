Update subtask
Description
Updates a subtask by index or name. Index is 0-based. Name is case-sensistive. Only supply the properties you want to change.

Request format (index)
curl -X POST https://kanbanflow.com/api/v1/tasks/<TASK_ID>/subtasks/by-index/<INDEX> -H "Content-type: application/json" -d '{ "<PROPERTY_1>": <PROPERTY_VALUE_1>, "<PROPERTY_2>": <PROPERTY_VALUE_2>, ... "<PROPERTY_N>": <PROPERTY_VALUE_N> }'
Request format (name)
curl -X POST https://kanbanflow.com/api/v1/tasks/<TASK_ID>/subtasks/by-name/<NAME> -H "Content-type: application/json" -d '{ "<PROPERTY_1>": <PROPERTY_VALUE_1>, "<PROPERTY_2>": <PROPERTY_VALUE_2>, ... "<PROPERTY_N>": <PROPERTY_VALUE_N> }'
Example request (index)
curl -X POST https://kanbanflow.com/api/v1/tasks/T3s6UGyzY/subtasks/by-index/2 -H "Content-type: application/json"
 -d '{ "name": "Proofread" }'
Example request (name)
curl -X POST https://kanbanflow.com/api/v1/tasks/T3s6UGyzY/subtasks/by-name/Proofread -H "Content-type: application/json"
 -d '{ "finished": true }'
Valid properties
Property	Type	Comment
name	String	The name of the subtasks
finished	Boolean	Use true to indicate if the subtask should be checked.
userId	String	Optional. Used for assigning a user to the subtask. If you want to clear the field use null as value without any quotes.
dueDateTimestamp	String	Optional. The UTC timestamp when the subtask is due. If you want to clear the field use null as value without any quotes.
dueDateTimestampLocal	String	Optional. Defaults to dueTimestamp if not given. The user local timestamp when the subtask is due. Used for email reminders. If you want to clear the field use null as value without any quotes.