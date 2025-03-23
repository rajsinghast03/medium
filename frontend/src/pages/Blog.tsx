import { useEffect, useState } from "react";
import api, { calculateReadingTime, getUserIdFromToken } from "../lib/utils";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { DeleteModalComponent } from "../components/modal";
import EditModalComponent from "@/components/editmodal";

interface BlogType {
  title: string;
  content: string;
  datePublished: Date;
  authorName: string;
  authorId: string;
  blogId: string;
}

export default function Blog() {
  const [blog, setBlog] = useState<BlogType>({
    title: "",
    content: "",
    datePublished: new Date(),
    authorName: "",
    authorId: "",
    blogId: "",
  });
  const token = localStorage.getItem("token");
  const userId = getUserIdFromToken(token);
  const { id: blog_id } = useParams();

  useEffect(() => {
    async function getBlogById(id: string) {
      let toastId;
      try {
        toastId = toast.loading("Getting blog");
        const res = await api.get(`/blog/${id}`);
        setBlog({
          title: res.data.title,
          content: res.data.content,
          datePublished: res.data.publishedAt,
          authorId: res.data.authorId,
          authorName: res.data.author.name,
          blogId: res.data.id,
        });
        toast.success("Done", { id: toastId });
      } catch (error) {
        toast.error("Error", { id: toastId });
        console.error(error);
      }
    }
    if (blog_id == undefined) return;
    getBlogById(blog_id);
  }, [blog_id]);

  return (
    <div className="max-w-[700px] mt-12 mx-auto flex flex-col gap-8">
      <h1 className="font-black text-[2.5rem] leading-tight text-[#242424]">
        {blog.title}
      </h1>
      <div className="flex gap-3 ">
        <div className="relative inline-flex items-center justify-center w-12 h-12 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
          <span className="font-medium text-lg text-gray-600 dark:text-gray-300">
            {blog.authorName[0]}
          </span>
        </div>

        <div className="flex flex-col  justify-center">
          <p>{blog.authorName}</p>
          <div className="flex gap-2 text-slate-600 text-sm">
            <span>{calculateReadingTime(blog.content)} min read</span>
            <span>.</span>
            <span>
              {new Intl.DateTimeFormat("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }).format(new Date(blog.datePublished))}
            </span>
          </div>
        </div>

        {blog.authorId == userId && (
          <div className="flex gap-6 ml-[300px]">
            {blog_id && (
              <EditModalComponent
                blogTitle={blog.title}
                blogContent={blog.content}
                blogId={blog_id}
              />
            )}

            {blog_id && <DeleteModalComponent id={blog_id} />}
          </div>
        )}
      </div>
      <p className="font-serif text-lg leading-loose">{blog.content}</p>
    </div>
  );
}
