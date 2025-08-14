// Environment variables are provided by MCP client (Cursor)
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { KanbanService } from "./kanbanflow/kanban-service.js";
import { Board, Column } from "./kanbanflow/types.js";

const kanbanService = new KanbanService();

// Create server instance
const server = new McpServer({
    name: "kanban-flow",
    version: "1.0.0",
});

// Helper function to format board response
function formatBoard(board: Board) {
    return {
        name: board.name,
        columns: board.columns.map((col: Column) => ({
            name: col.name,
            id: col.uniqueId,
        })),
    };
}

// Register Kanban Flow tools

server.tool(
    "get-board",
    "Get Kanban board structure",
    {},
    async () => {
        try {
            const board = await kanbanService.getBoard();
            const formattedBoard = formatBoard(board);

            return {
                content: [
                    {
                        type: "text",
                        text: `Board: ${formattedBoard.name}\n\nColumns:\n${formattedBoard.columns
                            .map((col) => `- ${col.name} (ID: ${col.id})`)
                            .join("\n")}`,
                    },
                ],
            };
        } catch (error: any) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Failed to get board: ${error.message}`,
                    },
                ],
            };
        }
    }
);

server.tool(
    "create-task",
    "Create a new task on the board",
    {
        name: z.string().describe("Name of the task"),
        columnId: z.string().describe("ID of the column to create the task in"),
        description: z.string().optional().describe("Optional task description"),
    },
    async ({ name, columnId, description }) => {
        try {
            const task = await kanbanService.createTask({
                name,
                columnId,
                description,
            });

            return {
                content: [
                    {
                        type: "text",
                        text: `Successfully created task!\nTask ID: ${task.taskId}`,
                    },
                ],
            };
        } catch (error: any) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Failed to create task: ${error.message}`,
                    },
                ],
            };
        }
    }
);

server.tool(
    "get-tasks",
    "Get all tasks in a column",
    {
        columnId: z.string().describe("ID of the column to get tasks from"),
    },
    async ({ columnId }) => {
        try {
            const tasks = await kanbanService.getTasksByColumnId(columnId);

            const formattedTasks = tasks.map(task => 
                `- ${task.name}${task.description ? ` (${task.description})` : ''} [ID: ${task._id}]`
            ).join('\n');

            return {
                content: [
                    {
                        type: "text",
                        text: tasks.length > 0 
                            ? `Tasks in column:\n${formattedTasks}`
                            : "No tasks found in this column",
                    },
                ],
            };
        } catch (error: any) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Failed to get tasks: ${error.message}`,
                    },
                ],
            };
        }
    }
);

server.tool(
    "get-task-details",
    "Get detailed information about a specific task by its ID",
    {
        taskId: z.string().describe("ID of the task to get details for"),
        includePosition: z.boolean().optional().describe("Whether to include task position in column"),
    },
    async ({ taskId, includePosition }) => {
        try {
            const task = await kanbanService.getTaskDetails(taskId, includePosition);

            // Format task details for display
            let formattedDetails = `Task Details:\n`;
            formattedDetails += `- ID: ${task._id}\n`;
            formattedDetails += `- Name: ${task.name}\n`;
            formattedDetails += `- Column ID: ${task.columnId}\n`;
            
            if (task.description) formattedDetails += `- Description: ${task.description}\n`;
            if (task.color) formattedDetails += `- Color: ${task.color}\n`;
            if (task.position) formattedDetails += `- Position: ${task.position}\n`;
            if (task.number) formattedDetails += `- Number: ${task.number.prefix || ''}${task.number.value}\n`;
            if (task.responsibleUserId) formattedDetails += `- Responsible User: ${task.responsibleUserId}\n`;
            if (task.totalSecondsSpent) formattedDetails += `- Time Spent: ${task.totalSecondsSpent} seconds\n`;
            if (task.totalSecondsEstimate) formattedDetails += `- Time Estimate: ${task.totalSecondsEstimate} seconds\n`;
            if (task.pointsEstimate) formattedDetails += `- Points Estimate: ${task.pointsEstimate}\n`;
            if (task.groupingDate) formattedDetails += `- Grouping Date: ${task.groupingDate}\n`;
            
            if (task.subTasks && task.subTasks.length > 0) {
                formattedDetails += `- Subtasks (${task.subTasks.length}):\n`;
                task.subTasks.forEach((subtask: any, index: number) => {
                    formattedDetails += `  ${index + 1}. ${subtask.name || 'Unnamed subtask'}\n`;
                });
            }
            
            if (task.labels && task.labels.length > 0) {
                formattedDetails += `- Labels: ${task.labels.map((label: any) => label.name).join(', ')}\n`;
            }
            
            if (task.dates && task.dates.length > 0) {
                formattedDetails += `- Dates: ${task.dates.length} date(s) set\n`;
            }

            return {
                content: [
                    {
                        type: "text",
                        text: formattedDetails,
                    },
                ],
            };
        } catch (error: any) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Failed to get task details: ${error.message}`,
                    },
                ],
            };
        }
    }
);

server.tool(
    "update-task",
    "Update properties of an existing task",
    {
        taskId: z.string().describe("ID of the task to update"),
        name: z.string().optional().describe("New task name"),
        columnId: z.string().optional().describe("ID of the column to move the task to"),
        description: z.string().optional().describe("New task description"),
        color: z.enum(['yellow', 'white', 'red', 'green', 'blue', 'purple', 'orange', 'cyan', 'brown', 'magenta']).optional().describe("New task color"),
        position: z.union([z.string(), z.number()]).optional().describe("New position (number, 'top', or 'bottom')"),
        responsibleUserId: z.string().optional().describe("ID of the user responsible for the task"),
        totalSecondsEstimate: z.number().optional().describe("Estimated time in seconds"),
        pointsEstimate: z.number().optional().describe("Points estimate for the task"),
    },
    async ({ taskId, name, columnId, description, color, position, responsibleUserId, totalSecondsEstimate, pointsEstimate }) => {
        try {
            // Build update object with only provided properties
            const updates: any = {};
            if (name !== undefined) updates.name = name;
            if (columnId !== undefined) updates.columnId = columnId;
            if (description !== undefined) updates.description = description;
            if (color !== undefined) updates.color = color;
            if (position !== undefined) updates.position = position;
            if (responsibleUserId !== undefined) updates.responsibleUserId = responsibleUserId;
            if (totalSecondsEstimate !== undefined) updates.totalSecondsEstimate = totalSecondsEstimate;
            if (pointsEstimate !== undefined) updates.pointsEstimate = pointsEstimate;

            await kanbanService.updateTask(taskId, updates);

            // Fetch the updated task to return current state
            const updatedTask = await kanbanService.getTaskDetails(taskId);

            // Format response
            let response = `Successfully updated task!\n`;
            response += `- ID: ${updatedTask._id}\n`;
            response += `- Name: ${updatedTask.name}\n`;
            response += `- Column ID: ${updatedTask.columnId}\n`;
            
            if (updatedTask.description) response += `- Description: ${updatedTask.description}\n`;
            if (updatedTask.color) response += `- Color: ${updatedTask.color}\n`;
            if (updatedTask.position) response += `- Position: ${updatedTask.position}\n`;
            if (updatedTask.groupingDate) response += `- Grouping Date: ${updatedTask.groupingDate}\n`;

            return {
                content: [
                    {
                        type: "text",
                        text: response,
                    },
                ],
            };
        } catch (error: any) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Failed to update task: ${error.message}`,
                    },
                ],
            };
        }
    }
);

server.tool(
    "get-all-tasks",
    "Get all tasks from all columns on the board",
    {},
    async () => {
        try {
            const allTasksResponse = await kanbanService.getAllTasks();

            // Format the response to show tasks organized by column
            let formattedResponse = "All Tasks by Column:\n\n";
            
            for (const column of allTasksResponse) {
                formattedResponse += `📂 **${column.columnName}** (${column.tasks.length} tasks):\n`;
                
                if (column.tasks.length === 0) {
                    formattedResponse += "   - No tasks in this column\n";
                } else {
                    column.tasks.forEach((task, index) => {
                        formattedResponse += `   ${index + 1}. ${task.name}`;
                        if (task.color) formattedResponse += ` [${task.color.toUpperCase()}]`;
                        if (task.description) formattedResponse += ` - ${task.description.substring(0, 100)}${task.description.length > 100 ? '...' : ''}`;
                        formattedResponse += ` [ID: ${task._id}]\n`;
                    });
                }
                
                if (column.tasksLimited) {
                    formattedResponse += "   ⚠️ This column has more tasks (limited to 20)\n";
                }
                
                formattedResponse += "\n";
            }

            return {
                content: [
                    {
                        type: "text",
                        text: formattedResponse,
                    },
                ],
            };
        } catch (error: any) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Failed to get all tasks: ${error.message}`,
                    },
                ],
            };
        }
    }
);

server.tool(
    "add-subtask",
    "Add a subtask to an existing task",
    {
        taskId: z.string().describe("ID of the task to add a subtask to"),
        name: z.string().describe("Name of the subtask"),
        finished: z.boolean().optional().describe("Whether the subtask is completed (default: false)"),
        userId: z.string().optional().describe("ID of the user to assign the subtask to"),
        dueDateTimestamp: z.string().optional().describe("UTC timestamp when subtask is due (format: '2023-03-01T12:00:00Z')"),
        dueDateTimestampLocal: z.string().optional().describe("Local timestamp when subtask is due"),
    },
    async ({ taskId, name, finished, userId, dueDateTimestamp, dueDateTimestampLocal }) => {
        try {
            // Build subtask object with only provided properties
            const subtask: any = { name };
            if (finished !== undefined) subtask.finished = finished;
            if (userId !== undefined) subtask.userId = userId;
            if (dueDateTimestamp !== undefined) subtask.dueDateTimestamp = dueDateTimestamp;
            if (dueDateTimestampLocal !== undefined) subtask.dueDateTimestampLocal = dueDateTimestampLocal;

            const result = await kanbanService.addSubtask(taskId, subtask);

            // Get updated task details to show the result
            const updatedTask = await kanbanService.getTaskDetails(taskId);

            // Format response
            let response = `Successfully added subtask!\n`;
            response += `- Subtask name: ${name}\n`;
            response += `- Inserted at position: ${result.insertIndex}\n`;
            response += `- Task: ${updatedTask.name}\n`;
            
            if (updatedTask.subTasks && updatedTask.subTasks.length > 0) {
                response += `\nCurrent subtasks (${updatedTask.subTasks.length}):\n`;
                updatedTask.subTasks.forEach((subtask: any, index: number) => {
                    const status = subtask.finished ? '✅' : '⬜';
                    response += `  ${index + 1}. ${status} ${subtask.name || 'Unnamed subtask'}`;
                    if (subtask.userId) response += ` (assigned to: ${subtask.userId})`;
                    if (subtask.dueDateTimestamp) response += ` (due: ${subtask.dueDateTimestamp})`;
                    response += `\n`;
                });
            }

            return {
                content: [
                    {
                        type: "text",
                        text: response,
                    },
                ],
            };
        } catch (error: any) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Failed to add subtask: ${error.message}`,
                    },
                ],
            };
        }
    }
);

server.tool(
    "update-subtask-by-position",
    "Update a subtask by its position in the subtask list",
    {
        taskId: z.string().describe("ID of the task containing the subtask"),
        index: z.number().describe("0-based position of the subtask to update"),
        name: z.string().optional().describe("New subtask name"),
        finished: z.boolean().optional().describe("Whether the subtask is completed"),
        userId: z.string().optional().describe("ID of the user to assign the subtask to (use null to clear)"),
        dueDateTimestamp: z.string().optional().describe("UTC timestamp when subtask is due (use null to clear)"),
        dueDateTimestampLocal: z.string().optional().describe("Local timestamp when subtask is due (use null to clear)"),
    },
    async ({ taskId, index, name, finished, userId, dueDateTimestamp, dueDateTimestampLocal }) => {
        try {
            // Build update object with only provided properties
            const updates: any = {};
            if (name !== undefined) updates.name = name;
            if (finished !== undefined) updates.finished = finished;
            if (userId !== undefined) updates.userId = userId;
            if (dueDateTimestamp !== undefined) updates.dueDateTimestamp = dueDateTimestamp;
            if (dueDateTimestampLocal !== undefined) updates.dueDateTimestampLocal = dueDateTimestampLocal;

            await kanbanService.updateSubtaskByPosition(taskId, index, updates);

            // Get updated task details to show the result
            const updatedTask = await kanbanService.getTaskDetails(taskId);

            // Format response
            let response = `Successfully updated subtask at position ${index}!\n`;
            response += `- Task: ${updatedTask.name}\n`;
            
            if (updatedTask.subTasks && updatedTask.subTasks.length > 0) {
                response += `\nCurrent subtasks (${updatedTask.subTasks.length}):\n`;
                updatedTask.subTasks.forEach((subtask: any, idx: number) => {
                    const status = subtask.finished ? '✅' : '⬜';
                    const highlight = idx === index ? ' ← UPDATED' : '';
                    response += `  ${idx + 1}. ${status} ${subtask.name || 'Unnamed subtask'}`;
                    if (subtask.userId) response += ` (assigned to: ${subtask.userId})`;
                    if (subtask.dueDateTimestamp) response += ` (due: ${subtask.dueDateTimestamp})`;
                    response += `${highlight}\n`;
                });
            } else {
                response += `\nNo subtasks found in this task.`;
            }

            return {
                content: [
                    {
                        type: "text",
                        text: response,
                    },
                ],
            };
        } catch (error: any) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Failed to update subtask: ${error.message}`,
                    },
                ],
            };
        }
    }
);

server.tool(
    "add-label",
    "Add a label to an existing task",
    {
        taskId: z.string().describe("ID of the task to add a label to"),
        name: z.string().describe("Name of the label"),
        pinned: z.boolean().optional().describe("Whether the label should be pinned (default: false)"),
    },
    async ({ taskId, name, pinned }) => {
        try {
            const label: any = { name };
            if (pinned !== undefined) label.pinned = pinned;

            const result = await kanbanService.addLabel(taskId, label);
            const updatedTask = await kanbanService.getTaskDetails(taskId);

            let response = `Successfully added label!\n`;
            response += `- Label name: ${name}\n`;
            response += `- Pinned: ${pinned || false}\n`;
            response += `- Inserted at position: ${result.insertIndex}\n`;
            response += `- Task: ${updatedTask.name}\n`;
            
            if (updatedTask.labels && updatedTask.labels.length > 0) {
                response += `\nCurrent labels (${updatedTask.labels.length}):\n`;
                updatedTask.labels.forEach((label: any, index: number) => {
                    const pinnedStatus = label.pinned ? '📌' : '🏷️';
                    response += `  ${index + 1}. ${pinnedStatus} ${label.name}\n`;
                });
            }

            return {
                content: [{ type: "text", text: response }],
            };
        } catch (error: any) {
            return {
                content: [{ type: "text", text: `Failed to add label: ${error.message}` }],
            };
        }
    }
);

server.tool(
    "update-label",
    "Update an existing label on a task by finding it by name",
    {
        taskId: z.string().describe("ID of the task containing the label"),
        labelName: z.string().describe("Current name of the label (case-sensitive)"),
        name: z.string().optional().describe("New label name"),
        pinned: z.boolean().optional().describe("Whether the label should be pinned"),
    },
    async ({ taskId, labelName, name, pinned }) => {
        try {
            const updates: any = {};
            if (name !== undefined) updates.name = name;
            if (pinned !== undefined) updates.pinned = pinned;

            await kanbanService.updateLabel(taskId, labelName, updates);
            const updatedTask = await kanbanService.getTaskDetails(taskId);

            let response = `Successfully updated label!\n`;
            response += `- Original label: ${labelName}\n`;
            if (name) response += `- New name: ${name}\n`;
            if (pinned !== undefined) response += `- Pinned: ${pinned}\n`;
            response += `- Task: ${updatedTask.name}\n`;
            
            if (updatedTask.labels && updatedTask.labels.length > 0) {
                response += `\nCurrent labels (${updatedTask.labels.length}):\n`;
                updatedTask.labels.forEach((label: any, index: number) => {
                    const pinnedStatus = label.pinned ? '📌' : '🏷️';
                    response += `  ${index + 1}. ${pinnedStatus} ${label.name}\n`;
                });
            }

            return {
                content: [{ type: "text", text: response }],
            };
        } catch (error: any) {
            return {
                content: [{ type: "text", text: `Failed to update label: ${error.message}` }],
            };
        }
    }
);

server.tool(
    "set-task-due-date",
    "Set or update a due date for a task",
    {
        taskId: z.string().describe("ID of the task to set due date for"),
        dueTimestamp: z.string().describe("UTC timestamp when task is due (format: '2023-03-01T12:00:00Z')"),
        targetColumnId: z.string().describe("ID of column task should reach before due"),
        dueTimestampLocal: z.string().optional().describe("Local timestamp (defaults to dueTimestamp)"),
        dateType: z.string().optional().describe("Type of date (default: 'dueDate')"),
        status: z.string().optional().describe("Status: 'active' or 'done' (default: 'active')"),
    },
    async ({ taskId, dueTimestamp, targetColumnId, dueTimestampLocal, dateType, status }) => {
        try {
            const dateInfo: any = { dueTimestamp, targetColumnId };
            if (dueTimestampLocal) dateInfo.dueTimestampLocal = dueTimestampLocal;
            if (dateType) dateInfo.dateType = dateType;
            if (status) dateInfo.status = status;

            await kanbanService.setTaskDueDate(taskId, dateInfo);
            const updatedTask = await kanbanService.getTaskDetails(taskId);

            let response = `Successfully set due date!\n`;
            response += `- Task: ${updatedTask.name}\n`;
            response += `- Due: ${dueTimestamp}\n`;
            response += `- Target column: ${targetColumnId}\n`;
            response += `- Status: ${status || 'active'}\n`;
            
            if (updatedTask.dates && updatedTask.dates.length > 0) {
                response += `\nCurrent dates (${updatedTask.dates.length}):\n`;
                updatedTask.dates.forEach((date: any, index: number) => {
                    response += `  ${index + 1}. ${date.dateType || 'date'}: ${date.dueTimestamp || 'not set'}\n`;
                });
            }

            return {
                content: [{ type: "text", text: response }],
            };
        } catch (error: any) {
            return {
                content: [{ type: "text", text: `Failed to set due date: ${error.message}` }],
            };
        }
    }
);

server.tool(
    "update-custom-field",
    "Set or update a custom field value on a task",
    {
        taskId: z.string().describe("ID of the task to update"),
        customFieldId: z.string().describe("ID of the custom field"),
        textValue: z.string().optional().describe("Text value for text/dropdown fields"),
        numberValue: z.number().optional().describe("Number value for number fields"),
    },
    async ({ taskId, customFieldId, textValue, numberValue }) => {
        try {
            const value: any = {};
            if (textValue !== undefined) value.text = textValue;
            if (numberValue !== undefined) value.number = numberValue;

            await kanbanService.updateCustomField(taskId, customFieldId, { value });
            const updatedTask = await kanbanService.getTaskDetails(taskId);

            let response = `Successfully updated custom field!\n`;
            response += `- Task: ${updatedTask.name}\n`;
            response += `- Custom field ID: ${customFieldId}\n`;
            if (textValue) response += `- Text value: ${textValue}\n`;
            if (numberValue) response += `- Number value: ${numberValue}\n`;
            
            if (updatedTask.customFields && updatedTask.customFields.length > 0) {
                response += `\nCurrent custom fields (${updatedTask.customFields.length}):\n`;
                updatedTask.customFields.forEach((field: any, index: number) => {
                    response += `  ${index + 1}. Field: ${field.name || field.id || 'unnamed'}\n`;
                });
            }

            return {
                content: [{ type: "text", text: response }],
            };
        } catch (error: any) {
            return {
                content: [{ type: "text", text: `Failed to update custom field: ${error.message}` }],
            };
        }
    }
);

server.tool(
    "add-comment",
    "Add a comment to an existing task",
    {
        taskId: z.string().describe("ID of the task to add a comment to"),
        text: z.string().describe("The comment text"),
        authorUserId: z.string().optional().describe("ID of the comment author (defaults to API user)"),
        createdTimestamp: z.string().optional().describe("UTC timestamp when comment was created (defaults to now)"),
    },
    async ({ taskId, text, authorUserId, createdTimestamp }) => {
        try {
            const comment: any = { text };
            if (authorUserId !== undefined) comment.authorUserId = authorUserId;
            if (createdTimestamp !== undefined) comment.createdTimestamp = createdTimestamp;

            const result = await kanbanService.addComment(taskId, comment);
            const updatedTask = await kanbanService.getTaskDetails(taskId);

            let response = `Successfully added comment!\n`;
            response += `- Comment ID: ${result.taskCommentId}\n`;
            response += `- Text: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}\n`;
            response += `- Task: ${updatedTask.name}\n`;
            if (authorUserId) response += `- Author: ${authorUserId}\n`;

            return {
                content: [{ type: "text", text: response }],
            };
        } catch (error: any) {
            return {
                content: [{ type: "text", text: `Failed to add comment: ${error.message}` }],
            };
        }
    }
);

server.tool(
    "update-comment",
    "Update an existing comment on a task",
    {
        taskId: z.string().describe("ID of the task containing the comment"),
        commentId: z.string().describe("ID of the comment to update"),
        text: z.string().optional().describe("New comment text"),
        authorUserId: z.string().optional().describe("Comment author ID"),
        createdTimestamp: z.string().optional().describe("UTC creation timestamp"),
        updatedTimestamp: z.string().optional().describe("UTC update timestamp (defaults to current time)"),
    },
    async ({ taskId, commentId, text, authorUserId, createdTimestamp, updatedTimestamp }) => {
        try {
            const updates: any = {};
            if (text !== undefined) updates.text = text;
            if (authorUserId !== undefined) updates.authorUserId = authorUserId;
            if (createdTimestamp !== undefined) updates.createdTimestamp = createdTimestamp;
            if (updatedTimestamp !== undefined) updates.updatedTimestamp = updatedTimestamp;

            await kanbanService.updateComment(taskId, commentId, updates);
            const updatedTask = await kanbanService.getTaskDetails(taskId);

            let response = `Successfully updated comment!\n`;
            response += `- Task: ${updatedTask.name}\n`;
            response += `- Comment ID: ${commentId}\n`;
            if (text) response += `- New text: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}\n`;
            if (authorUserId) response += `- Author: ${authorUserId}\n`;

            return {
                content: [{ type: "text", text: response }],
            };
        } catch (error: any) {
            return {
                content: [{ type: "text", text: `Failed to update comment: ${error.message}` }],
            };
        }
    }
);

server.tool(
    "add-subtasks",
    "Add multiple subtasks to an existing task in one operation",
    {
        taskId: z.string().describe("ID of the task to add subtasks to"),
        subtasks: z.array(z.object({
            name: z.string().describe("Name of the subtask"),
            finished: z.boolean().optional().describe("Whether the subtask is completed (default: false)"),
            userId: z.string().optional().describe("ID of the user to assign the subtask to"),
            dueDateTimestamp: z.string().optional().describe("UTC timestamp when subtask is due"),
            dueDateTimestampLocal: z.string().optional().describe("Local timestamp when subtask is due"),
        })).describe("Array of subtasks to add"),
    },
    async ({ taskId, subtasks }) => {
        try {
            const result = await kanbanService.addMultipleSubtasks(taskId, { subtasks });
            const updatedTask = await kanbanService.getTaskDetails(taskId);

            let response = `Successfully added ${result.totalAdded} subtasks!\n`;
            response += `- Task: ${updatedTask.name}\n`;
            response += `- Total subtasks added: ${result.totalAdded}\n\n`;
            
            result.addedSubtasks.forEach((subtask, index) => {
                response += `${index + 1}. "${subtask.name}" (position: ${subtask.insertIndex})\n`;
            });

            if (updatedTask.subTasks && updatedTask.subTasks.length > 0) {
                response += `\nAll current subtasks (${updatedTask.subTasks.length}):\n`;
                updatedTask.subTasks.forEach((subtask: any, index: number) => {
                    const status = subtask.finished ? '✅' : '⬜';
                    response += `  ${index + 1}. ${status} ${subtask.name || 'Unnamed subtask'}\n`;
                });
            }

            return {
                content: [{ type: "text", text: response }],
            };
        } catch (error: any) {
            return {
                content: [{ type: "text", text: `Failed to add subtasks: ${error.message}` }],
            };
        }
    }
);

server.tool(
    "create-task-with-subtasks",
    "Create a new task and add multiple subtasks to it in one operation",
    {
        name: z.string().describe("Name of the task"),
        columnId: z.string().describe("ID of the column to create the task in"),
        description: z.string().optional().describe("Optional task description"),
        color: z.enum(['yellow', 'white', 'red', 'green', 'blue', 'purple', 'orange', 'cyan', 'brown', 'magenta']).optional().describe("Task color"),
        position: z.union([z.string(), z.number()]).optional().describe("Task position (number, 'top', or 'bottom')"),
        subtasks: z.array(z.object({
            name: z.string().describe("Name of the subtask"),
            finished: z.boolean().optional().describe("Whether the subtask is completed (default: false)"),
            userId: z.string().optional().describe("ID of the user to assign the subtask to"),
            dueDateTimestamp: z.string().optional().describe("UTC timestamp when subtask is due"),
            dueDateTimestampLocal: z.string().optional().describe("Local timestamp when subtask is due"),
        })).describe("Array of subtasks to add to the new task"),
    },
    async ({ name, columnId, description, color, position, subtasks }) => {
        try {
            const result = await kanbanService.createTaskWithSubtasks({
                name,
                columnId,
                description,
                color,
                position,
                subtasks
            });
            
            const createdTask = await kanbanService.getTaskDetails(result.taskId);

            let response = `Successfully created task with ${result.totalSubtasks} subtasks!\n`;
            response += `- Task ID: ${result.taskId}\n`;
            response += `- Task Name: ${result.taskName}\n`;
            response += `- Column ID: ${columnId}\n`;
            if (description) response += `- Description: ${description}\n`;
            if (color) response += `- Color: ${color}\n`;
            response += `- Total subtasks: ${result.totalSubtasks}\n\n`;
            
            response += `Added subtasks:\n`;
            result.addedSubtasks.forEach((subtask, index) => {
                response += `${index + 1}. "${subtask.name}" (position: ${subtask.insertIndex})\n`;
            });

            if (createdTask.subTasks && createdTask.subTasks.length > 0) {
                response += `\nCurrent subtasks status:\n`;
                createdTask.subTasks.forEach((subtask: any, index: number) => {
                    const status = subtask.finished ? '✅' : '⬜';
                    response += `  ${index + 1}. ${status} ${subtask.name || 'Unnamed subtask'}\n`;
                });
            }

            return {
                content: [{ type: "text", text: response }],
            };
        } catch (error: any) {
            return {
                content: [{ type: "text", text: `Failed to create task with subtasks: ${error.message}` }],
            };
        }
    }
);

// Tools registered

// Start the server with stdio transport
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    // Kanban Flow MCP Server ready for stdio communication
}

main().catch((error) => {
    console.error("[MCP Server] Fatal error in main():", error);
    process.exit(1);
});