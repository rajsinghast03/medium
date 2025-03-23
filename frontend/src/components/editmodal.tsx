"use client";

import { Button, Label, Modal, Textarea, TextInput } from "flowbite-react";
import { useState } from "react";
import api from "../lib/utils";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface BlogType {
  blogTitle: string;
  blogContent: string;
  blogId: string;
}

export default function EditModalComponent({
  blogTitle,
  blogContent,
  blogId,
}: BlogType) {
  const [openModal, setOpenModal] = useState(false);

  const [input, setInput] = useState({
    title: blogTitle,
    content: blogContent,
  });
  const navigate = useNavigate();

  async function handleSubmit() {
    const toastId = toast.loading("Editing...");
    try {
      await api.put("/blog", { ...input, blogId: blogId });
      toast.success("Edited!", { id: toastId });
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
    <>
      <Button onClick={() => setOpenModal(true)} color="white">
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
            />
          </svg>
        </button>
      </Button>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Edit Blog</Modal.Header>
        <Modal.Body>
          <div className=" max-w-[800px] mx-auto ">
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
                rows={input.content.split(" ").length / 8}
                value={input.content}
                onChange={handleInput}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="blue" onClick={handleSubmit}>
            Edit
          </Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
