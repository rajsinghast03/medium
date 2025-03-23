"use client";

import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import api from "../lib/utils";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function DeleteModalComponent({ id }: { id: string }) {
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  let toastId: string;

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
            className="size-6 text-red-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
        </button>
      </Button>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Delete Blog</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Are you sure to delete this blog?
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color="red"
            onClick={async () => {
              try {
                toastId = toast.loading("Deleting");
                await api.delete(`/blog/${id}`);
                toast.success("Deleted", { id: toastId });
                setOpenModal(false);
                navigate("/home");
              } catch (error) {
                toast.error("Error", { id: toastId });
                console.log(error);
              }
            }}
          >
            Delete
          </Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
