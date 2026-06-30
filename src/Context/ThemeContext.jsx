// import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material";
// import { createContext, useContext, useEffect, useMemo, useState } from "react";
// import KhmerBg  from "../assets/Image/khmer-bg.png"; // Make sure to have this image in the specified path
// const ThemeContext = createContext();
// export const useThemeContext = () => {
//   const context = useContext(ThemeContext);
//   if (!context) {
//     throw new Error("useThemeContext must be used within ThemeProvider");
//   }
//   return context;
// };
// export const ThemeProvider = ({ children }) => {
//   const [mode, setMode] = useState(() => {
//     return localStorage.getItem("themeMode") || "light";
//   });
//   const [primaryColor, setPrimaryColor] = useState(() => {
//     return localStorage.getItem("primaryColor") || "#1976d2";
//   });
//   const [sidebarColor, setSidebarColor] = useState(() => {
//     return localStorage.getItem("sidebarColor") || "#1e293b";
//   });
//   const [layoutMode, setLayoutMode] = useState(() => {
//     return localStorage.getItem("layoutMode") || "default";
//   });
//   const [topbarColor, setTopbarColor] = useState(() => {
//     return localStorage.getItem("topbarColor") || "#1E293B";
//   });
//   const [fontSize, setFontSize] = useState(() => {
//     return localStorage.getItem("fontSize") || "medium";
//   });
//   const [mobileDrawerWidth, setMobileDrawerWidth] = useState(() => {
//     return Number(localStorage.getItem("mobileDrawerWidth")) || 280;
//   });
//   const [mobileShowLabels, setMobileShowLabels] = useState(() => {
//     const v = localStorage.getItem("mobileShowLabels");
//     return v === null ? true : v === "true";
//   });
//   // Persist settings
//   useEffect(() => {
//     localStorage.setItem("themeMode", mode);
//   }, [mode]);
//   useEffect(() => {
//     localStorage.setItem("primaryColor", primaryColor);
//   }, [primaryColor]);
//   useEffect(() => {
//     localStorage.setItem("sidebarColor", sidebarColor);
//   }, [sidebarColor]);
//   useEffect(() => {
//     localStorage.setItem("layoutMode", layoutMode);
//   }, [layoutMode]);
//   useEffect(() => {
//     localStorage.setItem("topbarColor", topbarColor);
//   }, [topbarColor]);
//   useEffect(() => {
//     localStorage.setItem("fontSize", fontSize);
//   }, [fontSize]);
//   useEffect(() => {
//     localStorage.setItem("mobileDrawerWidth", String(mobileDrawerWidth));
//   }, [mobileDrawerWidth]);
//   useEffect(() => {
//     localStorage.setItem("mobileShowLabels", String(mobileShowLabels));
//   }, [mobileShowLabels]);
//   const toggleColorMode = (newMode) => {
//     if (newMode) {
//       setMode(newMode);
//     } else {
//       setMode((prevMode) => {
//         if (prevMode === "light") return "dark";
//         if (prevMode === "dark") return "glass";
//         return "light";
//       });
//     }
//   };
//   const resetSettings = () => {
//     setMode("light");
//     setPrimaryColor("#1976d2");
//     setSidebarColor("#1e293b");
//     setLayoutMode("default");
//     setTopbarColor("#ffffff");
//     setFontSize("medium");
//     setMobileDrawerWidth(280);
//     setMobileShowLabels(true);
//     localStorage.removeItem("themeMode");
//     localStorage.removeItem("primaryColor");
//     localStorage.removeItem("sidebarColor");
//     localStorage.removeItem("layoutMode");
//     localStorage.removeItem("topbarColor");
//     localStorage.removeItem("fontSize");
//     localStorage.removeItem("mobileDrawerWidth");
//     localStorage.removeItem("mobileShowLabels");
//   };
//   // Inject global CSS for Khmer New Year starry night background
// // useEffect(() => {
// //     if (mode === "khmerNewYear") {
// //       document.body.classList.add("khmer-new-year-mode");
// //       if (!document.getElementById("khmer-pattern-style")) {
// //         const style = document.createElement("style");
// //         style.id = "khmer-pattern-style";
// //         style.textContent = `
// //           /* Starry night background for Khmer New Year mode */
// //           body.khmer-new-year-mode {
// //             background: radial-gradient(ellipse at bottom, #0d1d31 0%, #0c0d13 100%);
// //             background-attachment: fixed;
// //             position: relative;
// //           }
// //           /* Stars - fixed and animated */
// //           body.khmer-new-year-mode::before {
// //             content: '';
// //             position: fixed;
// //             top: 0;
// //             left: 0;
// //             width: 100%;
// //             height: 100%;
// //             pointer-events: none;
// //             background: transparent;
// //             background-image: 
// //               radial-gradient(2px 2px at 20px 30px, #fff, rgba(0,0,0,0)),
// //               radial-gradient(1px 1px at 40px 70px, #fff, rgba(0,0,0,0)),
// //               radial-gradient(1px 1px at 150px 120px, #ffd700, rgba(0,0,0,0)),
// //               radial-gradient(3px 3px at 250px 350px, #fff, rgba(0,0,0,0)),
// //               radial-gradient(2px 2px at 400px 50px, #ffd700, rgba(0,0,0,0)),
// //               radial-gradient(1px 1px at 500px 200px, #fff, rgba(0,0,0,0)),
// //               radial-gradient(2px 2px at 650px 450px, #fff, rgba(0,0,0,0)),
// //               radial-gradient(1px 1px at 800px 100px, #ffd700, rgba(0,0,0,0)),
// //               radial-gradient(2px 2px at 950px 300px, #fff, rgba(0,0,0,0)),
// //               radial-gradient(3px 3px at 1100px 500px, #fff, rgba(0,0,0,0)),
// //               radial-gradient(1px 1px at 1250px 80px, #ffd700, rgba(0,0,0,0)),
// //               radial-gradient(2px 2px at 1400px 400px, #fff, rgba(0,0,0,0)),
// //               radial-gradient(1px 1px at 1550px 250px, #fff, rgba(0,0,0,0));
// //             background-repeat: no-repeat;
// //             background-size: 200px 200px;
// //             opacity: 0.8;
// //             animation: twinkle 4s infinite alternate;
// //           }
// //           @keyframes twinkle {
// //             0% { opacity: 0.6; }
// //             100% { opacity: 1; }
// //           }
// //           /* Additional decorative elements: Khmer pattern overlay */
// //           body.khmer-new-year-mode::after {
// //             content: '';
// //             position: fixed;
// //             top: 0;
// //             left: 0;
// //             width: 100%;
// //             height: 100%;
// //             pointer-events: none;
// //             background-image: repeating-linear-gradient(45deg, rgba(255, 179, 0, 0.03) 0px, rgba(255, 179, 0, 0.03) 2px, transparent 2px, transparent 8px);
// //             background-attachment: fixed;
// //           }
// //           /* Cards get a subtle glow and gold border */
// //           .khmer-new-year-mode .MuiCard-root {
// //             border-left: 4px solid #FFB300;
// //             border-bottom: 2px solid #FFB300;
// //             box-shadow: 0 8px 20px rgba(0,0,0,0.4);
// //           }
// //           /* Buttons with festive gradient */
// //           .khmer-new-year-mode .MuiButton-containedPrimary {
// //             background: linear-gradient(135deg, #C62828 0%, #FFB300 100%) !important;
// //           }
// //           /* Scrollbar */
// //           .khmer-new-year-mode ::-webkit-scrollbar-track {
// //             background: #1e293b;
// //           }
// //           .khmer-new-year-mode ::-webkit-scrollbar-thumb {
// //             background: #FFB300;
// //           }
// //         `;
// //         document.head.appendChild(style);
// //       }
// //     } else {
// //       document.body.classList.remove("khmer-new-year-mode");
// //     }
// //   }, [mode]);
// useEffect(() => {
//   if (mode === "khmerNewYear") {
//     document.body.classList.add("khmer-new-year-mode");
//     if (!document.getElementById("khmer-pattern-style")) {
//       const style = document.createElement("style");
//       style.id = "khmer-pattern-style";
//       style.textContent = `
//         body.khmer-new-year-mode {
//           // background: linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url(${KhmerBg});
//           background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${KhmerBg});
//           background-size: cover;
//           background-repeat: no-repeat;
//           background-position: center;
//           background-attachment: fixed;
//           background-color: #0c0d13;
//         }
//         /* Stars - fixed and animated */
//         body.khmer-new-year-mode::before {
//           content: '';
//           position: fixed;
//           top: 0;
//           left: 0;
//           width: 100%;
//           height: 100%;
//           pointer-events: none;
//           background: transparent;
//           background-image: 
//             radial-gradient(2px 2px at 20px 30px, #fff, rgba(0,0,0,0)),
//             radial-gradient(1px 1px at 40px 70px, #fff, rgba(0,0,0,0)),
//             radial-gradient(1px 1px at 150px 120px, #ffd700, rgba(0,0,0,0)),
//             radial-gradient(3px 3px at 250px 350px, #fff, rgba(0,0,0,0)),
//             radial-gradient(2px 2px at 400px 50px, #ffd700, rgba(0,0,0,0)),
//             radial-gradient(1px 1px at 500px 200px, #fff, rgba(0,0,0,0)),
//             radial-gradient(2px 2px at 650px 450px, #fff, rgba(0,0,0,0)),
//             radial-gradient(1px 1px at 800px 100px, #ffd700, rgba(0,0,0,0)),
//             radial-gradient(2px 2px at 950px 300px, #fff, rgba(0,0,0,0)),
//             radial-gradient(3px 3px at 1100px 500px, #fff, rgba(0,0,0,0)),
//             radial-gradient(1px 1px at 1250px 80px, #ffd700, rgba(0,0,0,0)),
//             radial-gradient(2px 2px at 1400px 400px, #fff, rgba(0,0,0,0)),
//             radial-gradient(1px 1px at 1550px 250px, #fff, rgba(0,0,0,0));
//           background-repeat: no-repeat;
//           background-size: 200px 200px;
//           opacity: 0.8;
//           animation: twinkle 4s infinite alternate;
//         }
//         @keyframes twinkle {
//           0% { opacity: 0.6; }
//           100% { opacity: 1; }
//         }
//         /* Gold pattern overlay */
//         body.khmer-new-year-mode::after {
//           content: '';
//           position: fixed;
//           top: 0;
//           left: 0;
//           width: 100%;
//           height: 100%;
//           pointer-events: none;
//           background-image: repeating-linear-gradient(45deg, rgba(255, 179, 0, 0.03) 0px, rgba(255, 179, 0, 0.03) 2px, transparent 2px, transparent 8px);
//           background-attachment: fixed;
//         }
//         /* Card, button, scrollbar styles */
//         .khmer-new-year-mode .MuiCard-root {
//           border-left: 4px solid #FFB300;
//           border-bottom: 2px solid #FFB300;
//           box-shadow: 0 8px 20px rgba(0,0,0,0.4);
//         }
//         .khmer-new-year-mode .MuiButton-containedPrimary {
//           background: linear-gradient(135deg, #C62828 0%, #FFB300 100%) !important;
//         }
//         .khmer-new-year-mode ::-webkit-scrollbar-track {
//           background: #1e293b;
//         }
//         .khmer-new-year-mode ::-webkit-scrollbar-thumb {
//           background: #FFB300;
//         }
//       `;
//       document.head.appendChild(style);
//     }
//   } else {
//     document.body.classList.remove("khmer-new-year-mode");
//   }
// }, [mode]);
//   const theme = useMemo(() => {
//     const isKhmerNewYear = mode === "khmerNewYear";
//     const baseMode = isKhmerNewYear ? "dark" : mode === "glass" ? "dark" : mode;
//     const isGlass = mode === "glass";
//     let effectivePrimary = primaryColor;
//     let effectiveSecondary = "#6b7280";
//     if (isKhmerNewYear) {
//       effectivePrimary = "#C62828";   // festive red
//       effectiveSecondary = "#FFB300"; // gold
//     }
//     return createTheme({
//       palette: {
//         mode: baseMode,
//         primary: {
//           main: effectivePrimary,
//           light: isKhmerNewYear ? "#E57373" : baseMode === "dark" ? "#e0f2fe" : "#e3f2fd",
//           dark: isKhmerNewYear ? "#B71C1C" : baseMode === "dark" ? "#0c4a6e" : "#1565c0",
//         },
//         secondary: {
//           main: effectiveSecondary,
//         },
//         background: {
//           default: isKhmerNewYear
//             ? "#0c0d13"   // dark night
//             : isGlass
//             ? "rgba(15, 23, 42, 0.8)"
//             : baseMode === "dark"
//             ? "#0f172a"
//             : "#E2E8F0",
//           paper: isKhmerNewYear
//             ? "rgba(13, 17, 23, 0.85)"    
//             : isGlass
//             ? "rgba(30, 41, 59, 0.7)"
//             : baseMode === "dark"
//             ? "#1e293b"
//             : "#ffffff",
//         },
//         text: {
//           primary: isKhmerNewYear ? "#f8fafc" : baseMode === "dark" ? "#f1f5f9" : "#1e293b",
//           secondary: isKhmerNewYear ? "#FFB300" : baseMode === "dark" ? "#94a3b8" : "#64748b",
//         },
//         divider: isKhmerNewYear
//           ? "rgba(255, 179, 0, 0.2)"
//           : baseMode === "dark"
//           ? "rgba(255, 255, 255, 0.1)"
//           : "rgba(0, 0, 0, 0.12)",
//       },
//       typography: {
//         fontFamily: ["Siemreap", "Arial", "sans-serif"].join(","),
//         fontSize: fontSize === "small" ? 12 : fontSize === "large" ? 16 : 14,
//         h1: { color: isKhmerNewYear ? "#FFB300" : baseMode === "dark" ? "#EBEDEF" : "#1e293b" },
//         h2: { color: isKhmerNewYear ? "#FFB300" : baseMode === "dark" ? "#EBEDEF" : "#1e293b" },
//         h3: { color: isKhmerNewYear ? "#FFB300" : baseMode === "dark" ? "#EBEDEF" : "#1e293b" },
//         h4: { color: isKhmerNewYear ? "#FFB300" : baseMode === "dark" ? "#EBEDEF" : "#1e293b" },
//         h5: { color: isKhmerNewYear ? "#FFB300" : baseMode === "dark" ? "#EBEDEF" : "#1e293b" },
//         h6: { color: isKhmerNewYear ? "#FFB300" : baseMode === "dark" ? "#EBEDEF" : "#1e293b" },
//         body1: { color: isKhmerNewYear ? "#e2e8f0" : baseMode === "dark" ? "#e2e8f0" : "#374151" },
//         body2: { color: isKhmerNewYear ? "#cbd5e1" : baseMode === "dark" ? "#cbd5e1" : "#6b7280" },
//       },
//       components: {
//         MuiAppBar: {
//           styleOverrides: {
//             root: {
//               backgroundColor: isKhmerNewYear
//                 ? "#C62828"
//                 : isGlass
//                 ? "rgba(30, 41, 59, 0.7)"
//                 : baseMode === "dark"
//                 ? topbarColor
//                 : "#ffffff",
//               backgroundImage: isKhmerNewYear
//                 ? "linear-gradient(90deg, #C62828 0%, #FFB300 100%)"
//                 : "none",
//               color: isKhmerNewYear ? "#ffffff" : baseMode === "dark" ? "#f1f5f9" : "#1e293b",
//               boxShadow:
//                 baseMode === "dark" || isKhmerNewYear
//                   ? "0 1px 3px 0 rgba(0, 0, 0, 0.5)"
//                   : "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
//               ...(isGlass && {
//                 backdropFilter: "blur(10px)",
//                 WebkitBackdropFilter: "blur(10px)",
//               }),
//             },
//           },
//         },
//         MuiDrawer: {
//           styleOverrides: {
//             paper: {
//               backgroundColor: isKhmerNewYear
//                 ? "rgba(13, 17, 23, 0.95)"
//                 : isGlass
//                 ? "rgba(30, 41, 59, 0.7)"
//                 : baseMode === "dark"
//                 ? sidebarColor
//                 : "#ffffff",
//               color: isKhmerNewYear ? "#f8fafc" : baseMode === "dark" ? "#f1f5f9" : "#1e293b",
//               borderRight: isKhmerNewYear ? "2px solid #FFB300" : "none",
//               ...(isGlass && {
//                 backdropFilter: "blur(10px)",
//                 WebkitBackdropFilter: "blur(10px)",
//               }),
//             },
//           },
//         },
//         MuiCard: {
//           styleOverrides: {
//             root: {
//               backgroundColor: isKhmerNewYear
//                 ? "rgba(13, 17, 23, 0.85)"
//                 : isGlass
//                 ? "rgba(30, 41, 59, 0.55)"
//                 : baseMode === "dark"
//                 ? "#1e293b"
//                 : "#ffffff",
//               backgroundImage: "none",
//               boxShadow: isGlass
//                 ? "0 8px 32px rgba(0, 0, 0, 0.25)"
//                 : baseMode === "dark"
//                 ? "0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)"
//                 : "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
//               border: isGlass
//                 ? "1px solid rgba(255, 255, 255, 0.15)"
//                 : isKhmerNewYear
//                 ? "1px solid rgba(255, 179, 0, 0.3)"
//                 : baseMode === "dark"
//                 ? "1px solid rgba(255, 255, 255, 0.05)"
//                 : "none",
//               transition: "all 0.3s ease-in-out",
//               ...(isGlass && {
//                 backdropFilter: "blur(16px) saturate(180%)",
//                 WebkitBackdropFilter: "blur(16px) saturate(180%)",
//               }),
//             },
//           },
//         },
//         MuiPaper: {
//           styleOverrides: {
//             root: {
//               backgroundImage: "none",
//               boxShadow: "none",
//               border:
//                 baseMode === "dark"
//                   ? "1.5px solid rgba(255, 255, 255, 0.08)"
//                   : "1.5px solid rgba(0, 0, 0, 0.05)",
//               ...(isGlass && {
//                 backgroundColor: "rgba(30, 41, 59, 0.55)",
//                 backdropFilter: "blur(16px) saturate(180%)",
//                 WebkitBackdropFilter: "blur(16px) saturate(180%)",
//                 border: "1px solid rgba(255, 255, 255, 0.15)",
//                 boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
//                 transition: "all 0.3s ease-in-out",
//               }),
//             },
//           },
//         },
//         MuiMenu: {
//           styleOverrides: {
//             paper: {
//               boxShadow: "none",
//               padding: 5,
//               border:
//                 baseMode === "dark"
//                   ? "1px solid rgba(255,255,255,0.12)"
//                   : "1px solid rgba(0,0,0,0.12)",
//               borderRadius: 10,
//               maxHeight: 300,
//               overflowY: "auto",
//               scrollbarWidth: "thin",
//               scrollbarColor:
//                 baseMode === "dark"
//                   ? "rgba(255,255,255,0.3) transparent"
//                   : "rgba(0,0,0,0.3) transparent",
//               ...(isGlass && {
//                 backgroundColor: "rgba(30, 41, 59, 0.7)",
//                 backdropFilter: "blur(10px)",
//                 WebkitBackdropFilter: "blur(10px)",
//               }),
//             },
//             list: {
//               borderRadius: 10,
//               overflow: "hidden",
//             },
//           },
//         },
//         MuiMenuItem: {
//           styleOverrides: {
//             root: {
//               borderRadius: 5,
//               margin: "2px 4px",
//             },
//           },
//         },
//         MuiPopover: {
//           styleOverrides: {
//             paper: {
//               boxShadow: "none",
//               ...(isGlass && {
//                 backgroundColor: "rgba(30, 41, 59, 0.7)",
//                 backdropFilter: "blur(10px)",
//                 WebkitBackdropFilter: "blur(10px)",
//               }),
//             },
//           },
//         },
//         MuiAutocomplete: {
//           styleOverrides: {
//             paper: {
//               padding: 5,
//               border:
//                 baseMode === "dark"
//                   ? "1px solid rgba(255,255,255,0.12)"
//                   : "1px solid rgba(0,0,0,0.12)",
//               borderRadius: 10,
//               maxHeight: 300,
//               overflowY: "auto",
//               marginTop: 6,
//               scrollbarWidth: "thin",
//               scrollbarColor:
//                 baseMode === "dark"
//                   ? "rgba(255,255,255,0.3) transparent"
//                   : "rgba(0,0,0,0.3) transparent",
//               ...(isGlass && {
//                 backgroundColor: "rgba(30, 41, 59, 0.7)",
//                 backdropFilter: "blur(10px)",
//                 WebkitBackdropFilter: "blur(10px)",
//               }),
//             },
//             listbox: {
//               borderRadius: 10,
//               padding: "4px",
//               maxHeight: "none",
//             },
//             option: {
//               borderRadius: 5,
//               margin: "2px 4px",
//               padding: "8px 12px",
//               '&[aria-selected="true"]': {
//                 backgroundColor:
//                   baseMode === "dark"
//                     ? "rgba(255,255,255,0.08)"
//                     : "rgba(0,0,0,0.06)",
//               },
//               "&:hover": {
//                 backgroundColor:
//                   baseMode === "dark"
//                     ? "rgba(255,255,255,0.05)"
//                     : "rgba(0,0,0,0.04)",
//               },
//             },
//           },
//         },
//         MuiButton: {
//           styleOverrides: {
//             root: {
//               textTransform: "none",
//               borderRadius: 8,
//               color: isKhmerNewYear ? "#f8fafc" : baseMode === "dark" ? "#f1f5f9" : "#1e293b",
//             },
//             contained: {
//               boxShadow: "none",
//               border:
//                 baseMode === "dark"
//                   ? "1.5px solid rgba(255, 255, 255, 0.16)"
//                   : "none",
//               color: isKhmerNewYear ? "#ffffff" : baseMode === "dark" ? "#f1f5f9" : "#ffffff",
//               "&:hover": {
//                 boxShadow: "none",
//               },
//             },
//           },
//         },
//         MuiSwitch: {
//           styleOverrides: {
//             switchBase: {
//               color: baseMode === "dark" ? "#94a3b8" : "#d1d5db",
//             },
//             track: {
//               backgroundColor: baseMode === "dark" ? "#475569" : "#9ca3af",
//             },
//           },
//         },
//         MuiTextField: {
//           styleOverrides: {
//             root: {
//               "& .MuiOutlinedInput-root": {
//                 backgroundColor:
//                   baseMode === "dark" || isKhmerNewYear ? "rgba(15, 23, 42, 0.5)" : "#ffffff",
//                 "&:hover fieldset": {
//                   borderColor: baseMode === "dark" ? "#475569" : "#d1d5db",
//                 },
//                 "&.Mui-focused fieldset": {
//                   borderColor: effectivePrimary,
//                 },
//               },
//             },
//           },
//         },
//         MuiDivider: {
//           styleOverrides: {
//             root: {
//               borderColor:
//                 baseMode === "dark"
//                   ? "rgba(255, 255, 255, 0.1)"
//                   : "rgba(0, 0, 0, 0.12)",
//             },
//           },
//         },
//         MuiTableContainer: {
//           styleOverrides: {
//             root: {
//               borderRadius: "12px",
//               overflowX: "auto",
//               background: "transparent",
//               boxShadow: "none",
//               border:
//                 baseMode === "dark"
//                   ? "1px solid rgba(255,255,255,0.12)"
//                   : "1px solid rgba(0,0,0,0.12)",
//               ...(isGlass && {
//                 backgroundColor: "rgba(30, 41, 59, 0.55)",
//                 backdropFilter: "blur(16px) saturate(180%)",
//                 WebkitBackdropFilter: "blur(16px) saturate(180%)",
//                 border: "1px solid rgba(255, 255, 255, 0.15)",
//                 boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
//               }),
//               "@media (max-width:600px)": {
//                 borderRadius: "8px",
//               },
//             },
//           },
//         },
//         MuiTable: {
//           styleOverrides: {
//             root: {
//               borderCollapse: "separate",
//               borderSpacing: "0 2px",
//               fontFamily: '"Khmer OS Siemreap", sans-serif',
//               backgroundColor: "transparent",
//               padding: 5,
//               "@media (max-width:600px)": {
//                 borderSpacing: "0 1px",
//               },
//             },
//           },
//         },
//         MuiTableHead: {
//           styleOverrides: {
//             root: {
//               "& .MuiTableCell-head": {
//                 fontWeight: 600,
//                 fontSize: "16px",
//                 color: baseMode === "dark" ? "#e2e8f0" : "#374151",
//                 border: "none",
//                 backgroundColor: "transparent",
//                 "@media (max-width:600px)": {
//                   fontSize: "14px",
//                 },
//               },
//             },
//           },
//         },
//         MuiTableBody: {
//           styleOverrides: {
//             root: {
//               "& .MuiTableRow-root": {
//                 backgroundColor: isGlass
//                   ? "rgba(30, 41, 59, 0.55)"
//                   : baseMode === "dark"
//                   ? "#1e293b"
//                   : "#ffffff",
//                 transition: "all 0.25s ease-in-out",
//                 "&:hover": {
//                   backgroundColor: isGlass
//                     ? "rgba(55, 65, 81, 0.65)"
//                     : baseMode === "dark"
//                     ? "#374151"
//                     : "#f1f5f9",
//                   boxShadow: isGlass ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
//                 },
//                 "& .MuiTableCell-root:first-of-type": {
//                   borderTopLeftRadius: 6,
//                   borderBottomLeftRadius: 6,
//                 },
//                 "& .MuiTableCell-root:last-of-type": {
//                   borderTopRightRadius: 6,
//                   borderBottomRightRadius: 6,
//                 },
//                 ...(isGlass && {
//                   backdropFilter: "blur(8px)",
//                   WebkitBackdropFilter: "blur(8px)",
//                   border: "1px solid rgba(255,255,255,0.1)",
//                 }),
//               },
//             },
//           },
//         },
//         MuiTableCell: {
//           styleOverrides: {
//             root: {
//               padding: "12px 16px",
//               verticalAlign: "middle",
//               fontSize: "15px",
//               color: baseMode === "dark" ? "#e2e8f0" : "#111827",
//               "@media (max-width:900px)": {
//                 padding: "10px 12px",
//                 fontSize: "14px",
//               },
//               "@media (max-width:600px)": {
//                 padding: "8px 10px",
//                 fontSize: "13px",
//                 whiteSpace: "nowrap",
//               },
//             },
//             head: {
//               borderBottom: `2px solid ${baseMode === "dark" ? "#475569" : "#d1d5db"}`,
//               fontWeight: 600,
//               fontSize: "16px",
//               "@media (max-width:600px)": {
//                 fontSize: "14px",
//               },
//             },
//             body: {
//               borderBottom: `1px solid ${baseMode === "dark" ? "#475569" : "#d1d5db"}`,
//             },
//           },
//         },
//         MuiTablePagination: {
//           styleOverrides: {
//             root: {
//               color: baseMode === "dark" ? "#e2e8f0" : "#374151",
//               backgroundColor: isGlass
//                 ? "rgba(30, 41, 59, 0.55)"
//                 : baseMode === "dark"
//                 ? "#1e293b"
//                 : "#ffffff",
//               borderTop:
//                 baseMode === "dark"
//                   ? "1px solid rgba(255, 255, 255, 0.1)"
//                   : "1px solid rgba(0, 0, 0, 0.12)",
//               "@media (max-width:600px)": {
//                 fontSize: "13px",
//               },
//               ...(isGlass && {
//                 backdropFilter: "blur(12px) saturate(160%)",
//                 WebkitBackdropFilter: "blur(12px) saturate(160%)",
//                 border: "1px solid rgba(255,255,255,0.12)",
//               }),
//             },
//             toolbar: {
//               "@media (max-width:600px)": {
//                 flexWrap: "wrap",
//                 justifyContent: "center",
//               },
//             },
//             actions: {
//               "& .MuiIconButton-root": {
//                 color: baseMode === "dark" ? "#e2e8f0" : "#374151",
//               },
//             },
//           },
//         },
//         MuiChip: {
//           styleOverrides: {
//             root: {
//               fontWeight: 500,
//               borderRadius: "6px",
//               fontSize: "0.75rem",
//               "&.MuiCilled-colorSuccess": {
//                 borderColor: "#265073",
//                 color: "#2D9596",
//                 backgroundColor:
//                   baseMode === "dark"
//                     ? "rgba(45, 149, 150, 0.1)"
//                     : "rgba(45, 149, 150, 0.1)",
//               },
//               "&.MuiChip-colorError": {
//                 borderColor: "#ef4444",
//                 color: "#ef4444",
//                 backgroundColor:
//                   baseMode === "dark"
//                     ? "rgba(239, 68, 68, 0.1)"
//                     : "rgba(239, 68, 68, 0.1)",
//               },
//             },
//           },
//         },
//         MuiDialog: {
//           styleOverrides: {
//             paper: {
//               ...(isGlass && {
//                 backgroundColor: "rgba(30, 41, 59, 0.7)",
//                 backdropFilter: "blur(10px)",
//                 WebkitBackdropFilter: "blur(10px)",
//               }),
//             },
//           },
//         },
//         MuiAlert: {
//           styleOverrides: {
//             root: {
//               ...(isGlass && {
//                 backgroundColor: "rgba(30, 41, 59, 0.7)",
//                 backdropFilter: "blur(10px)",
//                 WebkitBackdropFilter: "blur(10px)",
//               }),
//             },
//           },
//         },
//         MuiSnackbarContent: {
//           styleOverrides: {
//             root: {
//               ...(isGlass && {
//                 backgroundColor: "rgba(30, 41, 59, 0.7)",
//                 backdropFilter: "blur(10px)",
//                 WebkitBackdropFilter: "blur(10px)",
//               }),
//             },
//           },
//         },
//         MuiTooltip: {
//           styleOverrides: {
//             tooltip: {
//               ...(isGlass && {
//                 backgroundColor: "rgba(30, 41, 59, 0.8)",
//                 backdropFilter: "blur(10px)",
//                 WebkitBackdropFilter: "blur(10px)",
//               }),
//             },
//           },
//         },
//         MuiBackdrop: {
//           styleOverrides: {
//             root: {
//               ...(isGlass && {
//                 backgroundColor: "rgba(0, 0, 0, 0.5)",
//                 backdropFilter: "blur(3px)",
//                 WebkitBackdropFilter: "blur(3px)",
//               }),
//             },
//           },
//         },
//         MuiStepContent: {
//           styleOverrides: {
//             root: {
//               ...(isGlass && {
//                 backgroundColor: "rgba(30, 41, 59, 0.5)",
//                 backdropFilter: "blur(5px)",
//                 WebkitBackdropFilter: "blur(5px)",
//               }),
//             },
//           },
//         },
//       },
//       shape: {
//         borderRadius: 8,
//       },
//     });
//   }, [mode, primaryColor, sidebarColor, topbarColor, fontSize]);
//   const value = {
//     mode,
//     primaryColor,
//     sidebarColor,
//     layoutMode,
//     topbarColor,
//     fontSize,
//     mobileDrawerWidth,
//     mobileShowLabels,
//     toggleColorMode,
//     setPrimaryColor,
//     setSidebarColor,
//     setLayoutMode,
//     setTopbarColor,
//     setFontSize,
//     setMobileDrawerWidth,
//     setMobileShowLabels,
//     resetSettings,
//   };
//   return (
//     <ThemeContext.Provider value={value}>
//       <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
//     </ThemeContext.Provider>
//   );
// };
/* eslint-disable react/prop-types, react-refresh/only-export-components */
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext();

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useThemeContext must be used within ThemeProvider");
  return context;
};

// ─── Design Tokens ────────────────────────────────────────────────────────────
const tokens = {
  // GitHub/Vercel monochrome palette
  light: {
    bg:         "#ffffff",
    bgSubtle:   "#f6f8fa",
    bgMuted:    "#f0f2f5",
    surface:    "#ffffff",
    border:     "#d0d7de",
    borderSubtle: "#eaeef2",
    text:       "#1f2328",
    textMuted:  "#636c76",
    textSubtle: "#9198a1",
  },
  dark: {
    bg:         "#0d1117",
    bgSubtle:   "#161b22",
    bgMuted:    "#1c2128",
    surface:    "#161b22",
    border:     "#30363d",
    borderSubtle: "#21262d",
    text:       "#e6edf3",
    textMuted:  "#848d97",
    textSubtle: "#6e7681",
  },
  glass: {
    bg:         "rgba(13, 17, 23, 0.92)",
    bgSubtle:   "rgba(22, 27, 34, 0.85)",
    bgMuted:    "rgba(28, 33, 40, 0.8)",
    surface:    "rgba(22, 27, 34, 0.75)",
    border:     "rgba(48, 54, 61, 0.6)",
    borderSubtle: "rgba(33, 38, 45, 0.5)",
    text:       "#e6edf3",
    textMuted:  "#8b949e",
    textSubtle: "#6e7681",
  },
  crypto: {
    bg:         "#02070f",
    bgSubtle:   "#081025",
    bgMuted:    "#0f172a",
    surface:    "rgba(5, 13, 29, 0.94)",
    border:     "rgba(0, 255, 183, 0.18)",
    borderSubtle: "rgba(0, 255, 183, 0.10)",
    text:       "#e6f7ff",
    textMuted:  "#7ac7d4",
    textSubtle: "#4b6b8a",
  },
  khmer: {
    bg:         "#080a0f",
    bgSubtle:   "#0d1117",
    bgMuted:    "#111827",
    surface:    "rgba(13, 17, 23, 0.9)",
    border:     "rgba(230, 160, 40, 0.25)",
    borderSubtle: "rgba(230, 160, 40, 0.12)",
    text:       "#f0f6fc",
    textMuted:  "#e6a028",
    textSubtle: "#a8854a",
  },
};

// ─── Global CSS injector ───────────────────────────────────────────────────────
const injectBaseStyles = () => {
  if (document.getElementById("theme-base-styles")) return;
  const style = document.createElement("style");
  style.id = "theme-base-styles";
  style.textContent = `
    *, *::before, *::after { box-sizing: border-box; }

    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* ── Scrollbar ── */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(127,127,127,0.25); border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(127,127,127,0.4); }

    /* ── Light mode ── */
    body.theme-light {
      background-color: #f6f8fa;
      color: #1f2328;
    }

    /* ── Dark mode ── */
    body.theme-dark {
      background-color: #0d1117;
      color: #e6edf3;
    }

    /* ── Glass mode ── */
    body.theme-glass {
      background: linear-gradient(135deg, #0d1117 0%, #161b22 50%, #0d1117 100%);
      background-attachment: fixed;
      color: #e6edf3;
    }
    body.theme-glass::before {
      content: '';
      position: fixed;
      inset: 0;
      pointer-events: none;
      background:
        radial-gradient(ellipse 80% 60% at 20% 0%, rgba(88,166,255,0.06) 0%, transparent 60%),
        radial-gradient(ellipse 60% 40% at 80% 100%, rgba(63,185,80,0.04) 0%, transparent 60%);
      z-index: 0;
    }

    /* ── Crypto trading mode ── */
    body.theme-crypto {
      background: radial-gradient(circle at top left, rgba(0, 255, 183, 0.12), transparent 20%),
                  radial-gradient(circle at bottom right, rgba(66, 153, 225, 0.15), transparent 20%),
                  linear-gradient(135deg, #02070f 0%, #031124 35%, #081f3b 100%);
      background-attachment: fixed;
      color: #e6f7ff;
    }
    body.theme-crypto::before {
      content: '';
      position: fixed;
      inset: 0;
      pointer-events: none;
      background-image:
        radial-gradient(circle at 20% 15%, rgba(0, 255, 183, 0.15), transparent 15%),
        radial-gradient(circle at 80% 25%, rgba(66, 153, 225, 0.12), transparent 18%),
        radial-gradient(circle at 50% 80%, rgba(84, 255, 206, 0.08), transparent 15%),
        radial-gradient(circle at 85% 75%, rgba(24, 144, 255, 0.06), transparent 14%);
      background-size: cover;
      opacity: 0.95;
      z-index: 0;
    }
    body.theme-crypto::after {
      content: '';
      position: fixed;
      inset: 0;
      pointer-events: none;
      background: repeating-linear-gradient(
        0deg,
        rgba(0,255,183,0.04) 0px,
        rgba(0,255,183,0.04) 1px,
        transparent 1px,
        transparent 8px
      );
      opacity: 0.35;
      z-index: 0;
    }

    /* Selection */
    ::selection { background: rgba(88,166,255,0.3); }
    body.theme-khmer ::selection { background: rgba(230,160,40,0.35); }
  `;
  document.head.appendChild(style);
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => localStorage.getItem("themeMode") || "dark");
  const [primaryColor, setPrimaryColor] = useState(() => localStorage.getItem("primaryColor") || "#0969da");
  const [sidebarColor, setSidebarColor] = useState(() => localStorage.getItem("sidebarColor") || "#161b22");
  const [layoutMode, setLayoutMode] = useState(() => localStorage.getItem("layoutMode") || "default");
  const [topbarColor, setTopbarColor] = useState(() => localStorage.getItem("topbarColor") || "#161b22");
  const [fontSize, setFontSize] = useState(() => localStorage.getItem("fontSize") || "medium");
  const [mobileDrawerWidth, setMobileDrawerWidth] = useState(() => Number(localStorage.getItem("mobileDrawerWidth")) || 280);
  const [mobileShowLabels, setMobileShowLabels] = useState(() => {
    const v = localStorage.getItem("mobileShowLabels");
    return v === null ? true : v === "true";
  });

  // Persist
  useEffect(() => { localStorage.setItem("themeMode",         mode);                    }, [mode]);
  useEffect(() => { localStorage.setItem("primaryColor",      primaryColor);             }, [primaryColor]);
  useEffect(() => { localStorage.setItem("sidebarColor",      sidebarColor);             }, [sidebarColor]);
  useEffect(() => { localStorage.setItem("layoutMode",        layoutMode);               }, [layoutMode]);
  useEffect(() => { localStorage.setItem("topbarColor",       topbarColor);              }, [topbarColor]);
  useEffect(() => { localStorage.setItem("fontSize",          fontSize);                 }, [fontSize]);
  useEffect(() => { localStorage.setItem("mobileDrawerWidth", String(mobileDrawerWidth));}, [mobileDrawerWidth]);
  useEffect(() => { localStorage.setItem("mobileShowLabels",  String(mobileShowLabels)); }, [mobileShowLabels]);

  // Apply body class + base styles
  useEffect(() => {
    injectBaseStyles();
    document.body.classList.remove("theme-light", "theme-dark", "theme-glass", "theme-crypto", "theme-khmer");
    const cls = mode === "khmerNewYear" ? "theme-khmer" : `theme-${mode}`;
    document.body.classList.add(cls);
  }, [mode]);

  const toggleColorMode = (newMode) => {
    if (newMode) { setMode(newMode); return; }
    setMode((prev) => {
      if (prev === "light") return "dark";
      if (prev === "dark")  return "glass";
      if (prev === "glass") return "crypto";
      if (prev === "crypto") return "khmerNewYear";
      return "light";
    });
  };

  const resetSettings = () => {
    setMode("dark");
    setPrimaryColor("#0969da");
    setSidebarColor("#161b22");
    setLayoutMode("default");
    setTopbarColor("#161b22");
    setFontSize("medium");
    setMobileDrawerWidth(280);
    setMobileShowLabels(true);
    ["themeMode","primaryColor","sidebarColor","layoutMode","topbarColor","fontSize","mobileDrawerWidth","mobileShowLabels"]
      .forEach((k) => localStorage.removeItem(k));
  };

  // ─── MUI Theme ──────────────────────────────────────────────────────────────
  const theme = useMemo(() => {
    const isKhmer  = mode === "khmerNewYear";
    const isGlass  = mode === "glass";
    const isCrypto = mode === "crypto";
    const isDark   = mode === "dark" || isGlass || isCrypto || isKhmer;
    const baseMode = isDark ? "dark" : "light";
    const t = isKhmer ? tokens.khmer : tokens[mode] || tokens.dark;

    // Accent colors
    const accent       = isKhmer ? "#e6a028" : primaryColor || "#0969da";
    const accentHover  = isKhmer ? "#f0b830" : primaryColor || "#0969da";
    const accentSubtle = isKhmer ? "rgba(230,160,40,0.12)" : isDark ? "rgba(88,166,255,0.1)" : "rgba(9,105,218,0.08)";

    // Font size scale (matches GitHub's density)
    const fontBase = fontSize === "small" ? 12 : fontSize === "large" ? 15 : 14;

    const radius = 6; // GitHub uses tighter radius than MUI default

    return createTheme({
      palette: {
        mode: baseMode,
        primary: {
          main:  accent,
          light: isKhmer ? "#f0b830" : isDark  ? "#58a6ff" : "#218bff",
          dark:  isKhmer ? "#c48820" : isDark  ? "#1f6feb" : "#0550ae",
          contrastText: isDark || isKhmer ? "#ffffff" : "#ffffff",
        },
        secondary: {
          main: isKhmer ? "#e6a028" : isDark ? "#3fb950" : "#1a7f37",
        },
        background: {
          default: t.bg,
          paper:   t.surface,
        },
        text: {
          primary:   t.text,
          secondary: t.textMuted,
          disabled:  t.textSubtle,
        },
        divider: t.border,
        action: {
          hover:    isDark ? "rgba(177,186,196,0.08)" : "rgba(208,215,222,0.32)",
          selected: isDark ? "rgba(177,186,196,0.12)" : "rgba(208,215,222,0.48)",
          focus:    isDark ? "rgba(177,186,196,0.12)" : "rgba(208,215,222,0.48)",
        },
        error:   { main: "#f85149", light: "#ff7b72", dark: "#da3633" },
        warning: { main: "#d29922", light: "#e3b341", dark: "#9e6a03" },
        success: { main: "#3fb950", light: "#56d364", dark: "#238636" },
        info:    { main: "#58a6ff", light: "#79c0ff", dark: "#1f6feb" },
      },

      typography: {
        fontFamily: [
          "Siemreap",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          '"Noto Sans"',
          "Helvetica",
          "Arial",
          "sans-serif",
        ].join(","),
        fontSize: fontBase,
        fontWeightLight:   300,
        fontWeightRegular: 400,
        fontWeightMedium:  500,
        fontWeightBold:    600,

        h1: { fontSize: "2rem",   fontWeight: 600, lineHeight: 1.25, letterSpacing: "-0.02em", color: t.text },
        h2: { fontSize: "1.5rem", fontWeight: 600, lineHeight: 1.3,  letterSpacing: "-0.01em", color: t.text },
        h3: { fontSize: "1.25rem",fontWeight: 600, lineHeight: 1.375,color: t.text },
        h4: { fontSize: "1rem",   fontWeight: 600, lineHeight: 1.5,  color: t.text },
        h5: { fontSize: "0.875rem",fontWeight:600, lineHeight: 1.5,  color: t.text },
        h6: { fontSize: "0.75rem", fontWeight:600, lineHeight: 1.5,  letterSpacing:"0.04em", textTransform:"uppercase", color: t.textMuted },

        body1:    { fontSize: `${fontBase}px`,     lineHeight: 1.6,  color: t.text },
        body2:    { fontSize: `${fontBase - 1}px`, lineHeight: 1.6,  color: t.textMuted },
        caption:  { fontSize: "0.75rem",            lineHeight: 1.5,  color: t.textSubtle },
        overline: { fontSize: "0.625rem",           lineHeight: 1.5,  letterSpacing: "0.08em", textTransform: "uppercase" },
        button:   { fontWeight: 500,                letterSpacing: "0em", textTransform: "none" },
      },

      shape: { borderRadius: radius },

      shadows: [
        "none",
        // Level 1 — subtle card shadow (GitHub style)
        isDark
          ? "0 0 0 1px rgba(48,54,61,0.8)"
          : "0 1px 3px rgba(31,35,40,0.12), 0 0 0 1px rgba(208,215,222,0.6)",
        // Level 2
        isDark
          ? "0 0 0 1px rgba(48,54,61,0.8), 0 4px 12px rgba(0,0,0,0.3)"
          : "0 1px 3px rgba(31,35,40,0.12), 0 4px 12px rgba(31,35,40,0.08)",
        // Level 3
        isDark
          ? "0 0 0 1px rgba(48,54,61,0.8), 0 8px 24px rgba(0,0,0,0.4)"
          : "0 1px 3px rgba(31,35,40,0.12), 0 8px 24px rgba(31,35,40,0.10)",
        ...Array(21).fill("none"),
      ],

      components: {
        // ── AppBar (Topbar) ──────────────────────────────────────────────────
        MuiAppBar: {
          defaultProps: { elevation: 0 },
          styleOverrides: {
            root: {
              backgroundColor: isKhmer
                ? "rgba(8,10,15,0.95)"
                : isGlass
                ? "rgba(13,17,23,0.8)"
                : isDark
                ? topbarColor || t.bgSubtle
                : "#ffffff",
              color: t.text,
              borderBottom: `1px solid ${t.border}`,
              boxShadow: "none",
              backgroundImage: isKhmer
                ? "linear-gradient(90deg, rgba(198,40,40,0.15) 0%, rgba(230,160,40,0.08) 100%)"
                : "none",
              ...(isGlass && {
                backdropFilter: "blur(12px) saturate(180%)",
                WebkitBackdropFilter: "blur(12px) saturate(180%)",
              }),
            },
          },
        },

        // ── Drawer (Sidebar) ─────────────────────────────────────────────────
        MuiDrawer: {
          styleOverrides: {
            paper: {
              backgroundColor: isKhmer
                ? "rgba(8,10,15,0.97)"
                : isGlass
                ? "rgba(13,17,23,0.85)"
                : isDark
                ? sidebarColor || t.bgSubtle
                : "#ffffff",
              color: t.text,
              borderRight: `1px solid ${t.border}`,
              backgroundImage: "none",
              ...(isKhmer && { borderRight: `1px solid rgba(230,160,40,0.2)` }),
              ...(isGlass && {
                backdropFilter: "blur(16px) saturate(200%)",
                WebkitBackdropFilter: "blur(16px) saturate(200%)",
              }),
            },
          },
        },

        // ── Paper ────────────────────────────────────────────────────────────
        MuiPaper: {
          defaultProps: { elevation: 0 },
          styleOverrides: {
            root: {
              backgroundImage: "none",
              backgroundColor: t.surface,
              border: `1px solid ${t.border}`,
              boxShadow: "none",
              ...(isGlass && {
                backgroundColor: t.surface,
                backdropFilter: "blur(16px) saturate(180%)",
                WebkitBackdropFilter: "blur(16px) saturate(180%)",
              }),
            },
            elevation1: {
              boxShadow: isDark
                ? "0 0 0 1px rgba(48,54,61,0.8)"
                : "0 1px 3px rgba(31,35,40,0.12), 0 0 0 1px rgba(208,215,222,0.6)",
            },
            elevation2: {
              boxShadow: isDark
                ? "0 0 0 1px rgba(48,54,61,0.8), 0 4px 12px rgba(0,0,0,0.3)"
                : "0 1px 3px rgba(31,35,40,0.12), 0 4px 12px rgba(31,35,40,0.08)",
            },
          },
        },

        // ── Card ─────────────────────────────────────────────────────────────
        MuiCard: {
          defaultProps: { elevation: 0 },
          styleOverrides: {
            root: {
              backgroundColor: t.surface,
              backgroundImage: "none",
              border: `1px solid ${isKhmer ? "rgba(230,160,40,0.2)" : t.border}`,
              borderRadius: radius * 1.5,
              boxShadow: "none",
              transition: "border-color 0.15s ease, box-shadow 0.15s ease",
              "&:hover": {
                borderColor: isKhmer ? "rgba(230,160,40,0.45)" : isDark ? "#58a6ff" : "#0969da",
                boxShadow: isDark
                  ? `0 0 0 3px ${accentSubtle}`
                  : `0 0 0 3px ${accentSubtle}`,
              },
              ...(isGlass && {
                backdropFilter: "blur(16px) saturate(180%)",
                WebkitBackdropFilter: "blur(16px) saturate(180%)",
              }),
            },
          },
        },

        MuiCardContent: {
          styleOverrides: {
            root: { padding: "16px", "&:last-child": { paddingBottom: "16px" } },
          },
        },

        // ── Button ───────────────────────────────────────────────────────────
        MuiButton: {
          defaultProps: { disableElevation: true },
          styleOverrides: {
            root: {
              fontWeight: 500,
              fontSize: "0.875rem",
              lineHeight: "20px",
              borderRadius: radius,
              textTransform: "none",
              letterSpacing: "0",
              transition: "background-color 0.1s ease, border-color 0.1s ease, box-shadow 0.1s ease",
            },
            contained: {
              backgroundColor: accent,
              color: "#ffffff",
              border: `1px solid ${isKhmer ? "rgba(230,160,40,0.4)" : isDark ? "rgba(240,246,252,0.1)" : "rgba(31,35,40,0.15)"}`,
              "&:hover": {
                backgroundColor: accentHover,
                boxShadow: `0 0 0 3px ${accentSubtle}`,
              },
              "&:active": { transform: "scale(0.98)" },
            },
            outlined: {
              borderColor: t.border,
              color: t.text,
              backgroundColor: isDark ? "rgba(177,186,196,0.06)" : "#f6f8fa",
              "&:hover": {
                backgroundColor: isDark ? "rgba(177,186,196,0.12)" : "#f0f2f5",
                borderColor: isDark ? "#6e7681" : "#c6cdd5",
              },
            },
            text: {
              color: t.textMuted,
              "&:hover": {
                backgroundColor: isDark ? "rgba(177,186,196,0.08)" : "rgba(208,215,222,0.32)",
                color: t.text,
              },
            },
            sizeSmall: {
              fontSize: "0.75rem",
              padding: "3px 12px",
              lineHeight: "18px",
            },
            sizeLarge: {
              fontSize: "1rem",
              padding: "10px 20px",
            },
          },
        },

        // ── IconButton ───────────────────────────────────────────────────────
        MuiIconButton: {
          styleOverrides: {
            root: {
              borderRadius: radius,
              color: t.textMuted,
              "&:hover": {
                backgroundColor: isDark ? "rgba(177,186,196,0.08)" : "rgba(208,215,222,0.32)",
                color: t.text,
              },
            },
          },
        },

        // ── TextField / Input ────────────────────────────────────────────────
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              backgroundColor: isDark ? t.surface : "#ffffff",
              borderRadius: radius,
              
              fontSize: "0.875rem",
              "& fieldset": {
                borderColor: t.border,
                transition: "border-color 0.15s ease",
              },
              "&:hover fieldset": {
                borderColor: isDark ? "#6e7681" : "#c6cdd5",
              },
              "&.Mui-focused fieldset": {
                borderColor: accent,
                borderWidth: "1px",
                boxShadow: `0 0 0 3px ${accentSubtle}`,
              },
            },
            input: {
              color: t.text,
              "&::placeholder": { color: t.textSubtle, opacity: 1 },
            },
          },
        },
        MuiInputLabel: {
          styleOverrides: {
            root: {
              fontSize: "0.875rem",
              color: t.textMuted,
              "&.Mui-focused": { color: accent },
            },
          },
        },
        MuiFormHelperText: {
          styleOverrides: {
            root: { fontSize: "0.75rem", color: t.textSubtle, marginTop: 4 },
          },
        },
 
        MuiSelect: {
          styleOverrides: {
            root: {
              backgroundColor: isDark ? t.surface : "#ffffff",
              color: t.text,
            },
            icon: { color: t.textMuted },
          },
        },

        MuiMenu: {
          styleOverrides: {
            paper: {
              backgroundColor: isDark ? t.surface : "#ffffff",
              backgroundImage: "none",
              border: `1px solid ${t.border}`,
              borderRadius: radius + 2,
              boxShadow: isDark
                ? "0 8px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(48,54,61,0.8)"
                : "0 8px 24px rgba(31,35,40,0.12), 0 1px 3px rgba(31,35,40,0.12)",
              padding: "4px",
              maxHeight: 320,
              overflowY: "auto",
              ...(isGlass && {
                backdropFilter: "blur(20px) saturate(200%)",
                WebkitBackdropFilter: "blur(20px) saturate(200%)",
              }),
            },
            list: { padding: 0 },
          },
        },
        MuiMenuItem: {
          styleOverrides: {
            root: {
              borderRadius: radius - 1,
              fontSize: "0.875rem",
              color: t.text,
              minHeight: 32,
              padding: "6px 10px",
              margin: "1px 0",
              "&:hover": {
                backgroundColor: isKhmer
                  ? "rgba(230,160,40,0.1)"
                  : isDark
                  ? "rgba(177,186,196,0.08)"
                  : "rgba(208,215,222,0.32)",
              },
              "&.Mui-selected": {
                backgroundColor: accentSubtle,
                color: isKhmer ? "#e6a028" : isDark ? "#58a6ff" : "#0969da",
                "&:hover": { backgroundColor: accentSubtle },
              },
            },
          },
        },

        // ── Autocomplete ─────────────────────────────────────────────────────
        MuiAutocomplete: {
          styleOverrides: {
            paper: {
              backgroundColor: isDark ? t.surface : "#ffffff",
              backgroundImage: "none",
              border: `1px solid ${t.border}`,
              borderRadius: radius + 2,
              boxShadow: isDark
                ? "0 8px 24px rgba(0,0,0,0.5)"
                : "0 8px 24px rgba(31,35,40,0.12)",
              padding: "4px",
              marginTop: 4,
              ...(isGlass && {
                backdropFilter: "blur(20px) saturate(200%)",
                WebkitBackdropFilter: "blur(20px) saturate(200%)",
              }),
            },
            listbox: {
              padding: 0,
              maxHeight: 280,
            },
            option: {
              borderRadius: radius - 1,
              fontSize: "0.875rem",
              minHeight: 32,
              padding: "6px 10px",
              margin: "1px 0",
              '&[aria-selected="true"]': { backgroundColor: accentSubtle },
              "&:hover": {
                backgroundColor: isDark ? "rgba(177,186,196,0.08)" : "rgba(208,215,222,0.32)",
              },
            },
            tag: {
              backgroundColor: isDark ? "rgba(177,186,196,0.1)" : "rgba(208,215,222,0.48)",
              borderRadius: 4,
              color: t.text,
              border: `1px solid ${t.border}`,
            },
          },
        },

        // ── Popover ──────────────────────────────────────────────────────────
        MuiPopover: {
          styleOverrides: {
            paper: {
              backgroundImage: "none",
              backgroundColor: isDark ? t.surface : "#ffffff",
              border: `1px solid ${t.border}`,
              borderRadius: radius + 2,
              boxShadow: isDark
                ? "0 8px 24px rgba(0,0,0,0.5)"
                : "0 8px 24px rgba(31,35,40,0.12)",
              ...(isGlass && {
                backdropFilter: "blur(20px) saturate(200%)",
                WebkitBackdropFilter: "blur(20px) saturate(200%)",
              }),
            },
          },
        },

        // ── Chip ─────────────────────────────────────────────────────────────
        MuiChip: {
          styleOverrides: {
            root: {
              borderRadius: 20,
              fontSize: "0.75rem",
              fontWeight: 500,
              height: 22,
              border: `1px solid ${t.border}`,
              backgroundColor: isDark ? "rgba(177,186,196,0.1)" : "rgba(208,215,222,0.3)",
              color: t.text,
            },
            colorSuccess: {
              backgroundColor: isDark ? "rgba(63,185,80,0.1)"  : "rgba(26,127,55,0.08)",
              color:           isDark ? "#3fb950"               : "#1a7f37",
              borderColor:     isDark ? "rgba(63,185,80,0.25)"  : "rgba(26,127,55,0.2)",
            },
            colorError: {
              backgroundColor: isDark ? "rgba(248,81,73,0.1)"   : "rgba(207,34,46,0.08)",
              color:           isDark ? "#f85149"                : "#cf222e",
              borderColor:     isDark ? "rgba(248,81,73,0.25)"  : "rgba(207,34,46,0.2)",
            },
            colorWarning: {
              backgroundColor: isDark ? "rgba(210,153,34,0.15)"  : "rgba(154,103,0,0.08)",
              color:           isDark ? "#e3b341"                 : "#9a6700",
              borderColor:     isDark ? "rgba(210,153,34,0.3)"   : "rgba(154,103,0,0.2)",
            },
            colorInfo: {
              backgroundColor: isDark ? "rgba(88,166,255,0.1)"  : "rgba(9,105,218,0.08)",
              color:           isDark ? "#58a6ff"                : "#0969da",
              borderColor:     isDark ? "rgba(88,166,255,0.25)" : "rgba(9,105,218,0.2)",
            },
          },
        },

        // ── Switch ───────────────────────────────────────────────────────────
        MuiSwitch: {
  styleOverrides: {
    root: {
      width: 38,
      height: 22,
      padding: 0,
      display: "flex",
    },

    switchBase: {
      padding: 2,
      transitionDuration: "250ms",

      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: "#fff",

        "& + .MuiSwitch-track": {
          background: accent,
          opacity: 1,
          borderColor: accent,
        },
      },
    },

    thumb: {
      width: 18,
      height: 18,
      borderRadius: "50%",
      backgroundColor: "#fff",
      boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
    },

    track: {
      borderRadius: 20,
      backgroundColor: isDark ? "#475569" : "#cbd5e1",
      opacity: 1,
      border: "none",
      transition: "all 0.25s ease",
    },
  },
},

        // ── Checkbox & Radio ─────────────────────────────────────────────────
        MuiCheckbox: {
          styleOverrides: {
            root: {
              color: t.border,
              "&.Mui-checked": { color: accent },
            },
          },
        },
        MuiRadio: {
          styleOverrides: {
            root: {
              color: t.border,
              "&.Mui-checked": { color: accent },
            },
          },
        },

        // ── Divider ──────────────────────────────────────────────────────────
        MuiDivider: {
          styleOverrides: {
            root: { borderColor: t.border },
          },
        },

        // ── Table ────────────────────────────────────────────────────────────
        MuiTableContainer: {
          styleOverrides: {
            root: {
              borderRadius: radius * 1.5,
              border: `1px solid ${t.border}`,
              boxShadow: "none",
              backgroundColor: "transparent",
              ...(isGlass && {
                backdropFilter: "blur(16px) saturate(180%)",
                WebkitBackdropFilter: "blur(16px) saturate(180%)",
              }),
            },
          },
        },
        MuiTable: {
          styleOverrides: {
            root: {
              borderCollapse: "collapse",
              backgroundColor: "transparent",
            },
          },
        },
        MuiTableHead: {
          styleOverrides: {
            root: {
              backgroundColor: isDark ? t.bgMuted : t.bgSubtle,
              "& .MuiTableCell-head": {
                fontWeight: 600,
                fontSize: "0.75rem",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: t.textMuted,
                borderBottom: `1px solid ${t.border}`,
                padding: "8px 16px",
              },
            },
          },
        },
        MuiTableBody: {
          styleOverrides: {
            root: {
              "& .MuiTableRow-root": {
                backgroundColor: "transparent",
                transition: "background-color 0.1s ease",
                "&:hover": {
                  backgroundColor: isDark ? "rgba(177,186,196,0.04)" : "rgba(208,215,222,0.16)",
                },
              },
            },
          },
        },
        MuiTableCell: {
          styleOverrides: {
            root: {
              padding: "10px 16px",
              fontSize: "0.875rem",
              color: t.text,
              borderBottom: `1px solid ${t.borderSubtle}`,
              verticalAlign: "middle",
            },
            head: {
              backgroundColor: "transparent",
            },
          },
        },
        MuiTablePagination: {
          styleOverrides: {
            root: {
              color: t.textMuted,
              fontSize: "0.75rem",
              borderTop: `1px solid ${t.border}`,
              backgroundColor: isDark ? t.bgSubtle : t.bgSubtle,
            },
            select: { color: t.text },
            actions: {
              "& .MuiIconButton-root": { color: t.textMuted },
            },
          },
        },

        // ── Dialog ───────────────────────────────────────────────────────────
        MuiDialog: {
          styleOverrides: {
            paper: {
              backgroundImage: "none",
              backgroundColor: isDark ? t.surface : "#ffffff",
              border: `1px solid ${t.border}`,
              borderRadius: radius * 2,
              boxShadow: isDark
                ? "0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(48,54,61,0.8)"
                : "0 16px 48px rgba(31,35,40,0.15), 0 1px 3px rgba(31,35,40,0.12)",
              ...(isGlass && {
                backdropFilter: "blur(20px) saturate(200%)",
                WebkitBackdropFilter: "blur(20px) saturate(200%)",
              }),
            },
          },
        },
        MuiDialogTitle: {
          styleOverrides: {
            root: {
              fontSize: "1rem",
              fontWeight: 600,
              color: t.text,
              padding: "16px 20px",
              borderBottom: `1px solid ${t.border}`,
            },
          },
        },
        MuiDialogContent: {
          styleOverrides: {
            root: { padding: "16px 20px" },
          },
        },
        MuiDialogActions: {
          styleOverrides: {
            root: {
              padding: "12px 20px",
              borderTop: `1px solid ${t.border}`,
              gap: 8,
            },
          },
        },

        // ── Backdrop ─────────────────────────────────────────────────────────
        MuiBackdrop: {
          styleOverrides: {
            root: {
              backgroundColor: isDark ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.4)",
              ...(isGlass && {
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
              }),
            },
          },
        },

        // ── Alert ────────────────────────────────────────────────────────────
        MuiAlert: {
          styleOverrides: {
            root: {
              borderRadius: radius,
              border: "1px solid",
              fontSize: "0.875rem",
              alignItems: "center",
            },
            standardSuccess: {
              backgroundColor: isDark ? "rgba(63,185,80,0.08)"   : "rgba(26,127,55,0.06)",
              borderColor:     isDark ? "rgba(63,185,80,0.25)"   : "rgba(26,127,55,0.2)",
              color:           isDark ? "#3fb950"                 : "#1a7f37",
            },
            standardError: {
              backgroundColor: isDark ? "rgba(248,81,73,0.08)"   : "rgba(207,34,46,0.06)",
              borderColor:     isDark ? "rgba(248,81,73,0.25)"   : "rgba(207,34,46,0.2)",
              color:           isDark ? "#f85149"                 : "#cf222e",
            },
            standardWarning: {
              backgroundColor: isDark ? "rgba(210,153,34,0.1)"   : "rgba(154,103,0,0.06)",
              borderColor:     isDark ? "rgba(210,153,34,0.3)"   : "rgba(154,103,0,0.2)",
              color:           isDark ? "#e3b341"                 : "#9a6700",
            },
            standardInfo: {
              backgroundColor: isDark ? "rgba(88,166,255,0.08)"  : "rgba(9,105,218,0.06)",
              borderColor:     isDark ? "rgba(88,166,255,0.25)"  : "rgba(9,105,218,0.2)",
              color:           isDark ? "#58a6ff"                 : "#0969da",
            },
          },
        },

        // ── Tooltip ──────────────────────────────────────────────────────────
        MuiTooltip: {
          styleOverrides: {
            tooltip: {
              fontSize: "0.75rem",
              fontWeight: 400,
              backgroundColor: isDark ? "#3d444d" : "#24292f",
              color: "#ffffff",
              borderRadius: radius,
              padding: "5px 10px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            },
            arrow: {
              color: isDark ? "#3d444d" : "#24292f",
            },
          },
        },

        // ── Snackbar ─────────────────────────────────────────────────────────
        MuiSnackbarContent: {
          styleOverrides: {
            root: {
              backgroundColor: isDark ? "#3d444d" : "#24292f",
              color: "#ffffff",
              borderRadius: radius,
              fontSize: "0.875rem",
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            },
          },
        },

        // ── Tabs ─────────────────────────────────────────────────────────────
        MuiTab: {
          styleOverrides: {
            root: {
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.875rem",
              color: t.textMuted,
              minHeight: 40,
              padding: "8px 16px",
              "&.Mui-selected": { color: t.text, fontWeight: 600 },
              "&:hover": { color: t.text, backgroundColor: "transparent" },
            },
          },
        },
        MuiTabs: {
          styleOverrides: {
            indicator: { backgroundColor: accent, height: 2 },
            root: { borderBottom: `1px solid ${t.border}` },
          },
        },

        // ── List items ───────────────────────────────────────────────────────
        MuiListItemButton: {
          styleOverrides: {
            root: {
              borderRadius: radius,
              fontSize: "0.875rem",
              color: t.textMuted,
              margin: "1px 4px",
              "&:hover": {
                backgroundColor: isKhmer
                  ? "rgba(230,160,40,0.08)"
                  : isDark
                  ? "rgba(177,186,196,0.08)"
                  : "rgba(208,215,222,0.32)",
                color: t.text,
              },
              "&.Mui-selected": {
                backgroundColor: accentSubtle,
                color: isKhmer ? "#e6a028" : isDark ? "#58a6ff" : "#0969da",
                fontWeight: 600,
                "&:hover": { backgroundColor: accentSubtle },
              },
            },
          },
        },

        // ── Breadcrumbs ──────────────────────────────────────────────────────
        MuiBreadcrumbs: {
          styleOverrides: {
            root: { fontSize: "0.8125rem", color: t.textMuted },
            separator: { color: t.textSubtle },
          },
        },

        // ── Badge ────────────────────────────────────────────────────────────
        MuiBadge: {
          styleOverrides: {
            badge: {
              fontSize: "0.65rem",
              fontWeight: 600,
              height: 18,
              minWidth: 18,
              padding: "0 4px",
              borderRadius: 10,
            },
          },
        },

        // ── Linear Progress ──────────────────────────────────────────────────
        MuiLinearProgress: {
          styleOverrides: {
            root: {
              borderRadius: 10,
              backgroundColor: isDark ? "rgba(177,186,196,0.1)" : "rgba(208,215,222,0.4)",
              height: 6,
            },
            bar: { borderRadius: 10, backgroundColor: accent },
          },
        },

        // ── Skeleton ─────────────────────────────────────────────────────────
        MuiSkeleton: {
          styleOverrides: {
            root: {
              backgroundColor: isDark ? "rgba(177,186,196,0.08)" : "rgba(208,215,222,0.4)",
              borderRadius: radius,
            },
          },
        },

        // ── Stepper ──────────────────────────────────────────────────────────
        MuiStepLabel: {
          styleOverrides: {
            label: { fontSize: "0.875rem", color: t.textMuted },
            active: { color: t.text, fontWeight: 600 },
            completed: { color: t.textMuted },
          },
        },
        MuiStepIcon: {
          styleOverrides: {
            root: {
              color: t.border,
              "&.Mui-active":    { color: accent },
              "&.Mui-completed": { color: isDark ? "#3fb950" : "#1a7f37" },
            },
          },
        },
        MuiStepConnector: {
          styleOverrides: {
            line: { borderColor: t.border },
          },
        },
      },
    });
  }, [mode, primaryColor, sidebarColor, topbarColor, fontSize]);

  const value = {
    mode,
    primaryColor,
    sidebarColor,
    layoutMode,
    topbarColor,
    fontSize,
    mobileDrawerWidth,
    mobileShowLabels,
    toggleColorMode,
    setPrimaryColor,
    setSidebarColor,
    setLayoutMode,
    setTopbarColor,
    setFontSize,
    setMobileDrawerWidth,
    setMobileShowLabels,
    resetSettings,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};