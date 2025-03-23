import { useNavigate } from "react-router-dom";
import { displayContent } from "../lib/utils";

interface BlogTypes {
  author: string;
  title: string;
  content: string;
  datePublished: Date;
  id: string;
}

function BlogComponent({
  author,
  title,
  content,
  datePublished,
  id,
}: BlogTypes) {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="flex flex-col gap-5 p-6 cursor-pointer"
        onClick={() => {
          navigate(`/blog/${id}`);
        }}
      >
        <div className="flex gap-3 items-center">
          <div className="relative inline-flex items-center justify-center w-5 h-5overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
            <span className=" text-gray-600 dark:text-gray-300">
              {author[0]}
            </span>
          </div>

          <p className="text-sm">{author}</p>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="font-black text-3xl">{title}</h2>
          <p className="text-slate-500">{displayContent(content)}</p>
        </div>

        <p className="text-slate-500">
          {new Intl.DateTimeFormat("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }).format(new Date(datePublished))}
        </p>
      </div>
      <div className="bg-neutral-200  h-[1px] w-full" />
    </>
  );
}

export default BlogComponent;
