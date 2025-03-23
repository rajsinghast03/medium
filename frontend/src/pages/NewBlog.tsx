"use client";

import api from "@/lib/utils";
import { Label, Textarea, TextInput } from "flowbite-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function NewBlog() {
  const [input, setInput] = useState({
    title: "",
    content: "",
  });
  const navigate = useNavigate();
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const toastId = toast.loading("Creating...");
    try {
      await api.post("/blog", input);
      toast.success("Created!", { id: toastId });
      navigate("/home");
    } catch (error) {
      toast.error("Error", { id: toastId });
      console.error(error);
    }
  }

  const handleInput = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <form className=" max-w-[800px] mx-auto mt-20" onSubmit={handleSubmit}>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="base" value="Title" />
        </div>
        <TextInput
          id="base"
          type="text"
          name="title"
          sizing="md"
          value={input.title}
          onChange={handleInput}
          placeholder="How to start Leetcode in 2025?"
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="comment" value="Blog content" />
        </div>
        <Textarea
          id="comment"
          placeholder="Write here..."
          required
          name="content"
          rows={4}
          value={input.content}
          onChange={handleInput}
        />
      </div>
      <button
        type="submit"
        className="bg-green-400 p-2 rounded-lg text-white mt-4"
      >
        Create Blog
      </button>
    </form>
  );
}
