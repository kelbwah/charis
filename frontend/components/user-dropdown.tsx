"use client";

import { LayoutDashboard, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import CustomLink from "./custom-link";

interface UserDropdownProps {
  username: string;
  handleLogout: () => Promise<void>;
}

export function UserDropdown(props: UserDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer select-none">
          <AvatarImage src="" />
          <AvatarFallback>
            <p className="text-sm">
              {props.username.length > 0 ? props.username.slice(0, 2) : "N/A"}
            </p>
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-4">
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">
            <CustomLink href="/profile" isComingSoon={false}>
              <div className="flex flex-row space-x-2">
                <User />
                <span className="text-sm">Profile</span>
              </div>
            </CustomLink>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <CustomLink href="/dashboard" isComingSoon={false}>
              <div className="flex flex-row space-x-2">
                <LayoutDashboard />
                <span className="text-sm">Dashboard</span>
              </div>
            </CustomLink>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={async () => await props.handleLogout()}
            className="cursor-pointer"
          >
            <LogOut />
            <span className="text-sm">Log out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
