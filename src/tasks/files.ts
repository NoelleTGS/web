import path from "path";
import { Worker } from "worker_threads";
import type { LanguagesType, SubdivisionFlagsType } from "../types/countries";

export let TRANSLATIONS: any = {};
export let LANGUAGES: LanguagesType = {};
export let SUBDIVISION_FLAGS: SubdivisionFlagsType = {};

export function txt(lang: string, path: string): string {
    const split = path.split(".");
    let t = split.reduce((acc, part) => acc && acc[part], TRANSLATIONS[lang]);
    if (!t) t = split.reduce((acc, part) => acc && acc[part], TRANSLATIONS["en"]);
    if (!t) t = "";
    return t;
}

export async function load_json_data() {
    const res = await Promise.all([create_worker_task("load_translations"), create_worker_task("load_languages"), create_worker_task("load_subdivisions")]);
    TRANSLATIONS = res[0];
    LANGUAGES = res[1];
    SUBDIVISION_FLAGS = res[2];
}

export async function create_worker_task(taskName: string): Promise<any> {
    return new Promise((resolve) => {
        const worker = new Worker(path.join(__dirname, "worker.ts"), { workerData: { taskName } });
        worker.once("message", (data) => resolve(data));
    });
}
