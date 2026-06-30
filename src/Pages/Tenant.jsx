import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import QueueOutlinedIcon from "@mui/icons-material/QueueOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import {
  Avatar,
  Box,
  Button,
  Chip,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useQuery } from "@apollo/client/react";
import { useMemo, useState } from "react";

import TenantAction from "../Components/tenant/TenantAction";
import TenantForm from "../Components/tenant/TenantForm";
import CircularIndeterminate from "../include/Loading";
import EmptyData from "../include/EmptyData";
import { GET_TENANTS } from "../../graphql/queries";
import { translateLauguage } from "../function/translate";
import { useAuth } from "../Context/AuthContext";

export default function Tenant() {
  const theme = useTheme();
  const { language, user } = useAuth();
  const { t } = translateLauguage(language);
  const [keyword, setKeyword] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [open, setOpen] = useState(false);

  const isSuperAdmin = user?.role === "superAdmin";
  const { data, loading, refetch } = useQuery(GET_TENANTS, {
    variables: {
      active: activeFilter === "all" ? null : activeFilter === "active",
    },
    skip: !isSuperAdmin,
    fetchPolicy: "cache-and-network",
  });

  const filteredTenants = useMemo(
    () => {
      const tenants = data?.getTenants || [];
      return (
      tenants.filter((tenant) => {
        const q = keyword.toLowerCase();
        return [tenant.nameKh, tenant.nameEn, tenant.email, tenant.phone]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(q));
      })
      );
    },
    [data?.getTenants, keyword],
  );

  if (!isSuperAdmin) {
    return (
      <Paper sx={{ p: 3, borderRadius: 1 }}>
        <Typography variant="h6" fontWeight={700}>
          {t("tenant") || "Tenant"}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Only super admins can create tenants and assign business owners.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", md: "center" }} spacing={2} sx={{ mb: 2.5 }}>
        <Box>
          <Typography variant="h5" fontWeight={800}>
            {t("tenants") || "Tenants"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("manage_tenants") || "Create tenant accounts and assign their business owner."}
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<QueueOutlinedIcon />} onClick={() => setOpen(true)} sx={{ alignSelf: { xs: "flex-end", md: "center" } }}>
          {t("create_tenant") || "Create Tenant"}
        </Button>
      </Stack>

      <Paper sx={{ p: 2, mb: 2, borderRadius: 1 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <Box sx={{ width: { xs: "100%", sm: 250 } }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: "uppercase", letterSpacing: "0.04em" }}>
              {t("search")}
            </Typography>
            <TextField
              size="small"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder={`${t("search")}...`}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box sx={{ width: { xs: "100%", sm: 180 } }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: "uppercase", letterSpacing: "0.04em" }}>
              {t("status")}
            </Typography>
            <TextField select size="small" value={activeFilter} onChange={(event) => setActiveFilter(event.target.value)} fullWidth>
              <MenuItem value="all">{t("all")}</MenuItem>
              <MenuItem value="active">{t("active")}</MenuItem>
              <MenuItem value="inactive">{t("inactive")}</MenuItem>
            </TextField>
          </Box>
        </Stack>
      </Paper>

      <TableContainer component={Paper} sx={{ borderRadius: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("tenant") || "Tenant"}</TableCell>
              <TableCell>{t("phone")}</TableCell>
              <TableCell>{t("email")}</TableCell>
              <TableCell>{t("address")}</TableCell>
              <TableCell align="center">{t("status")}</TableCell>
              <TableCell>{t("create_at") || "Created At"}</TableCell>
              <TableCell align="right">{t("action")}</TableCell>
            </TableRow>
          </TableHead>
          {loading ? (
            <CircularIndeterminate cols={7} />
          ) : filteredTenants.length === 0 ? (
            <EmptyData />
          ) : (
            <TableBody>
              {filteredTenants.map((tenant) => {
                const name = language === "kh" ? tenant.nameKh || tenant.nameEn : tenant.nameEn || tenant.nameKh;
                return (
                  <TableRow key={tenant._id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={1.25} alignItems="center">
                        <Avatar src={tenant.logo} variant="rounded" sx={{ bgcolor: theme.palette.primary.main, borderRadius: 1 }}>
                          <BusinessOutlinedIcon />
                        </Avatar>
                        <Box>
                          <Typography fontWeight={700}>{name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {tenant.nameEn && tenant.nameKh ? `${tenant.nameEn} / ${tenant.nameKh}` : tenant._id}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>{tenant.phone || "-"}</TableCell>
                    <TableCell>{tenant.email || "-"}</TableCell>
                    <TableCell>{tenant.address || "-"}</TableCell>
                    <TableCell align="center">
                      <Chip size="small" color={tenant.active ? "success" : "default"} label={tenant.active ? t("active") : t("inactive")} />
                    </TableCell>
                    <TableCell>{tenant.createdAt ? new Date(tenant.createdAt).toLocaleDateString() : "-"}</TableCell>
                    <TableCell align="right">
                      <TenantAction tenantData={tenant} setRefetch={refetch} t={t} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          )}
        </Table>
      </TableContainer>

      <TenantForm open={open} onClose={() => setOpen(false)} dialogTitle="Create" setRefetch={refetch} t={t} />
    </Box>
  );
}
