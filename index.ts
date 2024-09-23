import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import { staticPlugin } from '@elysiajs/static'
import { jwt } from "@elysiajs/jwt";
import { readdir } from "node:fs/promises";

import { auth } from "osu-api-extended";
import mongoose from "mongoose";

import { baseRoutes } from "./src/routes/base";
import { rankingRoutes } from "./src/routes/rankings";
import { userRoutes } from "./src/routes/user";
import { beatmapRoutes, beatmapsetRoutes } from "./src/routes/beatmaps";
import { updateMedals } from "./src/db/medals/update_medals";
import { apiRoutes } from "./src/routes/api";
import { scoresRoutes } from "./src/routes/scores";
import { adminRoutes } from "./src/routes/admin";
import { reportRoutes } from "./src/routes/reports";

const port = Number(process.env.PORT as string);
const mongo_uri = process.env.MONGO_URI as string;

export const osu_id = Number(process.env.OSU_ID);
export const osu_secret = String(process.env.OSU_SECRET);
export const osu_redirect = String(process.env.OSU_REDIRECT);
export const osu_api_key = String(process.env.OSU_API_KEY);

export const crowdin_id = Number(process.env.CROWDIN_ID);
export const crowdin_secret = String(process.env.CROWDIN_SECRET);

await mongoose.connect(mongo_uri).catch((err) => console.error("[ EE ] Couldn't connect to MongoDB\n", err))
console.info("[ OK ] Connected to MongoDB")

async function connect() {
    const result = await auth.login(osu_id, osu_secret, ["public"]).catch((err) => console.error(err));

    if (!result?.expires_in) return console.error("[ EE ] Couldn't connect to osu!API\n", result);
    console.info("[ OK ] Connected to osu!API")
    setTimeout(async () => {
        await relogin()
        setInterval(async () => await relogin(), 1000 * 60 * 60 * 12);
    }, result.expires_in * 1000);

    auth.set_v1(osu_api_key);
    await updateMedals();
}

async function relogin() {
    const result = await auth.re_login()
    if (!result) return console.error("[ EE ] Couldn't reconnect to osu!API\n");
    await updateMedals();
}

connect();

async function getTranslations() {
    try {
        const dirs = await readdir("./locales");
        const translations: any = {};
        for (let dir of dirs) {
            const file = Bun.file(`./locales/${dir}/translation.json`);
            const contents = await file.json();
            translations[dir] = contents;
        }
        return translations;
    } catch (err) {
        console.error(err);
        return {};
    }
}

export const translations = await getTranslations();

const jwtcfg = jwt({
    secret: process.env.OSU_SECRET as string,
    cookie: "auth",
    cookieOptions: {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 31 * 2,
        path: '/',
    }
})

export let API_CALL_COUNTER_MAX = 0;
export let API_CALL_COUNTER = 0;
setInterval(() => {
    console.log(`CURRENT API CALLS IN 1 MINUTE: ${API_CALL_COUNTER}`);
    if (API_CALL_COUNTER > API_CALL_COUNTER_MAX) API_CALL_COUNTER_MAX = API_CALL_COUNTER;
    console.log(`MAX API CALLS IN 1 MINUTE: ${API_CALL_COUNTER_MAX}`);
    API_CALL_COUNTER = 0;
}, 60000);


export function apicall() {
    API_CALL_COUNTER++;
}

const RATELIMIT = 500;
const RATELIMIT_MAP = new Map();

setInterval(() => {
    console.log(RATELIMIT_MAP);
    RATELIMIT_MAP.clear();
}, 60000);

new Elysia()
    .onRequest(({ request, set }) => {
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
        const req_count = RATELIMIT_MAP.get(ip) || 0;
        const route = request.url.split("/").slice(3).join("/");
        const base = route.split("/")[0];
        if (base !== "public") {
            RATELIMIT_MAP.set(ip, req_count + 1);
            if (req_count > RATELIMIT) {
                set.status = 420;
                console.log(`${ip} HIT RATE LIMIT!`);
                return "Rate limit hit (120 req/min)";
            }
        }
        if (base !== "public" && route !== "favicon.ico") {
            console.log(`${(ip).padStart(15, " ")} ${request.method.padStart(6, " ")}::/${route}`);
        }
    })
    .derive(({ cookie }) => {
        const lang = cookie?.lang?.value || "en";
        return {
            t: translations[lang],
            lang
        }
    })
    .get("/favicon.ico", Bun.file("./public/favicon.ico"))
    .use(staticPlugin())
    .use(html())
    .use(jwtcfg)
    .use(apiRoutes)
    .use(baseRoutes)
    .use(adminRoutes)
    .use(reportRoutes)
    .use(rankingRoutes)
    .use(userRoutes)
    .use(beatmapRoutes)
    .use(beatmapsetRoutes)
    .use(scoresRoutes)
    .onStart(() => console.info(`[ OK ] Listening on port ${port}`))
    .onError(() => "404: This page doesnt exist")
    .listen(port);
