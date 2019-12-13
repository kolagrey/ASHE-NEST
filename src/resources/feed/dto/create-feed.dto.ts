export class CreateFeedDto {
    readonly coverPhoto: string;
    readonly title: string;
    readonly body: string;
    readonly tag: [string];
}
