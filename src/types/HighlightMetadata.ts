export interface ReelsIds {
    highlight_id: string;
    cover: string;
    title: string;
}

export interface HightlighGraphQL {
    data:   Data;
    status: string;
}

export interface Data {
    viewer: null;
    user:   User;
}

export interface User {
    has_public_story:      boolean;
    edge_highlight_reels:  Edge;
    edge_related_profiles: Edge;
}

export interface Edge {
    edges: EdgeElement[];
}

export interface EdgeElement {
    node: Node;
}

export interface Node {
    __typename:                    string;
    id:                            string;
    cover_media:                   CoverMedia;
    cover_media_cropped_thumbnail: CoverMediaCroppedThumbnail;
    owner:                         Owner;
    title:                         string;
}

export interface CoverMedia {
    thumbnail_src: string;
}

export interface CoverMediaCroppedThumbnail {
    url: string;
}

export interface Owner {
    __typename:      string;
    id:              string;
    profile_pic_url: string;
    username:        string;
}
