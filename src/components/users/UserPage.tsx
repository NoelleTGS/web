import { v2 } from "osu-api-extended";
import { updateUser } from "@/src/resources/db-user";
import { catalans } from "@/src/resources/constants";
import type { Mode } from "@/src/types/osu";
import type { User } from "@/src/types/users";
import UserTopPanel from "./u_panels/UserTopPanel";
import UserHistoryPanel from "./u_panels/UserHistoryPanel";
import LazyPanel from "./LazyPanel";
import Panel from "./Panel";

type Props = {
    id: string;
    mode: Mode | undefined;
}

const UserPage = async (props: Props) => {

    const user: User = (await v2.user.details(props.id, props.mode) as User);

    if ("error" in user) return <div>User not found</div>;

    const mode = user.rank_history?.mode as Mode || "osu";
    const defaultCategory = user.scores_pinned_count > 0 ? "pinned" : "best";

    user.db_ranks = await updateUser(
        user.id,
        user.username,
        user?.rank_history?.data || [],
        user?.statistics?.country_rank,
        mode
    );

    if (catalans.includes(user.id)) {
        console.log("Bon dia tu!");
        user.country.code = "CAT";
        user.country.name = "Catalunya";
    }

    return (<>
        <UserTopPanel user={user} />
        <Panel title="History" icon={<i class="fa-solid fa-chart-line" />}
            content={<UserHistoryPanel db_ranks={user.db_ranks} play_counts={user.monthly_playcounts} replays_watched={user.replays_watched_counts} />} />
        <LazyPanel title="Scores Summary" icon={<i class="fa-solid fa-ranking-star" />}
            url={`/user/${user.id}/${mode}/panels/scores_summary`} />
        <LazyPanel title="Skins (wip)" icon={<i class="fa-solid fa-palette" />}
            url={`/user/${user.id}/0/panels/skins`} />
        <LazyPanel title="Setup (wip)" icon={<i class="fa-solid fa-computer" />}
            url={`/user/${user.id}/0/panels/setup`} />
        <LazyPanel title="Scores" icon={<i class="fa-solid fa-flag-checkered" />}
            url={`/user/${user.id}/${mode}/panels/scores/${defaultCategory}`} />
        <LazyPanel title="Beatmaps" icon={<i class="fa-solid fa-screwdriver-wrench" />}
            url={`/user/${user.id}/${mode}/panels/beatmaps/favourite`} />
        <LazyPanel title="Most Played" icon={<i class="fa-solid fa-rotate-left" />}
            url={`/user/${user.id}/${mode}/panels/most_played`} />
        <LazyPanel title="Medals" icon={<img src="/public/img/osekai.svg" class="w-5 h-5" alt="osekai" />}
            tooltip="powered by osekai.net"
            url={`/user/${user.id}/${mode}/panels/medals`}
            body={{ medals: user.user_achievements }}
        />
    </>);
}

export default UserPage;
