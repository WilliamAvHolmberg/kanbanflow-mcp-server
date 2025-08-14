Create/update date
Description
Create/update date. If no date exists for given targetColumnId it is created, otherwise it is replaced.

Request format
curl -X POST https://kanbanflow.com/api/v1/tasks/<TASK_ID>/dates -H "Content-type: application/json" -d '{ "<PROPERTY_1>": <PROPERTY_VALUE_1>, "<PROPERTY_2>": <PROPERTY_VALUE_2>, ... "<PROPERTY_N>": <PROPERTY_VALUE_N> }'
Example request
curl -X POST https://kanbanflow.com/api/v1/tasks/T3s6UGyzY/dates -H "Content-type: application/json"
 -d '{ "dueTimestamp": "2023-03-01T12:00:00Z", "dueTimestampLocal": "2023-03-01T13:00:00+01:00", "targetColumnId": "COxkPjd0wra4" }'
Valid properties
Property	Type	Comment
dateType	String	Optional (default="dueDate"). Only valid value is "dueDate". More types may be added in the future.
status	String	Optional (default="active"). Either "active" or "done".
dueTimestamp	String	Required. The UTC timestamp when the task is due for the target column.
dueTimestampLocal	String	Optional. Defaults to dueTimestamp if not given. The user local timestamp when the task is due for the target column. Used for email reminders.
targetColumnId	String	Required. The ID of the column that the task should reach before it's due. See Get board for column IDs.