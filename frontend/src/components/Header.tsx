import { useNavigate } from "react-router-dom";
import { DropdownComponentWithUser } from "./ui/dropdown";

function Header() {
  const navigate = useNavigate();
  return (
    <header>
      <nav className="flex items-center justify-between py-2 px-4">
        <div
          className="icon cursor-pointer"
          onClick={() => {
            navigate("/home");
          }}
        >
          <img
            src="/Medium-Wordmark-Black.svg"
            alt=""
            height={126}
            width={126}
          />
        </div>

        <div className="flex gap-8 items-center">
          <button
            className="flex items-center gap-1 group"
            onClick={() => {
              navigate("/blog/new");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 26 26"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-6 text-slate-400 group-hover:text-black"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
            <span className="text-slate-600 group-hover:text-black">Write</span>
          </button>

          <DropdownComponentWithUser />
        </div>
      </nav>

      <div className="bg-neutral-200  h-[1px] w-full" />
    </header>
  );
}

export default Header;
