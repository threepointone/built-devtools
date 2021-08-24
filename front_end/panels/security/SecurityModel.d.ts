import * as SDK from '../../core/sdk/sdk.js';
import * as Protocol from '../../generated/protocol.js';
export declare class SecurityModel extends SDK.SDKModel.SDKModel {
    private readonly dispatcher;
    private readonly securityAgent;
    constructor(target: SDK.Target.Target);
    resourceTreeModel(): SDK.ResourceTreeModel.ResourceTreeModel;
    networkManager(): SDK.NetworkManager.NetworkManager;
    static SecurityStateComparator(a: Protocol.Security.SecurityState | null, b: Protocol.Security.SecurityState | null): number;
}
export declare enum Events {
    SecurityStateChanged = "SecurityStateChanged",
    VisibleSecurityStateChanged = "VisibleSecurityStateChanged"
}
export declare const SummaryMessages: {
    [x: string]: () => string;
};
export declare class PageSecurityState {
    securityState: Protocol.Security.SecurityState;
    explanations: Protocol.Security.SecurityStateExplanation[];
    summary: string | null;
    constructor(securityState: Protocol.Security.SecurityState, explanations: Protocol.Security.SecurityStateExplanation[], summary: string | null);
}
export declare class PageVisibleSecurityState {
    securityState: Protocol.Security.SecurityState;
    certificateSecurityState: CertificateSecurityState | null;
    safetyTipInfo: SafetyTipInfo | null;
    securityStateIssueIds: string[];
    constructor(securityState: Protocol.Security.SecurityState, certificateSecurityState: Protocol.Security.CertificateSecurityState | null, safetyTipInfo: Protocol.Security.SafetyTipInfo | null, securityStateIssueIds: string[]);
}
export declare class CertificateSecurityState {
    protocol: string;
    keyExchange: string;
    keyExchangeGroup: string | null;
    cipher: string;
    mac: string | null;
    certificate: string[];
    subjectName: string;
    issuer: string;
    validFrom: number;
    validTo: number;
    certificateNetworkError: string | null;
    certificateHasWeakSignature: boolean;
    certificateHasSha1Signature: boolean;
    modernSSL: boolean;
    obsoleteSslProtocol: boolean;
    obsoleteSslKeyExchange: boolean;
    obsoleteSslCipher: boolean;
    obsoleteSslSignature: boolean;
    constructor(certificateSecurityState: Protocol.Security.CertificateSecurityState);
    isCertificateExpiringSoon(): boolean;
    getKeyExchangeName(): string;
    getCipherFullName(): string;
}
declare class SafetyTipInfo {
    safetyTipStatus: string;
    safeUrl: string | null;
    constructor(safetyTipInfo: Protocol.Security.SafetyTipInfo);
}
export declare class SecurityStyleExplanation {
    securityState: Protocol.Security.SecurityState;
    title: string | undefined;
    summary: string;
    description: string;
    certificate: string[];
    mixedContentType: Protocol.Security.MixedContentType;
    recommendations: string[];
    constructor(securityState: Protocol.Security.SecurityState, title: string | undefined, summary: string, description: string, certificate?: string[] | undefined, mixedContentType?: Protocol.Security.MixedContentType | undefined, recommendations?: string[] | undefined);
}
export {};
