import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  UserIcon,
  ChartPieIcon,
  PlusIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

const navLinks = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: <HomeIcon className="w-5 h-5" />,
  },
  {
    to: "/my-activity",
    label: "My Activity",
    icon: <ChartPieIcon className="w-5 h-5" />,
  },
  {
    to: "/create",
    label: "Create Poll",
    icon: <PlusIcon className="w-5 h-5" />,
  },
  {
    to: "/privacy",
    label: "Privacy",
    icon: <LockClosedIcon className="w-5 h-5" />,
  },
];

const MobileNavbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden">
      <div className="flex justify-between items-center px-4 py-2">
        <button
          className="p-2 rounded-md focus:outline-none"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
        <span className="font-bold text-lg">Poll Scribe</span>
      </div>
      {open && (
        <div className="bg-background border-t border-border">
          <ul className="flex flex-col py-2">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`flex items-center px-4 py-3 text-base font-medium transition-colors ${
                    location.pathname.startsWith(link.to)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {link.icon}
                  <span className="ml-3">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default MobileNavbar;
