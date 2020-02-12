export default class PresentationContent {
    title: string;
    body: string;
    constructor(rawContent: any) {
        this.title = rawContent.title;
        this.body = rawContent.body;
    }
}