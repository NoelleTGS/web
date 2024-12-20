import type { Beatmapset, BeatmapsetCount } from "../types/beatmaps";
import type { Mode } from "../types/osu";
import type { Res, UserBasic, UserCookie } from "../types/users";
import { osu_fetch } from "./api";

export async function api_me_details(token?: string): Promise<Res<UserBasic>> {
    const url = new URL(`https://osu.ppy.sh/api/v2/me`);
    return await osu_fetch({ url, token });
}

export async function api_user_details(id: number | string, mode?: Mode, user?: UserCookie | null): Promise<Res<UserBasic>> {
    const url = new URL(`https://osu.ppy.sh/api/v2/users/${id}${mode ? `/${mode}` : ""}`);
    return await osu_fetch({ url, user });
}

export async function api_user_beatmaps(
    id: number,
    type: "favourite" | "graveyard" | "guest" | "loved" | "nominated" | "pending" | "ranked",
    obj: {
        offset: number;
        limit: number;
    },
    user?: UserCookie | null
): Promise<Res<Beatmapset[]>> {
    const url = new URL(`https://osu.ppy.sh/api/v2/users/${id}/beatmapsets/${type}`);
    Object.keys(obj).forEach((key) => url.searchParams.append(key, obj[key]));
    return await osu_fetch({ url, user });
}

export async function api_user_most_played(
    id: number,
    obj: {
        offset: number;
        limit: number;
    },
    user?: UserCookie | null
): Promise<Res<BeatmapsetCount[]>> {
    const url = new URL(`https://osu.ppy.sh/api/v2/users/${id}/beatmapsets/most_played`);
    Object.keys(obj).forEach((key) => url.searchParams.append(key, obj[key]));
    return await osu_fetch({ url, user });
}
