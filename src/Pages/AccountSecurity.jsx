import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  TextField,
  Switch,
  Snackbar,
  Alert,
  CircularProgress,
  Grid,
} from "@mui/material";
import { ShieldCheck, Key, Mail, Smartphone } from "lucide-react";
import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";

import { AccountSecuritySkeleton } from "../include/Skeletons";

const GET_ACCOUNT_SECURITY = gql`
  query GetAccountSecurity {
    getAccountSecurity {
      twoFactorEnabled
      recoveryEmail
      trustedDevices
      passwordUpdatedAt
      securityScore
    }
  }
`;

const ENABLE_2FA = gql`
  mutation {
    enableTwoFactor {
      isSuccess
      message {
        messageEn
      }
    }
  }
`;

const DISABLE_2FA = gql`
  mutation {
    disableTwoFactor {
      isSuccess
      message {
        messageEn
      }
    }
  }
`;

const CHANGE_EMAIL = gql`
  mutation ChangeEmail($newEmail: String!) {
    changeEmail(newEmail: $newEmail) {
      isSuccess
      message {
        messageEn
      }
    }
  }
`;

export default function AccountSecurity() {
  const { data, loading, refetch } = useQuery(
    GET_ACCOUNT_SECURITY,
    {
      fetchPolicy: "network-only",
    }
  );

  const [enable2FA, { loading: toggling2FA }] =
    useMutation(ENABLE_2FA);

  const [disable2FA] = useMutation(DISABLE_2FA);

  const [changeEmail, { loading: changingEmail }] =
    useMutation(CHANGE_EMAIL);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [emailInput, setEmailInput] = useState("");

  const handleToggle2FA = async (currentStatus) => {
    try {
      const { data: res } = currentStatus
        ? await disable2FA()
        : await enable2FA();

      const result = currentStatus
        ? res?.disableTwoFactor
        : res?.enableTwoFactor;

      if (result?.isSuccess) {
        setToast({
          open: true,
          message: result.message.messageEn,
          severity: "success",
        });

        refetch();
      }
    } catch (err) {
      console.error(err);

      setToast({
        open: true,
        message: "Failed to toggle 2FA.",
        severity: "error",
      });
    }
  };

  const handleUpdateEmail = async () => {
    if (!emailInput.trim()) return;

    try {
      const { data: res } = await changeEmail({
        variables: {
          newEmail: emailInput,
        },
      });

      if (res?.changeEmail?.isSuccess) {
        setToast({
          open: true,
          message: res.changeEmail.message.messageEn,
          severity: "success",
        });

        setEmailInput("");
        refetch();
      }
    } catch (err) {
      console.error(err);

      setToast({
        open: true,
        message: "Failed to update email.",
        severity: "error",
      });
    }
  };

  const sec = data?.getAccountSecurity;
  const score = sec?.securityScore ?? 0;

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        bgcolor: "background.default",
        minHeight: "100vh",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        mb={4}
      >
        <Box sx={{ color: "#1976D2" }}>
          <ShieldCheck size={32} />
        </Box>

        <Box sx={{ textAlign: "start" }}>
          <Typography
            variant="h4"
            fontWeight="700"
            color="text.primary"
          >
            Account Security
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Manage your account protection and authentication
            methods.
          </Typography>
        </Box>
      </Stack>

      {loading ? (
        <AccountSecuritySkeleton />
      ) : (
        <Grid container spacing={3}>
          <Grid size={{xs:12, md:4}}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "none",
                textAlign: "center",
                bgcolor: "background.paper",
                height: "100%",
              }}
            >
              <Typography
                variant="h6"
                fontWeight="600"
                mb={2}
              >
                Security Score
              </Typography>

              <Box
                sx={{
                  position: "relative",
                  display: "inline-flex",
                  mb: 2,
                }}
              >
                <CircularProgress
                  variant="determinate"
                  value={score}
                  size={120}
                  thickness={4}
                  color={
                    score > 80 ? "success" : "warning"
                  }
                />

                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="h4"
                    fontWeight="700"
                  >
                    {score}
                  </Typography>
                </Box>
              </Box>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Your account security is{" "}
                {score > 80
                  ? "excellent"
                  : "moderate"}
                .
              </Typography>
            </Paper>
          </Grid>

          <Grid  size={{xs:12, md:8}}>
            <Stack spacing={3}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: "none",
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      mb={1}
                    >
                      <Key size={20} />
                      <Typography
                        variant="subtitle1"
                        fontWeight="600"
                      >
                        Password
                      </Typography>
                    </Stack>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Last updated on{" "}
                      {sec?.passwordUpdatedAt
                        ? new Date(
                            sec.passwordUpdatedAt
                          ).toLocaleDateString()
                        : "Never"}
                    </Typography>
                  </Box>

                  <Button
                    variant="outlined"
                    sx={{ textTransform: "none" }}
                  >
                    Change Password
                  </Button>
                </Stack>
              </Paper>

              <Paper
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: "none",
                }}
              >
                <Box mb={2}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    mb={1}
                  >
                    <Mail size={20} />

                    <Typography
                      variant="subtitle1"
                      fontWeight="600"
                    >
                      Recovery Email
                    </Typography>
                  </Stack>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {sec?.recoveryEmail ||
                      "No recovery email set."}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={2}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="New Recovery Email"
                    value={emailInput}
                    onChange={(e) =>
                      setEmailInput(e.target.value)
                    }
                  />

                  <Button
                    variant="contained"
                    onClick={handleUpdateEmail}
                    disabled={
                      changingEmail || !emailInput
                    }
                    sx={{ textTransform: "none" }}
                  >
                    Update
                  </Button>
                </Stack>
              </Paper>

              <Paper
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: "none",
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      mb={1}
                    >
                      <Smartphone size={20} />

                      <Typography
                        variant="subtitle1"
                        fontWeight="600"
                      >
                        Two-Factor Authentication (2FA)
                      </Typography>
                    </Stack>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Add an extra layer of security to
                      your account.
                    </Typography>
                  </Box>

                  <Switch
                    checked={
                      !!sec?.twoFactorEnabled
                    }
                    onChange={() =>
                      handleToggle2FA(
                        sec?.twoFactorEnabled
                      )
                    }
                    disabled={toggling2FA}
                  />
                </Stack>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      )}

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() =>
          setToast((prev) => ({
            ...prev,
            open: false,
          }))
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}