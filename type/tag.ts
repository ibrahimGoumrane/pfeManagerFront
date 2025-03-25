export interface Tag {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface CreateTag {
    name: string;
}

export interface UpdateTag {
    name: string;
}

export interface DeleteTag {
    id: number;
}