import { useEffect, useState } from "react";
import BlogComponent from "../components/BlogComponent";
import api from "../lib/utils";
import toast from "react-hot-toast";

interface BlogTypes {
  author: {
    name: string;
  };
  title: string;
  content: string;
  publishedAt: Date;
  id: string;
}

export default function Home() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    async function getAllBlogs() {
      const loadingToast = toast.loading("Getting Blogs");
      try {
        const res = await api.get("/blog/bulk");
        setBlogs(res.data);
        toast.success("Done", { id: loadingToast });
      } catch (error) {
        console.error(error);
        toast.error("Error", { id: loadingToast });
      }
    }

    getAllBlogs();
  }, []);

  return (
    <div>
      <div className="max-w-[800px] mt-8 mx-auto flex flex-col gap-1">
        {blogs.map((blog: BlogTypes) => {
          return (
            <BlogComponent
              key={blog.id}
              title={blog.title}
              content={blog.content}
              datePublished={blog.publishedAt}
              id={blog.id}
              author={blog.author.name}
            />
          );
        })}
      </div>
    </div>
  );
}
