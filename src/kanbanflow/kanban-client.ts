import axios, { 
    AxiosInstance, 
    InternalAxiosRequestConfig,
    AxiosResponse, 
    AxiosError 
} from 'axios';
import { KANBAN_CONFIG, DEFAULT_HEADERS } from './config.js';
import { KanbanError } from './types.js';

export class KanbanClient {
    private client: AxiosInstance;
    private apiToken: string;

    constructor(apiToken: string = KANBAN_CONFIG.API_TOKEN) {
        this.apiToken = apiToken;
        this.client = axios.create({
            baseURL: KANBAN_CONFIG.BASE_URL,
            headers: {
                ...DEFAULT_HEADERS,
                'Authorization': `Basic ${this.getEncodedCredentials()}`
            }
        });

        // Add interceptors
        this.setupLogging();
    }

    private getEncodedCredentials(): string {
        const credentials = `apiToken:${this.apiToken}`;
        return Buffer.from(credentials).toString('base64');
    }

    private setupLogging() {
        this.client.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => config,
            (error: AxiosError) => Promise.reject(error)
        );

        this.client.interceptors.response.use(
            (response: AxiosResponse) => response,
            (error: AxiosError) => Promise.reject(this.formatError(error))
        );
    }

    private formatError(error: AxiosError): KanbanError {
        const errorData = error.response?.data as { message?: string } | undefined;
        return {
            message: errorData?.message || error.message || 'Unknown error occurred',
            status: error.response?.status,
            details: error.response?.data
        };
    }

    async get<T>(endpoint: string): Promise<T> {
        try {
            const response = await this.client.get<T>(endpoint);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async post<T>(endpoint: string, data: any): Promise<T> {
        try {
            const response = await this.client.post<T>(endpoint, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
} 