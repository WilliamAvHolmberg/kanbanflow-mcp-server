Update comment
Description
Updates a comment. Only supply the properties you want to change.

Request format
curl -X POST https://kanbanflow.com/api/v1/tasks/<TASK_ID>/comments/<COMMENT_ID> -H "Content-type: application/json"
 -d '{ "<PROPERTY_1>": <PROPERTY_VALUE_1>, "<PROPERTY_2>": <PROPERTY_VALUE_2>, ... "<PROPERTY_N>": <PROPERTY_VALUE_N> }'
Example request
curl -X POST https://kanbanflow.com/api/v1/tasks/T3s6UGyzY/comments/C3VJU6yeb -H "Content-type: application/json"
 -d '{ "text": "Lorem ipsum dolor sit amet" }'
Valid properties
Property	Type	Comment
text	String	The comment text.
authorUserId	String	The ID of the comment author. See Get users tab for information about how to get a user's ID.
createdTimestamp	String	The UTC timestamp for when the comment was created, for example 2023-12-31T00:00.000Z.
updatedTimestamp	String	Defaults to the current time. The UTC timestamp for when the comment was created, for example 2023-12-31T00:00.000Z.