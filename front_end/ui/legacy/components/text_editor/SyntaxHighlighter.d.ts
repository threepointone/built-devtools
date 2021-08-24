export declare class SyntaxHighlighter {
    private readonly mimeType;
    private readonly stripExtraWhitespace;
    constructor(mimeType: string, stripExtraWhitespace: boolean);
    createSpan(content: string, className: string): Element;
    syntaxHighlightNode(node: Element): Promise<void>;
}
