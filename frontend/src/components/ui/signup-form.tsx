"use client";
import React, { useState } from "react";
import { Label } from "./label";
import { Input } from "./input";
import { cn } from "../../lib/utils";
import { useNavigate } from "react-router-dom";
import { signUpType, signUpSchema } from "@rajsinghast03/medium-common";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";

export default function Form() {
  const navigate = useNavigate();
  const { signUpAction, isLoading } = useAuth();

  const [input, setInput] = useState<signUpType>({
    email: "",
    password: "",
    name: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { success } = signUpSchema.safeParse(input);

    if (!success) {
      toast.error("Invalid Input");
      return;
    }

    await signUpAction(input);

    return;
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black ">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 text-center">
        Welcome to Medium
      </h2>

      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Tyler"
              type="text"
              onChange={handleInput}
            />
          </LabelInputContainer>
        </div>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            placeholder="projectmayhem@fc.com"
            type="email"
            onChange={handleInput}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            placeholder="••••••••"
            type="password"
            onChange={handleInput}
          />
        </LabelInputContainer>
        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
          disabled={isLoading}
        >
          Sign up &rarr;
          <BottomGradient />
        </button>
        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
      </form>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300 text-center">
        Already have an account ?{" "}
        <button
          className="underline"
          onClick={() => {
            navigate("/login");
          }}
        >
          Login now
        </button>
      </p>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
