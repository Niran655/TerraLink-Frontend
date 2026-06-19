/* eslint-disable react/prop-types */
import SettingsIcon from "@mui/icons-material/Settings";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, Divider, Drawer, FormControl, FormControlLabel, IconButton, Radio, RadioGroup, Slider, Switch, Tooltip, Typography } from "@mui/material";
import { useState } from "react";

import { useThemeContext } from "../../Context/ThemeContext";

 
const PRIMARY_COLORS = [
  { name: "Ocean",   value: "#0969da" },
  { name: "Cobalt",  value: "#1D4592" },
  { name: "Indigo",  value: "#4f46e5" },
  { name: "Violet",  value: "#7c3aed" },
  { name: "Fuchsia", value: "#a21caf" },
  { name: "Rose",    value: "#e11d48" },
  { name: "Crimson", value: "#dc2626" },
  { name: "Amber",   value: "#d97706" },
  { name: "Lime",    value: "#65a30d" },
  { name: "Emerald", value: "#059669" },
  { name: "Teal",    value: "#0891b2" },
  { name: "Cyan",    value: "#0e7490" },
];

const SIDEBAR_COLORS = [
  { name: "Ink",     value: "#0d1117" },
  { name: "Slate",   value: "#161b22" },
  { name: "Onyx",    value: "#1c2128" },
  { name: "Zinc",    value: "#27272a" },
  { name: "Navy",    value: "#0f172a" },
  { name: "Marine",  value: "#1e3a5f" },
  { name: "Forest",  value: "#14532d" },
  { name: "Plum",    value: "#3b1f5e" },
  { name: "Sand",    value: "#f6f8fa" },
  { name: "White",   value: "#ffffff" },
];

const TOPBAR_COLORS = [
  { name: "Ink",     value: "#0d1117" },
  { name: "Slate",   value: "#161b22" },
  { name: "Onyx",    value: "#1c2128" },
  { name: "Zinc",    value: "#27272a" },
  { name: "Navy",   value: "#0f172a" },
  { name: "Marine",  value: "#1e3a5f" },
  { name: "Forest",  value: "#14532d" },
  { name: "Crimson", value: "#dc2626" },
  { name: "Sand",    value: "#f6f8fa" },
  { name: "White",   value: "#ffffff" },
];


const MODES = [
  { key: "dark",        label: "Dark",    icon: "🌑" },
  { key: "light",       label: "Light",   icon: "☀️" },
  { key: "glass",       label: "Glass",   icon: "✦"  },
  { key: "crypto",      label: "Crypto",  icon: "💹" },
  { key: "khmerNewYear",label: "Khmer",   icon: "🇰🇭" },
];

// ─── Helper: is this mode dark-based? ─────────────────────────────────────────
const isDarkBased = (m) => ["dark", "glass", "crypto", "khmerNewYear"].includes(m);

// ─── Section header ────────────────────────────────────────────────────────────
function SectionLabel({ children, mode }) {
  const isKhmer = mode === "khmerNewYear";
  return (
    <Typography
      sx={{
        fontSize: "0.6875rem",
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: isKhmer ? "#e6a028" : isDarkBased(mode) ? "#6e7681" : "#636c76",
        mb: 1.5,
      }}
    >
      {children}
    </Typography>
  );
}

// ─── Color swatch ──────────────────────────────────────────────────────────────
function ColorSwatch({ color, selected, onClick, size = 26 }) {
  const isLight = ["#f6f8fa", "#ffffff"].includes(color.value);
  return (
    <Tooltip title={color.name} placement="top" arrow>
      <Box
        onClick={onClick}
        sx={{
          width: size,
          height: size,
          borderRadius: "6px",
          backgroundColor: color.value,
          border: isLight ? "1px solid rgba(0,0,0,0.12)" : "1px solid rgba(255,255,255,0.08)",
          cursor: "pointer",
          position: "relative",
          transition: "transform 0.12s ease, box-shadow 0.12s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: selected
            ? `0 0 0 2px #fff, 0 0 0 4px ${color.value}`
            : "none",
          "&:hover": {
            transform: "scale(1.15)",
          },
        }}
      >
        {selected && (
          <CheckIcon
            sx={{
              fontSize: 13,
              color: isLight ? "#1f2328" : "#ffffff",
            }}
          />
        )}
      </Box>
    </Tooltip>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function ThemeCustomizer() {
  const [open, setOpen] = useState(false);
  const {
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
  } = useThemeContext();

  const dark = isDarkBased(mode);
  const isKhmer = mode === "khmerNewYear";

  // Derived surface colors for the drawer itself
  const drawerBg    = isKhmer ? "#080a0f"          : dark ? "#0d1117"          : "#ffffff";
  const drawerBg2   = isKhmer ? "#0d1117"          : dark ? "#161b22"          : "#f6f8fa";
  const drawerBorder= isKhmer ? "rgba(230,160,40,0.2)" : dark ? "#21262d"     : "#d0d7de";
  const drawerText  = isKhmer ? "#f0f6fc"          : dark ? "#e6edf3"          : "#1f2328";
  const drawerMuted = isKhmer ? "#e6a028"          : dark ? "#8b949e"          : "#636c76";

  return (
    <>
      {/* ── Trigger tab ─────────────────────────────────────────────────── */}
      <Tooltip title="Theme settings" placement="left">
        <Box
          onClick={() => setOpen(true)}
          sx={{
            position: "fixed",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 9999,
            width: 32,
            height: 48,
            backgroundColor: isKhmer
              ? "#c62828"
              : dark
              ? "#21262d"
              : "#0969da",
            border: `1px solid ${isKhmer ? "rgba(230,160,40,0.4)" : dark ? "#30363d" : "rgba(9,105,218,0.4)"}`,
            borderRight: "none",
            borderRadius: "8px 0 0 8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.15s ease",
            boxShadow: dark
              ? "0 4px 12px rgba(0,0,0,0.5)"
              : "0 4px 12px rgba(9,105,218,0.25)",
            "&:hover": {
              width: 36,
              backgroundColor: isKhmer
                ? "#b71c1c"
                : dark
                ? "#30363d"
                : "#0860ca",
            },
          }}
        >
          {isKhmer ? (
            <span style={{ fontSize: "1rem" }}>🌸</span>
          ) : (
            <SettingsIcon
              sx={{
                fontSize: 16,
                color: "#ffffff",
                animation: open ? "none" : "spin 8s linear infinite",
                "@keyframes spin": { to: { transform: "rotate(360deg)" } },
              }}
            />
          )}
        </Box>
      </Tooltip>

      {/* ── Drawer ──────────────────────────────────────────────────────── */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: 300,
            backgroundColor: drawerBg,
            backgroundImage: "none",
            borderLeft: `1px solid ${drawerBorder}`,
            boxShadow: dark
              ? "-8px 0 24px rgba(0,0,0,0.5)"
              : "-8px 0 24px rgba(31,35,40,0.12)",
            ...(mode === "glass" && {
              backdropFilter: "blur(20px) saturate(200%)",
              WebkitBackdropFilter: "blur(20px) saturate(200%)",
            }),
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            py: 1.5,
            borderBottom: `1px solid ${drawerBorder}`,
            backgroundColor: drawerBg2,
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          <Box>
            <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: drawerText, lineHeight: 1.2 }}>
              Appearance
            </Typography>
            <Typography sx={{ fontSize: "0.7rem", color: drawerMuted, mt: 0.25 }}>
              Customize your interface
            </Typography>
          </Box>
          <IconButton
            onClick={() => setOpen(false)}
            size="small"
            sx={{
              color: drawerMuted,
              borderRadius: "6px",
              "&:hover": { backgroundColor: dark ? "rgba(177,186,196,0.08)" : "rgba(208,215,222,0.32)", color: drawerText },
            }}
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>

        {/* Scrollable content */}
        <Box
          sx={{
            overflowY: "auto",
            flex: 1,
            "&::-webkit-scrollbar": { width: 4 },
            "&::-webkit-scrollbar-track": { background: "transparent" },
            "&::-webkit-scrollbar-thumb": { background: drawerBorder, borderRadius: 2 },
          }}
        >
          <Box sx={{ p: 2 }}>

            {/* ── Theme Mode ─────────────────────────────────────────────── */}
            <SectionLabel mode={mode}>Theme Mode</SectionLabel>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "6px",
                mb: 2.5,
              }}
            >
              {MODES.map((m) => {
                const active = mode === m.key;
                return (
                  <Box
                    key={m.key}
                    onClick={() => toggleColorMode(m.key)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                      px: 1.25,
                      py: 1,
                      borderRadius: "6px",
                      border: `1px solid ${active ? (isKhmer ? "rgba(230,160,40,0.6)" : "#0969da") : drawerBorder}`,
                      backgroundColor: active
                        ? isKhmer
                          ? "rgba(230,160,40,0.1)"
                          : "rgba(9,105,218,0.1)"
                        : dark
                        ? "rgba(177,186,196,0.04)"
                        : "rgba(208,215,222,0.16)",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      "&:hover": {
                        borderColor: isKhmer ? "rgba(230,160,40,0.4)" : "#0969da",
                        backgroundColor: isKhmer
                          ? "rgba(230,160,40,0.07)"
                          : dark
                          ? "rgba(88,166,255,0.07)"
                          : "rgba(9,105,218,0.06)",
                      },
                    }}
                  >
                    <span style={{ fontSize: "0.875rem", lineHeight: 1 }}>{m.icon}</span>
                    <Typography
                      sx={{
                        fontSize: "0.8125rem",
                        fontWeight: active ? 600 : 400,
                        color: active
                          ? isKhmer ? "#e6a028" : dark ? "#58a6ff" : "#0969da"
                          : drawerMuted,
                      }}
                    >
                      {m.label}
                    </Typography>
                  </Box>
                );
              })}
            </Box>

            <Divider sx={{ borderColor: drawerBorder, mb: 2.5 }} />

            {/* ── Primary Color ───────────────────────────────────────────── */}
            <SectionLabel mode={mode}>Accent Color</SectionLabel>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(6, 1fr)",
                gap: "8px",
                mb: 2.5,
              }}
            >
              {PRIMARY_COLORS.map((c) => (
                <ColorSwatch
                  key={c.value}
                  color={c}
                  selected={primaryColor === c.value}
                  onClick={() => setPrimaryColor(c.value)}
                />
              ))}
            </Box>

            <Divider sx={{ borderColor: drawerBorder, mb: 2.5 }} />

            {/* ── Sidebar Color ───────────────────────────────────────────── */}
            <SectionLabel mode={mode}>Sidebar Color</SectionLabel>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: "8px",
                mb: 2.5,
              }}
            >
              {SIDEBAR_COLORS.map((c) => (
                <ColorSwatch
                  key={c.value}
                  color={c}
                  selected={sidebarColor === c.value}
                  onClick={() => setSidebarColor(c.value)}
                  size={28}
                />
              ))}
            </Box>

            <Divider sx={{ borderColor: drawerBorder, mb: 2.5 }} />

            {/* ── Topbar Color ────────────────────────────────────────────── */}
            <SectionLabel mode={mode}>Topbar Color</SectionLabel>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: "8px",
                mb: 2.5,
              }}
            >
              {TOPBAR_COLORS.map((c) => (
                <ColorSwatch
                  key={c.value}
                  color={c}
                  selected={topbarColor === c.value}
                  onClick={() => setTopbarColor(c.value)}
                  size={28}
                />
              ))}
            </Box>

            <Divider sx={{ borderColor: drawerBorder, mb: 2.5 }} />

            {/* ── Layout Mode ─────────────────────────────────────────────── */}
            <SectionLabel mode={mode}>Layout</SectionLabel>
            <FormControl component="fieldset" sx={{ mb: 2.5, width: "100%" }}>
              <RadioGroup
                value={layoutMode}
                onChange={(e) => setLayoutMode(e.target.value)}
                row
              >
                {[
                  { label: "Default", value: "default" },
                  { label: "Horizontal", value: "top" },
                  { label: "Compact", value: "compact" },
                ].map((l) => (
                  <FormControlLabel
                    key={l.value}
                    value={l.value}
                    control={
                      <Radio
                        size="small"
                        sx={{
                          color: drawerBorder,
                          p: 0.5,
                          "&.Mui-checked": { color: isKhmer ? "#e6a028" : dark ? "#58a6ff" : "#0969da" },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: "0.8125rem", color: layoutMode === l.value ? drawerText : drawerMuted }}>
                        {l.label}
                      </Typography>
                    }
                    sx={{ mr: 1.5 }}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <Divider sx={{ borderColor: drawerBorder, mb: 2.5 }} />

            {/* ── Font Size ───────────────────────────────────────────────── */}
            <SectionLabel mode={mode}>Font Size</SectionLabel>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "6px",
                mb: 2.5,
              }}
            >
              {[
                { key: "small",  label: "Small",  sample: "Aa", size: "11px" },
                { key: "medium", label: "Medium", sample: "Aa", size: "14px" },
                { key: "large",  label: "Large",  sample: "Aa", size: "17px" },
              ].map((f) => {
                const active = fontSize === f.key;
                return (
                  <Box
                    key={f.key}
                    onClick={() => setFontSize(f.key)}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      py: 1.25,
                      borderRadius: "6px",
                      border: `1px solid ${active ? (isKhmer ? "rgba(230,160,40,0.6)" : dark ? "#58a6ff" : "#0969da") : drawerBorder}`,
                      backgroundColor: active
                        ? isKhmer ? "rgba(230,160,40,0.1)" : dark ? "rgba(88,166,255,0.08)" : "rgba(9,105,218,0.08)"
                        : "transparent",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      "&:hover": { borderColor: isKhmer ? "rgba(230,160,40,0.4)" : dark ? "#58a6ff" : "#0969da" },
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: f.size,
                        color: active ? (isKhmer ? "#e6a028" : dark ? "#58a6ff" : "#0969da") : drawerText,
                        lineHeight: 1,
                        mb: 0.5,
                      }}
                    >
                      {f.sample}
                    </Typography>
                    <Typography sx={{ fontSize: "0.6875rem", color: drawerMuted }}>
                      {f.label}
                    </Typography>
                  </Box>
                );
              })}
            </Box>

            <Divider sx={{ borderColor: drawerBorder, mb: 2.5 }} />

            {/* ── Mobile Drawer Width ─────────────────────────────────────── */}
            <SectionLabel mode={mode}>Drawer Width</SectionLabel>
            <Box sx={{ px: 0.5, mb: 2.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography sx={{ fontSize: "0.8125rem", color: drawerMuted }}>Width</Typography>
                <Box
                  sx={{
                    px: 1,
                    py: 0.25,
                    borderRadius: "4px",
                    border: `1px solid ${drawerBorder}`,
                    backgroundColor: dark ? "rgba(177,186,196,0.06)" : "rgba(208,215,222,0.2)",
                  }}
                >
                  <Typography sx={{ fontSize: "0.75rem", fontFamily: "monospace", color: drawerText, fontWeight: 600 }}>
                    {mobileDrawerWidth}px
                  </Typography>
                </Box>
              </Box>
              <Slider
                value={mobileDrawerWidth}
                min={160}
                max={480}
                step={8}
                onChange={(_, v) => setMobileDrawerWidth(v)}
                sx={{
                  color: isKhmer ? "#e6a028" : dark ? "#58a6ff" : "#0969da",
                  height: 4,
                  "& .MuiSlider-thumb": {
                    width: 14,
                    height: 14,
                    "&:hover, &.Mui-focusVisible": {
                      boxShadow: `0 0 0 6px ${isKhmer ? "rgba(230,160,40,0.15)" : dark ? "rgba(88,166,255,0.15)" : "rgba(9,105,218,0.15)"}`,
                    },
                  },
                  "& .MuiSlider-rail": {
                    backgroundColor: drawerBorder,
                    opacity: 1,
                  },
                }}
              />
            </Box>

            <Divider sx={{ borderColor: drawerBorder, mb: 2.5 }} />

            {/* ── Mobile Labels ───────────────────────────────────────────── */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2.5,
              }}
            >
              <Box>
                <Typography sx={{ fontSize: "0.8125rem", fontWeight: 500, color: drawerText }}>
                  Mobile Labels
                </Typography>
                <Typography sx={{ fontSize: "0.75rem", color: drawerMuted }}>
                  Show nav labels on mobile
                </Typography>
              </Box>
              <Switch
                checked={Boolean(mobileShowLabels)}
                onChange={(e) => setMobileShowLabels(e.target.checked)}
                size="small"
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: isKhmer ? "#e6a028" : dark ? "#58a6ff" : "#0969da",
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: isKhmer ? "#e6a028" : dark ? "#58a6ff" : "#0969da",
                    opacity: 0.6,
                  },
                  "& .MuiSwitch-track": {
                    backgroundColor: drawerBorder,
                    opacity: 1,
                  },
                }}
              />
            </Box>

          </Box>
        </Box>

        {/* Footer — reset */}
        <Box
          sx={{
            p: 2,
            borderTop: `1px solid ${drawerBorder}`,
            backgroundColor: drawerBg2,
            position: "sticky",
            bottom: 0,
          }}
        >
          <Button
            fullWidth
            variant="outlined"
            startIcon={<RefreshIcon sx={{ fontSize: 15 }} />}
            onClick={resetSettings}
            sx={{
              fontSize: "0.8125rem",
              fontWeight: 500,
              borderRadius: "6px",
              textTransform: "none",
              py: 0.875,
              color: dark ? "#f85149" : "#cf222e",
              borderColor: dark ? "rgba(248,81,73,0.3)" : "rgba(207,34,46,0.3)",
              backgroundColor: dark ? "rgba(248,81,73,0.04)" : "rgba(207,34,46,0.04)",
              "&:hover": {
                borderColor: dark ? "rgba(248,81,73,0.6)" : "rgba(207,34,46,0.6)",
                backgroundColor: dark ? "rgba(248,81,73,0.1)" : "rgba(207,34,46,0.08)",
              },
            }}
          >
            Reset to defaults
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
// import SettingsIcon from '@mui/icons-material/Settings';
// import RefreshIcon from '@mui/icons-material/Refresh';
// import CloseIcon from '@mui/icons-material/Close';
// import { Box, Button, Divider, Drawer, FormControl, FormControlLabel, FormLabel, IconButton, Radio, RadioGroup, Stack, Switch, TextField, Tooltip, Typography } from '@mui/material';
// import React, { useState } from 'react';

// import { useThemeContext } from '../../Context/ThemeContext';
// import './ThemeCustomizer.scss';

// export default function ThemeCustomizer() {
//   const [open, setOpen] = useState(false);
//   const {
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
//   } = useThemeContext();

//   const toggleDrawer = () => {
//     setOpen(!open);
//   };

//   const primaryColors = [
//     { name: 'Blue', value: '#1976d2' },
//     { name: 'Green', value: '#2e7d32' },
//     { name: 'Orange', value: '#ed6c02' },
//     { name: 'Red', value: '#d32f2f' },
//     { name: 'Purple', value: '#9c27b0' },
//     { name: 'Teal', value: '#0097a7' },
//   ];

//   const sidebarColors = [
//     { name: 'Dark', value: '#1e293b' },
//     { name: 'Blue', value: '#1e40af' },
//     { name: 'Green', value: '#15803d' },
//     { name: 'Purple', value: '#7c3aed' },
//     { name: 'Red', value: '#b91c1c' },
//   ];

//   const topbarColors = [
//     { name: 'White', value: '#ffffff' },
//     { name: 'Dark', value: '#1e293b' },
//     { name: 'Blue', value: '#1976d2' },
//     { name: 'Gray', value: '#64748b' },
//   ];

//   return (
//     <>
//       <Tooltip title="Theme Settings" placement="left">
//         <IconButton
//           className="theme-customizer-trigger"
//           onClick={toggleDrawer}
//           sx={{
//             position: 'fixed',
//             right: 0,
//             top: '50%',
//             transform: 'translateY(-50%)',
//             backgroundColor: mode === 'dark' ? '#1e293b' : 'primary.main',
//             color: 'white',
//             borderRadius: '8px 0 0 8px',
//             width: 50,
//             height: 50,
//             zIndex: 9999,
//             '&:hover': {
//               backgroundColor: mode === 'dark' ? '#334155' : 'primary.dark',
//             },
//             boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
//           }}
//         >
//           <SettingsIcon className="rotating-icon" />
//         </IconButton>
//       </Tooltip>

//       <Drawer
//         anchor="right"
//         open={open}
//         onClose={toggleDrawer}
//         PaperProps={{
//           sx: { 
//             width: 320,
//             backgroundColor: mode === 'dark' ? '#1e293b' : '#ffffff',
//             backgroundImage: 'none',
//           },
//         }}
//       >
//         <Box className="theme-customizer">
//           {/* Header */}
//           <Box
//             sx={{
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'space-between',
//               p: 2,
//               backgroundColor: mode === 'dark' ? '#0f172a' : '#f8fafc',
//               borderBottom: `1px solid ${mode === 'dark' ? '#334155' : '#e2e8f0'}`,
//             }}
//           >
//             <Typography 
//               variant="h6" 
//               fontWeight="bold"
//               sx={{ color: mode === 'dark' ? '#f8fafc' : '#1e293b' }}
//             >
//               Theme Customizer
//             </Typography>
//             <IconButton 
//               onClick={toggleDrawer} 
//               size="small"
//               sx={{ 
//                 color: mode === 'dark' ? '#94a3b8' : '#64748b',
//               }}
//             >
//               <CloseIcon />
//             </IconButton>
//           </Box>

//           <Divider sx={{ borderColor: mode === 'dark' ? '#334155' : '#e2e8f0' }} />

//           {/* Content */}
//           <Box sx={{ 
//             p: 2, 
//             overflowY: 'auto', 
//             maxHeight: 'calc(100vh - 120px)',
//             backgroundColor: mode === 'dark' ? '#1e293b' : '#ffffff',
//           }}>
//             <Stack spacing={3}>
//               {/* Theme Mode */}
//               <Box>
//                 <Typography 
//                   variant="subtitle2" 
//                   fontWeight="bold" 
//                   mb={1.5}
//                   sx={{ color: mode === 'dark' ? '#f1f5f9' : '#1e293b' }}
//                 >
//                   Theme Mode
//                 </Typography>
//                 <Stack direction="row" spacing={1}>
//                   <Button
//                     variant={mode === 'light' ? 'contained' : 'outlined'}
//                     onClick={() => toggleColorMode('light')}
//                     fullWidth
//                     sx={{
//                       backgroundColor: mode === 'light' ? primaryColor : 'transparent',
//                       color: mode === 'light' ? 'white' : (mode === 'dark' ? '#e2e8f0' : '#64748b'),
//                       borderColor: mode === 'dark' ? '#475569' : '#cbd5e1',
//                       '&:hover': {
//                         backgroundColor: mode === 'light' ? primaryColor : (mode === 'dark' ? '#334155' : '#f1f5f9'),
//                       }
//                     }}
//                   >
//                     Light
//                   </Button>
//                   <Button
//                     variant={mode === 'dark' ? 'contained' : 'outlined'}
//                     onClick={() => toggleColorMode('dark')}
//                     fullWidth
//                     sx={{
//                       backgroundColor: mode === 'dark' ? '#334155' : 'transparent',
//                       color: mode === 'dark' ? 'white' : (mode === 'dark' ? '#e2e8f0' : '#64748b'),
//                       borderColor: mode === 'dark' ? '#475569' : '#cbd5e1',
//                       '&:hover': {
//                         backgroundColor: mode === 'dark' ? '#475569' : (mode === 'dark' ? '#334155' : '#f1f5f9'),
//                       }
//                     }}
//                   >
//                     Dark
//                   </Button>
//                 </Stack>
//               </Box>

//               <Divider sx={{ borderColor: mode === 'dark' ? '#334155' : '#e2e8f0' }} />

//               {/* Mobile Drawer Width */}
//               <Box>
//                 <Typography 
//                   variant="subtitle2" 
//                   fontWeight="bold" 
//                   mb={1.5}
//                   sx={{ color: mode === 'dark' ? '#f1f5f9' : '#1e293b' }}
//                 >
//                   Mobile Drawer Width
//                 </Typography>
//                 <TextField
//                   type="number"
//                   value={mobileDrawerWidth}
//                   onChange={(e) => {
//                     const v = Number(e.target.value) || 200;
//                     setMobileDrawerWidth(v);
//                   }}
//                   inputProps={{ min: 160, max: 480 }}
//                   fullWidth
//                   size="small"
//                   sx={{
//                     '& .MuiOutlinedInput-root': {
//                       backgroundColor: mode === 'dark' ? '#0f172a' : '#ffffff',
//                       color: mode === 'dark' ? '#f1f5f9' : '#1e293b',
//                       '& fieldset': {
//                         borderColor: mode === 'dark' ? '#334155' : '#cbd5e1',
//                       },
//                       '&:hover fieldset': {
//                         borderColor: mode === 'dark' ? '#475569' : '#94a3b8',
//                       },
//                       '&.Mui-focused fieldset': {
//                         borderColor: primaryColor,
//                       },
//                     },
//                   }}
//                 />
//               </Box>

//               <Divider sx={{ borderColor: mode === 'dark' ? '#334155' : '#e2e8f0' }} />

//               {/* Show Labels on Mobile */}
//               <Box>
//                 <Typography 
//                   variant="subtitle2" 
//                   fontWeight="bold" 
//                   mb={1.5}
//                   sx={{ color: mode === 'dark' ? '#f1f5f9' : '#1e293b' }}
//                 >
//                   Show Labels on Mobile
//                 </Typography>
//                 <Stack direction="row" alignItems="center" spacing={1}>
//                   <Switch
//                     checked={Boolean(mobileShowLabels)}
//                     onChange={(e) => setMobileShowLabels(!!e.target.checked)}
//                     sx={{
//                       '& .MuiSwitch-switchBase.Mui-checked': {
//                         color: primaryColor,
//                       },
//                       '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
//                         backgroundColor: primaryColor,
//                       },
//                     }}
//                   />
//                   <Typography sx={{ color: mode === 'dark' ? '#e2e8f0' : '#475569' }}>
//                     {mobileShowLabels ? 'Labels shown' : 'Icons only'}
//                   </Typography>
//                 </Stack>
//               </Box>

//               <Divider sx={{ borderColor: mode === 'dark' ? '#334155' : '#e2e8f0' }} />

//               {/* Primary Color */}
//               <Box>
//                 <Typography 
//                   variant="subtitle2" 
//                   fontWeight="bold" 
//                   mb={1.5}
//                   sx={{ color: mode === 'dark' ? '#f1f5f9' : '#1e293b' }}
//                 >
//                   Primary Color
//                 </Typography>
//                 <Box className="color-grid">
//                   {primaryColors.map((color) => (
//                     <Tooltip key={color.value} title={color.name}>
//                       <Box
//                         className={`color-option ${
//                           primaryColor === color.value ? 'active' : ''
//                         }`}
//                         onClick={() => setPrimaryColor(color.value)}
//                         sx={{ 
//                           backgroundColor: color.value,
//                           border: primaryColor === color.value ? `2px solid ${mode === 'dark' ? '#ffffff' : '#000000'}` : '2px solid transparent',
//                           '&:hover': {
//                             transform: 'scale(1.05)',
//                           },
//                         }}
//                       />
//                     </Tooltip>
//                   ))}
//                 </Box>
//               </Box>

//               <Divider sx={{ borderColor: mode === 'dark' ? '#334155' : '#e2e8f0' }} />

//               {/* Sidebar Color */}
//               <Box>
//                 <Typography 
//                   variant="subtitle2" 
//                   fontWeight="bold" 
//                   mb={1.5}
//                   sx={{ color: mode === 'dark' ? '#f1f5f9' : '#1e293b' }}
//                 >
//                   Sidebar Color
//                 </Typography>
//                 <Box className="color-grid">
//                   {sidebarColors.map((color) => (
//                     <Tooltip key={color.value} title={color.name}>
//                       <Box
//                         className={`color-option ${
//                           sidebarColor === color.value ? 'active' : ''
//                         }`}
//                         onClick={() => setSidebarColor(color.value)}
//                         sx={{ 
//                           backgroundColor: color.value,
//                           border: sidebarColor === color.value ? `2px solid ${mode === 'dark' ? '#ffffff' : '#000000'}` : '2px solid transparent',
//                           '&:hover': {
//                             transform: 'scale(1.05)',
//                           },
//                         }}
//                       />
//                     </Tooltip>
//                   ))}
//                 </Box>
//               </Box>

//               {/* Add similar sections for other customizations... */}
//             </Stack>
//           </Box>

//           <Divider sx={{ borderColor: mode === 'dark' ? '#334155' : '#e2e8f0' }} />

//           {/* Reset Button */}
//           <Box sx={{ 
//             p: 2,
//             backgroundColor: mode === 'dark' ? '#1e293b' : '#ffffff',
//           }}>
//             <Button
//               variant="outlined"
//               color="error"
//               fullWidth
//               startIcon={<RefreshIcon />}
//               onClick={resetSettings}
//               sx={{
//                 borderColor: mode === 'dark' ? '#ef4444' : '#dc2626',
//                 color: mode === 'dark' ? '#ef4444' : '#dc2626',
//                 '&:hover': {
//                   backgroundColor: mode === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(220, 38, 38, 0.04)',
//                   borderColor: mode === 'dark' ? '#dc2626' : '#b91c1c',
//                 }
//               }}
//             >
//               Reset to Default
//             </Button>
//           </Box>
//         </Box>
//       </Drawer>
//     </>
//   );
// }
