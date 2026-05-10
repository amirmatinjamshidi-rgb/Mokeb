"use client";

import React from "react";
import { Users, CalendarDays, WalletCards, Mail, LogOut } from "lucide-react";
import Link from "next/link";
import Button from "../UI/button";
type SidebarItem = {
  id: number;
  name: string;
  route: string;
  icon: React.ReactNode;
};

const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 1, name: "داشبورد", route: "/Admin", icon: <Users stroke="orange" /> },
  {
    id: 2,
    name: "رزروها",
    route: "/Admin/reservations",
    icon: <CalendarDays stroke="orange" />,
  },
  {
    id: 3,
    name: "رستوران",
    route: "/Admin/Resturant",
    icon: <Mail stroke="orange" />,
  },
  {
    id: 4,
    name: "پرداخت‌ها",
    route: "/Admin/transactions",
    icon: <WalletCards stroke="orange" />,
  },
  {
    id: 5,
    name: "خروج از پنل",
    route: "/",
    icon: <LogOut stroke="orange" />,
  },
];

function SideBar() {
  return (
    <aside
  className="sticky top-0 w-65 h- p-2 border rounded-l-2xl shadow-2xl  allBorder transition-all ease-in-out duration-150 bg-[#175E47]  hover:shadow-gray-400
                 hidden lg:block"
      aria-label="Admin Sidebar"
    >
      <div className="flex flex-col gap-12 justify-between  bg">
        <nav className="flex flex-col gap-2" dir="rtl">
          {SIDEBAR_ITEMS.map((item) => (
            <Link key={item.id} href={item.route}>
              <Button
                radius="md"
                size="lg"
                color="white"
                className="
                  w-full flex flex-row items-center gap-3
                  justify-start
                  hover:text-black
                  hover:bg-secondaryHover
                  focus:bg-secondaryActive focus:text-black
                "
              >
                <span className="w-6 h-6 flex items-center justify-center">
                  {item.icon}
                </span>
                <span className="text-sm font-medium">{item.name}</span>
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}

export default SideBar;
