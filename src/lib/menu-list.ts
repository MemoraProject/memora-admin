import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon,
  CreditCard,
  Banknote,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/admin/dashboard",
          label: "Dashboard",
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Management",
      menus: [
        {
          href: "/admin/subscription",
          label: "Subscription",
          icon: CreditCard,
        },
        {
          href: "/admin/payment",
          label: "Payment",
          icon: Banknote,
        },
        {
          href: "/admin/subscribers",
          label: "Subscribers",
          icon: Users,
        },
      ],
    },
    {
      groupLabel: "Accounts",
      menus: [
        {
          href: "/admin/account",
          label: "Users",
          icon: Users,
        },
        // {
        //   href: "/account",
        //   label: "Account",
        //   icon: Settings,
        // },
      ],
    },
  ];
}
