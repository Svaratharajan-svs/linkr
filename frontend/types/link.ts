export interface Link {
    id: string;
    code: string;
    alias?: string | null;
    original_url: string;
    created_by: string;
    created_at: string;
    clicks?: number;

}

export interface CreateLinkRequest {
    original_url: string;
    alias?: string;
}

export interface CreateLinkResponse {
    id: string;
    code: string;
    short_url: string;
    original_url: string;
}

export interface DailyStat {
    date: string;
    count: number;
}

export interface StatsResponse {
    total_clicks: number;
    daily: DailyStat[];
}

export interface PaginatedLinks {

    items:Link[];
    page:number;
    limit:number;
    total?:number;

}