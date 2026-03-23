import { PageInfo } from "./PostMetadata";
import { Item } from "./PostModels";

export interface IPaginatedPosts {
    xdt_api__v1__feed__user_timeline_graphql_connection: XdtAPIV1FeedUserTimelineGraphqlConnection;
    xdt_viewer: XdtViewer;
}

export interface XdtAPIV1FeedUserTimelineGraphqlConnection {
    edges: Edges[];
    page_info: PageInfo;
}

export interface Edges {
    node: Item;
    cursor: string;
}

export enum NodeTypename {
    XDTMediaDict = "XDTMediaDict",
}

export interface XdtViewer {
    user: XdtViewerUser;
}

export interface XdtViewerUser {
    id: string;
}