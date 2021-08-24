import { Cookie } from './Cookie.js';
export declare class CookieParser {
    private readonly domain;
    private cookiesInternal;
    private input;
    private originalInputLength;
    private lastCookie?;
    private lastCookieLine?;
    private lastCookiePosition?;
    constructor(domain?: string);
    static parseSetCookie(header: string | undefined, domain?: string): Cookie[] | null;
    cookies(): Cookie[];
    parseSetCookie(setCookieHeader: string | undefined): Cookie[] | null;
    private initialize;
    private flushCookie;
    private extractKeyValue;
    private advanceAndCheckCookieDelimiter;
    private addCookie;
}
