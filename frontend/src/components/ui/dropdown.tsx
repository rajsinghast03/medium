"use client";

import { Dropdown } from "flowbite-react";
import { useAuth } from "../../hooks/useAuth";

export function DropdownComponentWithUser() {
  const { user, logOut } = useAuth();

  return (
    <Dropdown label={`Welcome ${user}`} dismissOnClick={false}>
      <Dropdown.Item onClick={logOut}>Log out</Dropdown.Item>
    </Dropdown>
  );
}
