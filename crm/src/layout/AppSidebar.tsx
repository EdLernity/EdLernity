"use client";

import React, { useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../context/AuthContext";
import {
  GridIcon,
  HorizontaLDots,
  ListIcon,
  TableIcon,
  UserCircleIcon,
  DollarLineIcon,
  TaskIcon,
  MailIcon,
  PlugInIcon,
} from "../icons/index";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
  adminOnly?: boolean;
};

const allNavItems: NavItem[] = [
  { icon: <GridIcon />, name: "Overview", path: "/", adminOnly: true },
  { icon: <UserCircleIcon />, name: "Users", path: "/users", adminOnly: true },
  { icon: <TableIcon />, name: "Intern Certificate", path: "/interns" },
  { icon: <TaskIcon />, name: "Tech Internship Approvals", path: "/internship-approvals" },
  { icon: <TaskIcon />, name: "Certificates", path: "/certificates", adminOnly: true },
  { icon: <ListIcon />, name: "Careers Programs", path: "/careers-programs", adminOnly: true },
  { icon: <PlugInIcon />, name: "Trainer Assignments", path: "/trainer-assignments", adminOnly: true },
  { icon: <DollarLineIcon />, name: "Transactions", path: "/transactions", adminOnly: true },
  { icon: <PlugInIcon />, name: "Operations", path: "/operations", adminOnly: true },
  { icon: <MailIcon />, name: "Offer Letters", path: "/offer-letters", adminOnly: true },
  { icon: <MailIcon />, name: "Invites", path: "/invites" },
];

const internNavItems: NavItem[] = [
  { icon: <UserCircleIcon />, name: "My Profile", path: "/my-profile" },
  { icon: <MailIcon />, name: "My Offer Letters", path: "/my-offer-letters" },
  { icon: <TaskIcon />, name: "My Certificates", path: "/my-certificates" },
];

const trainerNavItems: NavItem[] = [
  { icon: <TaskIcon />, name: "My Programs", path: "/trainer" },
  { icon: <TableIcon />, name: "Assessments", path: "/trainer/assessments" },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const { isAdmin, isIntern, isTrainer } = useAuth();
  const pathname = usePathname();
  const isActive = useCallback(
    (path: string) => {
      if (path === "/trainer/assessments") {
        return pathname === "/trainer/assessments" || pathname.startsWith("/trainer/assessments/");
      }
      if (path === "/trainer") {
        if (pathname.startsWith("/trainer/assessments")) return false;
        return pathname === "/trainer" || pathname.startsWith("/trainer/");
      }
      if (path === "/internship-approvals") {
        return (
          pathname === "/internship-approvals" ||
          pathname.startsWith("/internship-approvals/")
        );
      }
      return path === pathname;
    },
    [pathname]
  );

  const navItems = isIntern
    ? internNavItems
    : isTrainer
      ? trainerNavItems
      : allNavItems.filter((item) => !item.adminOnly || isAdmin);

  const sectionLabel = isIntern
    ? "Intern Portal"
    : isTrainer
      ? "Trainer"
      : isAdmin
        ? "Admin"
        : "Manager";

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}
      >
        <Link href={isTrainer ? "/trainer" : isIntern ? "/my-profile" : "/"} className="flex items-center">
          {isExpanded || isHovered || isMobileOpen ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/images/logo/logo.svg"
              alt="EdLernity"
              className="h-9 w-auto dark:hidden"
            />
          ) : null}
          {isExpanded || isHovered || isMobileOpen ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/images/logo/logo-dark.svg"
              alt="EdLernity"
              className="hidden h-9 w-auto dark:block"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/images/logo/edlernity-mark.svg"
              alt="EdLernity"
              className="h-8 w-8"
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <h2
            className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
              !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
            }`}
          >
            {isExpanded || isHovered || isMobileOpen ? sectionLabel : <HorizontaLDots />}
          </h2>
          <ul className="flex flex-col gap-2">
            {navItems.map((nav) => (
              <li key={nav.path}>
                <Link
                  href={nav.path}
                  className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"}`}
                >
                  <span
                    className={
                      isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"
                    }
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text">{nav.name}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
