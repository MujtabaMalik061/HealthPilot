import SiteLogo from "../assets/images/SiteLogo.png";
import PlaceHolder from "../assets/images/PlaceHolder.webp";

export const IMAGES = {
  SiteLogo,
  PlaceHolder,
};

export const SidebarAdminMenuItems = [
  {
    name: "Dashboard",
    icon: "LayoutDashboard",
    route: "/admin/dashboard",
    activeAt: "/admin/dashboard",
  },
  {
    name: "All Doctors",
    icon: "Stethoscope",
    route: "/admin/doctors",
    activeAt: "/admin/doctors",
  },
  {
    name: "Users",
    icon: "Users",
    route: "/admin/users",
    activeAt: "/admin/users",
  },
  {
    name: "All Appointments",
    icon: "CalendarHeart",
    route: "/admin/appointments",
    activeAt: "/admin/appointments",
  },
  {
    name: "Services",
    icon: "Building2",
    route: "/admin/services",
    activeAt: "/admin/services",
  },
  {
    name: "Reports",
    icon: "FileText",
    route: "/admin/reports",
    activeAt: "/admin/reports",
  },
  {
    name: "Settings",
    icon: "Settings",
    route: "/settings",
    activeAt: "/settings",
    startsWith: ["/settings"],
  },
];

export const SidebarDoctorMenuItems = [
  {
    name: "Dashboard",
    icon: "LayoutDashboard",
    route: "/doctor/dashboard",
    activeAt: "/doctor/dashboard",
  },
  {
    name: "My Appointments",
    icon: "CalendarHeart",
    route: "/doctor/appointments",
    activeAt: "/doctor/appointments",
  },
  {
    name: "Info",
    icon: "BookPlus",
    route: "/doctor/info",
    activeAt: "/doctor/info",
  },
  {
    name: "Reports",
    icon: "FileText",
    route: "/reports",
    activeAt: "/reports",
  },
  {
    name: "Settings",
    icon: "Settings",
    route: "/settings",
    activeAt: "/settings",
    startsWith: ["/settings"],
  },
];

export const SidebarUserMenuItems = [
  {
    name: "Dashboard",
    icon: "LayoutDashboard",
    route: "/dashboard",
    activeAt: "/dashboard",
  },
  {
    name: "All Doctors",
    icon: "Stethoscope",
    route: "/doctors",
    activeAt: "/doctors",
  },
  {
    name: "Services",
    icon: "Building2",
    route: "/services",
    activeAt: "/services",
  },
  {
    name: "My Appointments",
    icon: "CalendarHeart",
    route: "/appointments",
    activeAt: "/appointments",
  },
  {
    name: "Reports",
    icon: "FileText",
    route: "/reports",
    activeAt: "/reports",
  },
  {
    name: "Settings",
    icon: "Settings",
    route: "/settings",
    activeAt: "/settings",
    startsWith: ["/settings"],
  },
];

export const limit = 2;