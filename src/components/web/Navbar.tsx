import Search from "./Search";

const Navbar = () => {
    return (
        <div class="flex flex-col bg-base-100 shadow-lg sticky top-0 z-50 w-full">
            <nav class="grid grid-cols-3 p-2">
                <div class="flex flex-row items-center justify-start">
                    <div class="dropdown lg:hidden">
                        <button tabindex="0" role="button" class="btn btn-ghost flex items-center justify-center">
                            <i class="fa-solid fa-bars fa-lg" />
                        </button>
                        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            <li><a hx-target="#main" hx-push-url="true" hx-indicator="#page-loading"
                                hx-get="/">
                                Home
                            </a></li>
                            <li><a hx-target="#main" hx-push-url="true" hx-indicator="#page-loading"
                                hx-get="/rankings">
                                Rankings
                            </a></li>
                            <li><a hx-target="#main" hx-push-url="true" hx-indicator="#page-loading"
                                hx-get="/beatmaps">
                                Beatmaps
                            </a></li>
                        </ul>
                    </div>
                    <a class="hidden md:flex btn btn-ghost text-xl"
                        hx-get="/" hx-target="#main" hx-push-url="true" hx-indicator="#page-loading">
                        <img src="/public/wysi.svg" class="w-8 h-8 mr-2" alt="wysi" />
                        wysi
                    </a>
                    <div class="hidden lg:flex flex-row text-sm">
                        <a hx-target="#main" hx-push-url="true" hx-indicator="#page-loading"
                            hx-get="/" class="btn btn-ghost">
                            Home
                        </a>
                        <a hx-target="#main" hx-push-url="true" hx-indicator="#page-loading"
                            hx-get="/rankings" class="btn btn-ghost">
                            Rankings
                        </a>
                        <a hx-target="#main" hx-push-url="true" hx-indicator="#page-loading"
                            hx-get="/beatmaps" class="btn btn-ghost">
                            Beatmaps
                        </a>
                    </div>
                </div>
                <div class="flex flex-row items-center justify-center">
                    <Search />
                </div>
                <div class="flex flex-row items-center justify-end">
                    <a href="https://github.com/wysi-inc" target="_blank"
                        class="hidden md:flex btn btn-ghost">
                        <i class="fa-brands fa-github fa-lg" />
                    </a>
                    <a href="https://discord.gg/QYVxgS2934" target="_blank"
                        class="hidden md:flex btn btn-ghost">
                        <i class="fa-brands fa-discord" />
                    </a>
                    <button class="btn btn-ghost ">
                        <span class="hidden md:inline">login with osu!</span>
                        <i class="fa-solid fa-right-to-bracket" />
                    </button>
                </div>
            </nav>
            <div class="h-1">
                <div id="page-loading" class="htmx-indicator bg-accent h-full w-full loading-indicator" />
            </div>
        </div>
    );
}
export default Navbar;
