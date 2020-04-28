export default interface SlideContent {
    type: string;
    content: {
        title: string;
        body: string[];
        options?: string[];
        validation?: string[];
        controller?: string;
    };
}
