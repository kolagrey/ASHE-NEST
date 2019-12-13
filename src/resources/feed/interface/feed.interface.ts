export interface IFeed {
    _id?: string;
    coverPhoto: string;
    title: string;
    body: string;
    tag?: [string];
}

export interface IFeedUpdate {
    title: string;
    body: string;
    tag?: [string];
}

export interface IFeedResponse {
    result?: any;
    success?: boolean;
    message?: string;
}
