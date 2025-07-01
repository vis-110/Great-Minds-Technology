import React, { useEffect, useState, useMemo } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Divider,
  Box,
  Typography,
} from "@mui/material";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import SettingsInputAntennaIcon from "@mui/icons-material/SettingsInputAntenna";
import TaskIcon from "@mui/icons-material/Task";
import InterpreterModeIcon from "@mui/icons-material/InterpreterMode"
import FreeCancellationIcon from "@mui/icons-material/FreeCancellation";
import SpeedIcon from "@mui/icons-material/Speed";
import { CgDarkMode } from "react-icons/cg";
import CastForEducationIcon from "@mui/icons-material/CastForEducation";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import LayersIcon from "@mui/icons-material/Layers";
import LogoutIcon from "@mui/icons-material/Logout";
import "./Sidebar2.css";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { MdOutlineDarkMode } from "react-icons/md";
import LOGO_BLACK from "../assets/LOGO[BLACK].png";
import LOGO_WHITE from "../assets/Logo_WHITE.png";
export default function CustomSideBar({ window }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const role = localStorage.getItem("role")?.toLowerCase() || "";
  console.log("Current role:", role);

  const handleLogout = () => {
    console.log("Logout triggered, clearing storage and navigating to /Login");
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    document.title = "Great Minds Technology";
  }, []);

  const allNavItems = [
    {
      kind: "header",
      title: 
      role==="vendor" ? "Vendor Dashboard" :
      role==="student"? "Student Dashboard" :
      role==="trainer" ? "Trainer Dashboard" :
      role=== "admin" ? "Admin Dashboard" : "Dashboard",
      allowedRoles: ["admin", "trainer", "student", "vendor"],
    },
    // Student Dashboard
    {
      segment: "", // Maps to /dashboard (index route)
      title: "Dashboard",
      icon: <LibraryBooksIcon />,
      allowedRoles: ["student"],
    },

    {
      segment: "admin", 
      title: "Dashboard",
      icon: <LibraryBooksIcon />,
      allowedRoles: ["admin"],
    },
    {
      segment: "admin/students",
      title: "Student",
      icon: <SettingsInputAntennaIcon />,
      allowedRoles: ["admin"],
    },
    {
      segment: "admin/trainer",
      title: "Trainer Approval",
      icon: <TaskIcon />,
      allowedRoles: ["admin"],
    },
    {
      segment: 'admin/vendor',
      title: 'Vendor Approval',
      icon: <InterpreterModeIcon />,
      allowedRoles: ["admin"],
    },
    // Trainer Dashboard
    {
      segment: "trainer", // Maps to /dashboard/trainer
      title: "Dashboard",
      icon: <LibraryBooksIcon />,
      allowedRoles: ["trainer"],
    },
    {
      segment: "admin/courselist",
      title: "Courses",
      icon: <SettingsInputAntennaIcon />,
      allowedRoles: ["admin"],
    },
    {
      segment: 'coursecreation',
      title: 'Add Course',
      icon: <LibraryBooksIcon />,
      allowedRoles: ['trainer'],
    },
    // Vendor Dashboard
    {
      segment: "vendor", // Maps to /dashboard/vendor
      title: "Vendor Profile",
      icon: <InterpreterModeIcon />,
      allowedRoles: ["vendor"],
    },
    {
      segment: "vendor/internships-and-events", // Fixed: Added "vendor/" prefix to match the route in App.jsx
      title: "Internships And Events",
      icon: <InterpreterModeIcon />,
      allowedRoles: ["vendor"],
    },
    {
      segment: "certification",
      title: "Certification",
      icon: <FreeCancellationIcon />,
      allowedRoles: ["student"],
    },
    {
      kind: "divider",
      allowedRoles: ["admin", "trainer", "student", "vendor"],
    },
    {
      key: "logout",
      title: "Logout",
      icon: <LogoutIcon />,
      onClick: handleLogout,
      allowedRoles: ["admin", "trainer", "student", "vendor"],
    },
  ];

  // Filter nav items by role
  const navItems = useMemo(() => {
    const filterByRole = (items) =>
      items
        .filter(
          (item) => !item.allowedRoles || item.allowedRoles.includes(role)
        )
        .map((item) =>
          item.children
            ? { ...item, children: filterByRole(item.children) }
            : item
        );
    return filterByRole(allNavItems);
  }, [role]);

  const container = window ? window().document.body : undefined;

  const [themeMode, setThemeMode] = useState("light");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeMode,
        },
      }),
    [themeMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          backgroundColor: themeMode === "light" ? "white" : "black",
        }}
      >
        <Drawer
          container={container}
          variant="permanent"
          sx={{
            width: 300,
            flexShrink: 0,
            "& .MuiDrawer-paper": { width: 300, boxSizing: "border-box" },
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <img
              src={themeMode === "light" ? LOGO_BLACK : LOGO_WHITE}
              alt="Great Minds Technology Logo"
              style={{ maxWidth: "50%", height: "auto" }}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <IconButton
              onClick={() => {
                const newTheme = themeMode === "light" ? "dark" : "light";
                setThemeMode(newTheme);
                console.log("Switched theme to:", newTheme);
              }}
            >
              <Badge color="secondary">
                <MdOutlineDarkMode />
              </Badge>
            </IconButton>
          </Box>
          <List>
            {navItems.map((item, index) => {
              if (item.kind === "header") {
                return <ListSubheader key={index}>{item.title}</ListSubheader>;
              }
              if (item.kind === "divider") {
                return <Divider key={index} />;
              }
              if (item.children) {
                return (
                  <React.Fragment key={item.segment}>
                    <ListItem
                      button
                      onClick={() => {
                        console.log(
                          "Navigating to:",
                          `/dashboard/${item.segment}`
                        );
                        navigate(`/dashboard/${item.segment}`);
                      }}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.title} />
                    </ListItem>
                    <List component="div" disablePadding>
                      {item.children.map((child) => (
                        <ListItem
                          button
                          key={child.segment}
                          sx={{ pl: 4 }}
                          onClick={() => {
                            console.log(
                              "Navigating to:",
                              `/dashboard/${item.segment}/${child.segment}`
                            );
                            navigate(
                              `/dashboard/${item.segment}/${child.segment}`
                            );
                          }}
                        >
                          <ListItemIcon>{child.icon}</ListItemIcon>
                          <ListItemText primary={child.title} />
                        </ListItem>
                      ))}
                    </List>
                  </React.Fragment>
                );
              }
              return (
                <ListItem
                  button
                  key={item.segment || item.key}
                  onClick={
                    item.onClick ||
                    (() => {
                      console.log("Navigating to:", `/dashboard/${item.segment}`);
                      navigate(`/dashboard/${item.segment}`);
                    })
                  }
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.title} />
                </ListItem>
              );
            })}
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
