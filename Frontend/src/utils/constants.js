import SiteLogo from "../assets/images/SiteLogo.png";
import PlaceHolder from "../assets/images/PlaceHolder.webp";
import NotFound from "../assets/images/NotFound.png";

export const IMAGES = {
  SiteLogo,
  PlaceHolder,
  NotFound,
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
    startsWith: ["/admin/doctor-details/"],
  },
  {
    name: "Users",
    icon: "Users",
    route: "/admin/users",
    activeAt: "/admin/users",
    startsWith: ["/admin/user-details/"],
  },
  {
    name: "All Appointments",
    icon: "CalendarHeart",
    route: "/admin/appointments",
    activeAt: "/admin/appointments",
    startsWith: ["/appointment-details"],
  },
  {
    name: "Services",
    icon: "Building2",
    route: "/admin/services",
    activeAt: "/admin/services",
    startsWith: ["/service-details/"],
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
    startsWith: ["/appointment-details"],
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
    name: "All Doctors",
    icon: "Stethoscope",
    route: "/doctors",
    activeAt: "/doctors",
    startsWith: ["/doctor-details/"],
  },
  {
    name: "Services",
    icon: "Building2",
    route: "/services",
    activeAt: "/services",
    startsWith: ["/service-details/"],
  },
  {
    name: "My Appointments",
    icon: "CalendarHeart",
    route: "/appointments",
    activeAt: "/appointments",
    startsWith: ["/appointment-details", "/appoint-booking/"],
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

export const limit = 4;