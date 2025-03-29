
export interface Sector {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}
export interface CreateSector {
    name: string;
}
export interface UpdateSector {
    name: string;
}
export interface DeleteSector {
    id: number;
}