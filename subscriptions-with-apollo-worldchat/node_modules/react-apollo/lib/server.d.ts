export declare function walkTree(element: any, context: any, visitor: (element: any, instance: any, context: any) => boolean | void): void;
export declare function getDataFromTree(rootElement: any, rootContext?: any, fetchRoot?: boolean): Promise<void>;
export declare function renderToStringWithData(component: any): Promise<string>;
export declare function cleanupApolloState(apolloState: any): void;
