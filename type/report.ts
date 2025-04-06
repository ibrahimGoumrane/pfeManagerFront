import { Tag } from "./tag";
import { User } from "./users";
export interface Report {
    id: number;
    title: string;
    description: string;
    preview: string;
    url: string; // URL of the report
    validated: boolean;
    user: User;
    created_at: string;
    tags: Tag[];
    updated_at: string;
}

export interface CreateReport {
    title: string;
    description: string;
    preview: FileList;
    url: FileList; // URL of the report
    validated: boolean;
    user: User;
    tags: string[];
}

export interface UpdateReport {
    title?: string;
    description?: string;
    preview?: FileList;
    url?: FileList; // URL of the report
    validated?: boolean;
    user?: User;
}
export interface DeleteReport {
    id: number;
}