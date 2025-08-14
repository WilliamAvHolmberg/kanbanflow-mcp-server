import { KanbanClient } from './kanban-client.js';
import { KANBAN_CONFIG } from './config.js';
import { Board, CreateTaskRequest, CreateTaskResponse, KanbanColumnTasksResponse, KanbanTask, UpdateTaskRequest, KanbanAllTasksResponse, AddSubtaskRequest, AddSubtaskResponse, UpdateSubtaskRequest, AddLabelRequest, AddLabelResponse, UpdateLabelRequest, SetTaskDueDateRequest, UpdateCustomFieldRequest, AddCommentRequest, AddCommentResponse, UpdateCommentRequest, AddSubtasksRequest, AddSubtasksResponse, CreateTaskWithSubtasksRequest, CreateTaskWithSubtasksResponse } from './types.js';

export class KanbanService {
    private client: KanbanClient;

    constructor() {
        this.client = new KanbanClient();
    }

    async getBoard(): Promise<Board> {
        try {
            const board = await this.client.get<Board>(KANBAN_CONFIG.ENDPOINTS.BOARD);
            return board;
        } catch (error) {
            throw error;
        }
    }

    async createTask(task: CreateTaskRequest): Promise<CreateTaskResponse> {
        try {
            const response = await this.client.post<CreateTaskResponse>(
                KANBAN_CONFIG.ENDPOINTS.TASKS,
                task
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async getTasksByColumnId(columnId: string): Promise<KanbanTask[]> {
        try {
            const response = await this.client.get<KanbanColumnTasksResponse[]>(
                `${KANBAN_CONFIG.ENDPOINTS.TASKS}?columnId=${columnId}`
            );
            if (response.length === 0) {
                return [];
            }
            const columnTasks = response[0];
            return columnTasks.tasks;
        } catch (error) {
            throw error;
        }
    }

    async getTaskDetails(taskId: string, includePosition?: boolean): Promise<KanbanTask> {
        try {
            let endpoint = `${KANBAN_CONFIG.ENDPOINTS.TASKS}/${taskId}`;
            if (includePosition) {
                endpoint += '?includePosition=true';
            }
            const task = await this.client.get<KanbanTask>(endpoint);
            return task;
        } catch (error) {
            throw error;
        }
    }

    async updateTask(taskId: string, updates: UpdateTaskRequest): Promise<KanbanTask> {
        try {
            const task = await this.client.post<KanbanTask>(
                `${KANBAN_CONFIG.ENDPOINTS.TASKS}/${taskId}`,
                updates
            );
            return task;
        } catch (error) {
            throw error;
        }
    }

    async getAllTasks(): Promise<KanbanAllTasksResponse[]> {
        try {
            const response = await this.client.get<KanbanAllTasksResponse[]>(
                KANBAN_CONFIG.ENDPOINTS.TASKS
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async addSubtask(taskId: string, subtask: AddSubtaskRequest): Promise<AddSubtaskResponse> {
        try {
            const response = await this.client.post<AddSubtaskResponse>(
                `${KANBAN_CONFIG.ENDPOINTS.TASKS}/${taskId}/subtasks`,
                subtask
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async updateSubtaskByPosition(taskId: string, index: number, updates: UpdateSubtaskRequest): Promise<void> {
        try {
            await this.client.post<void>(
                `${KANBAN_CONFIG.ENDPOINTS.TASKS}/${taskId}/subtasks/by-index/${index}`,
                updates
            );
        } catch (error) {
            throw error;
        }
    }

    async addLabel(taskId: string, label: AddLabelRequest): Promise<AddLabelResponse> {
        try {
            const response = await this.client.post<AddLabelResponse>(
                `${KANBAN_CONFIG.ENDPOINTS.TASKS}/${taskId}/labels`,
                label
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async updateLabel(taskId: string, labelName: string, updates: UpdateLabelRequest): Promise<void> {
        try {
            await this.client.post<void>(
                `${KANBAN_CONFIG.ENDPOINTS.TASKS}/${taskId}/labels/by-name/${encodeURIComponent(labelName)}`,
                updates
            );
        } catch (error) {
            throw error;
        }
    }

    async setTaskDueDate(taskId: string, dateInfo: SetTaskDueDateRequest): Promise<void> {
        try {
            await this.client.post<void>(
                `${KANBAN_CONFIG.ENDPOINTS.TASKS}/${taskId}/dates`,
                dateInfo
            );
        } catch (error) {
            throw error;
        }
    }

    async updateCustomField(taskId: string, customFieldId: string, fieldValue: UpdateCustomFieldRequest): Promise<void> {
        try {
            await this.client.post<void>(
                `${KANBAN_CONFIG.ENDPOINTS.TASKS}/${taskId}/custom-fields/${customFieldId}`,
                fieldValue
            );
        } catch (error) {
            throw error;
        }
    }

    async addComment(taskId: string, comment: AddCommentRequest): Promise<AddCommentResponse> {
        try {
            const response = await this.client.post<AddCommentResponse>(
                `${KANBAN_CONFIG.ENDPOINTS.TASKS}/${taskId}/comments`,
                comment
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    async updateComment(taskId: string, commentId: string, updates: UpdateCommentRequest): Promise<void> {
        try {
            await this.client.post<void>(
                `${KANBAN_CONFIG.ENDPOINTS.TASKS}/${taskId}/comments/${commentId}`,
                updates
            );
        } catch (error) {
            throw error;
        }
    }

    async addMultipleSubtasks(taskId: string, request: AddSubtasksRequest): Promise<AddSubtasksResponse> {
        try {
            const addedSubtasks: { name: string; insertIndex: number; }[] = [];
            for (const subtask of request.subtasks) {
                const response = await this.addSubtask(taskId, subtask);
                addedSubtasks.push({
                    name: subtask.name,
                    insertIndex: response.insertIndex
                });
            }
            return {
                addedSubtasks,
                totalAdded: addedSubtasks.length
            };
        } catch (error) {
            throw error;
        }
    }

    async createTaskWithSubtasks(request: CreateTaskWithSubtasksRequest): Promise<CreateTaskWithSubtasksResponse> {
        try {
            const taskResponse = await this.createTask({
                name: request.name,
                columnId: request.columnId,
                description: request.description,
                color: request.color,
                position: request.position
            });
            const subtasksResponse = await this.addMultipleSubtasks(taskResponse.taskId, {
                subtasks: request.subtasks
            });
            return {
                taskId: taskResponse.taskId,
                taskName: request.name,
                addedSubtasks: subtasksResponse.addedSubtasks,
                totalSubtasks: subtasksResponse.totalAdded
            };
        } catch (error) {
            throw error;
        }
    }
} 