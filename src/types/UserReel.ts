import { Extensions, ImageVersions2, Media, PageInfo, ProductType, User } from ".";
import { Edges, XdtViewer } from "./PaginatedPosts";

export interface ProfileReel {
    xdt_api__v1__clips__user__connection_v2: XdtAPIV1ClipsUserConnectionV2;
    xdt_viewer: XdtViewer;
}

export interface XdtAPIV1ClipsUserConnectionV2 {
    edges: ReelEdge[];
    page_info: PageInfo;
}

export interface ReelEdge {
    node: ReelNode;
    cursor: string;
}

export interface ReelNode {
    media: Media;
    __typename: Typename;
}

export interface ReelMedia {
    pk: string;
    id: string;
    code: string;
    media_overlay_info: null;
    boosted_status: null;
    boost_unavailable_identifier: null;
    boost_unavailable_reason: null;
    user: ReelUser;
    product_type: string;
    play_count: number;
    view_count: null;
    like_and_view_counts_disabled: boolean;
    comment_count: number;
    like_count: number;
    audience: null;
    clips_tab_pinned_user_ids: any[];
    has_views_fetching: boolean;
    media_type: number;
    carousel_media: null;
    image_versions2: ImageVersions2;
    preview: null;
    original_height: number;
    original_width: number;
}

export enum Typename {
    XDTClipsItemDict = "XDTClipsItemDict",
}

export interface ReelUser {
    pk: string;
    id: string;
}
