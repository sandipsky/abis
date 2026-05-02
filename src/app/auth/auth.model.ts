export interface Login {
    username: string;
    password: string;
}

export interface IUserSession {
    id: number;
    username: string;
    name: string;
    role_id: number;
    role_name: string;
    master_modules: string[];
    modules: string[];
    operations: string[];
}