export default class PresentationContent {
    readonly title: string;
    readonly body: string;
    readonly hasNext: boolean;
    readonly hasPrevious: boolean;

    constructor(rawContent: any) {
        console.log(rawContent);
        this.title = rawContent?.title ?? 'NO TITLE';
        this.body = rawContent?.body ?? 'NO BODY';
        this.hasNext = rawContent?.hasNext ?? false;
        this.hasPrevious = rawContent?.hasPrevious ?? false;
        console.log(this);
    }
}