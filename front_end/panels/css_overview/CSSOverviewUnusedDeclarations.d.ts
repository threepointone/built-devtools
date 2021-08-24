export interface UnusedDeclaration {
    declaration: string;
    nodeId: number;
}
export declare class CSSOverviewUnusedDeclarations {
    private static add;
    static checkForUnusedPositionValues(unusedDeclarations: Map<string, UnusedDeclaration[]>, nodeId: number, strings: string[], positionIdx: number, topIdx: number, leftIdx: number, rightIdx: number, bottomIdx: number): void;
    static checkForUnusedWidthAndHeightValues(unusedDeclarations: Map<string, UnusedDeclaration[]>, nodeId: number, strings: string[], displayIdx: number, widthIdx: number, heightIdx: number): void;
    static checkForInvalidVerticalAlignment(unusedDeclarations: Map<string, UnusedDeclaration[]>, nodeId: number, strings: string[], displayIdx: number, verticalAlignIdx: number): void;
}
