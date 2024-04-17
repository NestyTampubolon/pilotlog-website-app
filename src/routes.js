import React from "react";

import { Icon } from "@chakra-ui/react";
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
  MdGroups,
  MdLibraryBooks,
  MdAssignmentReturn,
  MdOutlineQuestionMark,
  MdBusiness
} from "react-icons/md";

// Admin Imports
import MainDashboard from "views/admin/default";
import Users from "views/admin/users";
import NFTMarketplace from "views/admin/marketplace";
import Profile from "views/admin/profile";
import DataTables from "views/admin/dataTables";
import RTL from "views/admin/rtl";
import Certificate from "views/admin/certificate";

// Auth Imports
import SignInCentered from "views/auth/signIn";
import SignUpCentered from "views/auth/signUp";
import Attendance from "views/admin/attendance";
import AttendanceDetail from "views/admin/attendanceDetail";
import AddAttendance from "views/admin/addAttendance";
import AttendanceEdit from "views/admin/editAttendance";
import TrainingClass from "views/admin/trainingclass";
import AddTrainingClass from "views/admin/addTrainingClass";
import EditTrainingClass from "views/admin/editTrainingClass";
import AddUsers from "views/admin/addUsers";
import UserDetail from "views/admin/usersDetail";
import EditUsers from "views/admin/editUsers";
import Settings from "views/admin/settings";
import Statements from "views/admin/statements";
import Company from "views/admin/company";
import Home from "views/home";
const routes = [
  {
    name: "Home",
    layout: "/home",
    path: "/",
    component: Home,
  },
  {
    name: "Sign In",
    layout: "/auth",
    path: "/sign-in",
    icon: <Icon as={MdLock} width='20px' height='20px' color='inherit' />,
    component: SignInCentered,
  },
  {
    name: "Sign Up",
    layout: "/auth",
    path: "/sign-up",
    icon: <Icon as={MdLock} width='20px' height='20px' color='inherit' />,
    component: SignUpCentered,
  },
  {
    name: "Main",
    layout: "/admin",
    path: "/default",
    icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
    component: MainDashboard,
  },
  {
    name: "User",
    layout: "/admin",
    path: "/users",
    icon: <Icon as={MdGroups} width='20px' height='20px' color='inherit' />,
    component: Users,
  },
  {
    name: "User Detail",
    layout: "/admin",
    path: `/userdetail/:id`,
    icon: <Icon as={MdGroups} width='20px' height='20px' color='inherit' />,
    component: UserDetail,
  },
  {
    name: "Edit Users",
    layout: "/admin",
    path: `/editusers/:id`,
    icon: <Icon as={MdGroups} width='20px' height='20px' color='inherit' />,
    component: EditUsers,
  },
  {
    name: "Add Users",
    layout: "/admin",
    path: "/addusers",
    icon: <Icon as={MdAssignmentReturn} width='20px' height='20px' color='inherit' />,
    component: AddUsers,
  },
  {
    name: "Attendance",
    layout: "/admin",
    path: "/attendance",
    icon: <Icon as={MdLibraryBooks} width='20px' height='20px' color='inherit' />,
    component: Attendance,
  },
  {
    name: "Training Class",
    layout: "/admin",
    path: "/trainingclass",
    icon: <Icon as={MdAssignmentReturn} width='20px' height='20px' color='inherit' />,
    component: TrainingClass,
  },
  {
    name: "Attendance Detail",
    layout: "/admin",
    path: "/attendancedetail/:id",
    icon: <Icon as={MdLibraryBooks} width='20px' height='20px' color='inherit' />,
    component: AttendanceDetail,
  },
  {
    name: "Add Attendance",
    layout: "/admin",
    path: "/addattendance",
    icon: <Icon as={MdLibraryBooks} width='20px' height='20px' color='inherit' />,
    component: AddAttendance,
  },
  {
    name: "Attendance Edit",
    layout: "/admin",
    path: "/attendanceedit/:id",
    icon: <Icon as={MdLibraryBooks} width='20px' height='20px' color='inherit' />,
    component: AttendanceEdit,
  },

  {
    name: "Add Training Class",
    layout: "/admin",
    path: "/addtrainingclass",
    icon: <Icon as={MdAssignmentReturn} width='20px' height='20px' color='inherit' />,
    component: AddTrainingClass,
  },
  {
    name: "Edit Training Class",
    layout: "/admin",
    path: `/trainingclassedit/:id`,
    icon: <Icon as={MdAssignmentReturn} width='20px' height='20px' color='inherit' />,
    component: EditTrainingClass,
  },
  {
    name: "Statements",
    layout: "/admin",
    path: "/statements",
    icon: <Icon as={MdOutlineQuestionMark} width='20px' height='20px' color='inherit' />,
    component: Statements,
  },
  {
    name: "Certificate",
    layout: "/admin",
    path: "/certificate",
    icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
    component: Certificate,
  },
  {
    name: "Settings",
    layout: "/admin",
    path: "/settings",
    icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
    component: Settings,
  },
  {
    name: "Company",
    layout: "/admin",
    path: "/company",
    icon: <Icon as={MdBusiness} width='20px' height='20px' color='inherit' />,
    component: Company,
  },
  {
    name: "NFT Marketplace",
    layout: "/admin",
    path: "/nft-marketplace",
    icon: (
      <Icon
        as={MdOutlineShoppingCart}
        width='20px'
        height='20px'
        color='inherit'
      />
    ),
    component: NFTMarketplace,
    secondary: true,
  },
  {
    name: "Data Tables",
    layout: "/admin",
    icon: <Icon as={MdBarChart} width='20px' height='20px' color='inherit' />,
    path: "/data-tables",
    component: DataTables,
  },
  {
    name: "Profile",
    layout: "/admin",
    path: "/profile/:id",
    icon: <Icon as={MdPerson} width='20px' height='20px' color='inherit' />,
    component: Profile,
  },
 
  {
    name: "RTL Admin",
    layout: "/rtl",
    path: "/rtl-default",
    icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
    component: RTL,
  },
];

export default routes;
