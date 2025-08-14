export interface Column {
    name: string;
    uniqueId: string;
}

export interface Swimlane {
    name: string;
    uniqueId: string;
}

export interface ColorConfig {
    name: string;
    value: string;
    description?: string;
}

export interface Board {
    _id: string;
    name: string;
    columns: Column[];
    swimlanes?: Swimlane[];
    colors?: ColorConfig[];
}

export interface CreateTaskRequest {
    name: string;
    columnId: string;
    swimlaneId?: string;
    position?: string | number;
    color?: 'yellow' | 'white' | 'red' | 'green' | 'blue' | 'purple' | 'orange' | 'cyan' | 'brown' | 'magenta';
    description?: string;
    totalSecondsEstimate?: number;
    pointsEstimate?: number;
}

export interface CreateTaskResponse {
    taskId: string;
}

export interface UpdateTaskRequest {
    name?: string;
    columnId?: string;
    description?: string;
    color?: 'yellow' | 'white' | 'red' | 'green' | 'blue' | 'purple' | 'orange' | 'cyan' | 'brown' | 'magenta';
    position?: string | number;
    responsibleUserId?: string;
    totalSecondsEstimate?: number;
    pointsEstimate?: number;
}

export interface AddSubtaskRequest {
    name: string;
    finished?: boolean;
    userId?: string;
    dueDateTimestamp?: string;
    dueDateTimestampLocal?: string;
}

export interface AddSubtaskResponse {
    insertIndex: number;
}

export interface UpdateSubtaskRequest {
    name?: string;
    finished?: boolean;
    userId?: string;
    dueDateTimestamp?: string;
    dueDateTimestampLocal?: string;
}

export interface AddLabelRequest {
    name: string;
    pinned?: boolean;
}

export interface AddLabelResponse {
    insertIndex: number;
}

export interface UpdateLabelRequest {
    name?: string;
    pinned?: boolean;
}

export interface SetTaskDueDateRequest {
    dueTimestamp: string;
    targetColumnId: string;
    dueTimestampLocal?: string;
    dateType?: string;
    status?: string;
}

export interface UpdateCustomFieldRequest {
    value: {
        text?: string;
        number?: number;
    };
}

export interface AddCommentRequest {
    text: string;
    authorUserId?: string;
    createdTimestamp?: string;
}

export interface AddCommentResponse {
    taskCommentId: string;
}

export interface UpdateCommentRequest {
    text?: string;
    authorUserId?: string;
    createdTimestamp?: string;
    updatedTimestamp?: string;
}

export interface AddSubtasksRequest {
    subtasks: {
        name: string;
        finished?: boolean;
        userId?: string;
        dueDateTimestamp?: string;
        dueDateTimestampLocal?: string;
    }[];
}

export interface AddSubtasksResponse {
    addedSubtasks: {
        name: string;
        insertIndex: number;
    }[];
    totalAdded: number;
}

export interface CreateTaskWithSubtasksRequest {
    name: string;
    columnId: string;
    description?: string;
    color?: 'yellow' | 'white' | 'red' | 'green' | 'blue' | 'purple' | 'orange' | 'cyan' | 'brown' | 'magenta';
    position?: string | number;
    subtasks: {
        name: string;
        finished?: boolean;
        userId?: string;
        dueDateTimestamp?: string;
        dueDateTimestampLocal?: string;
    }[];
}

export interface CreateTaskWithSubtasksResponse {
    taskId: string;
    taskName: string;
    addedSubtasks: {
        name: string;
        insertIndex: number;
    }[];
    totalSubtasks: number;
}

export interface KanbanError {
    message: string;
    status?: number;
    details?: unknown;
}

export interface KanbanTask {
    _id: string;
    name: string;
    columnId: string;
    swimlaneId?: string;
    position?: number;
    description?: string;
    color?: string;
    number?: {
        prefix?: string;
        value: number;
    };
    responsibleUserId?: string;
    totalSecondsSpent?: number;
    totalSecondsEstimate?: number;
    pointsEstimate?: number;
    groupingDate?: string;
    dates?: any[];
    subTasks?: any[];
    labels?: any[];
    collaborators?: any[];
    customFields?: any[];
}

export interface KanbanColumnTasksResponse {
    columnId: string;
    columnName: string;
    tasksLimited: boolean;
    tasks: KanbanTask[];
}

export interface KanbanAllTasksResponse {
    columnId: string;
    columnName: string;
    tasksLimited: boolean;
    tasks: KanbanTask[];
} 