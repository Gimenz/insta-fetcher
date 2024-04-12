
/** Instagram Highlight query */
export const highlight_ids_query = (userId: string) => {
    return {
        'query_hash': 'c9100bf9110dd6361671f113dd02e7d6',
        'variables': JSON.stringify({
            "user_id": userId,
            "include_chaining": false,
            "include_reel": true,
            "include_suggested_users": false,
            "include_logged_out_extras": false,
            "include_highlight_reels": true,
            "include_live_status": false
        })
    }
}

export const highlight_media_query = (ids: string) => {
    return {
        'query_hash': '0a85e6ea60a4c99edc58ab2f3d17cfdf',
        'variables': JSON.stringify({
            "reel_ids": [],
            "tag_names": [],
            "location_ids": [],
            "highlight_reel_ids": [ids],
            "precomposed_overlay": false,
            "show_story_viewer_list": true,
            "story_viewer_fetch_count": 50,
            "story_viewer_cursor": "",
            "stories_video_dash_manifest": false
        })
    }
}

export const post_shortcode_query = (shortcode: string) => {
    return {
        'query_hash': '55a3c4bad29e4e20c20ff4cdfd80f5b4',
        'variables': JSON.stringify({
            shortcode
        })
    }
}