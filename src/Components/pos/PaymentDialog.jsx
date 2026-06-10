import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Box,
  FormControl,
  RadioGroup,
  Stack,
  Paper,
  FormControlLabel,
  Radio,
  Avatar,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";
import { AttachMoney, CreditCard, QrCode } from "@mui/icons-material";

const PaymentDialog = ({
  open,
  onClose,
  total,
  onCreateSale,
  language,
  creating,
  t,
  isPending = false,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [amountPaid, setAmountPaid] = useState("");
  const [steps] = useState(["payment_method", "amount"]);
  const [activeStep, setActiveStep] = useState(0);
  const [change, setChange] = useState(0);

  useEffect(() => {
    if (amountPaid && !isNaN(amountPaid)) {
      const paid = parseFloat(amountPaid);
      const changeAmount = paid - total;
      setChange(Math.max(0, changeAmount));
    } else {
      setChange(0);
    }
  }, [amountPaid, total]);

  const handleNext = () => {
    if (activeStep === 0 && !paymentMethod && !isPending) {
      return;
    }
    if (activeStep === 0 && paymentMethod === "qr" && !isPending) {
      handleComplete();
      return;
    }
    if (activeStep === 1 && !isPending && (!amountPaid || parseFloat(amountPaid) < total)) {
      return;
    }
    if (activeStep === steps.length - 1) {
      handleComplete();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleComplete = () => {
    const isQrPayment = paymentMethod === "qr" && !isPending;
    const paymentInfo = {
      method: paymentMethod,
      amountPaid: isQrPayment ? Number(total.toFixed(2)) : parseFloat(amountPaid) || 0,
      change: isQrPayment ? 0 : change,
    };
    onCreateSale(paymentInfo);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmountPaid(value);
    }
  };

  const handleExactPayment = () => {
    setAmountPaid(total.toFixed(2));
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <Stack spacing={2}>
                  {["cash", "card", "qr"].map((method) => (
                    <Paper
                      key={method}
                      variant="outlined"
                      sx={{
                        p: 2,
                        cursor: "pointer",
                        borderColor: paymentMethod === method ? "primary.main" : "divider",
                        // bgcolor: paymentMethod === method ? "primary.light" : "background.paper",
                    
                      }}
                      onClick={() => setPaymentMethod(method)}
                    >
                      <FormControlLabel
                        value={method}
                        control={<Radio />}
                        label={
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar sx={{
                              bgcolor: method === "cash" ? "success.main" :
                                method === "card" ? "info.main" : "warning.main"
                            }}>
                              {method === "cash" && <AttachMoney />}
                              {method === "card" && <CreditCard />}
                              {method === "qr" && <QrCode />}
                            </Avatar>
                            <Box>
                              <Typography fontWeight="bold">
                                {method === "cash" ? "Cash" :
                                  method === "card" ? "Card" : "QR Code"}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {method === "cash" ? "Pay with cash" :
                                  method === "card" ? "Credit/Debit card" : "Scan QR to pay"}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </Paper>
                  ))}
                </Stack>
              </RadioGroup>
            </FormControl>
            {isPending && (
              <Box sx={{ mt: 2, p: 2, bgcolor: "warning.light", borderRadius: 1 }}>
                <Typography variant="body2" color="warning.dark">
                  {language === "kh"
                    ? "វិក័យប័ត្រនេះនឹងត្រូវបានរក្សាទុកជាបណ្ដោះអាសន្ន"
                    : "This invoice will be saved as pending"}
                </Typography>
              </Box>
            )}
          </Box>
        );

      case 1:
        if (isPending) {
          return (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" gutterBottom>
                {language === "kh" ? "តម្លៃសរុប" : "Total Amount"}:{" "}
                <strong>${total.toFixed(2)}</strong>
              </Typography>
              <Box sx={{ mt: 3, p: 2, bgcolor: "info.light", borderRadius: 1 }}>
                <Typography variant="body2">
                  {language === "kh"
                    ? "អ្នកកំពុងបង្កើតវិក័យប័ត្របណ្ដោះអាសន្ន។ អ្នកអាចទូទាត់នៅពេលក្រោយ។"
                    : "You are creating a pending invoice. You can make payment later."}
                </Typography>
              </Box>
            </Box>
          );
        }
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" gutterBottom>
              {language === "kh" ? "តម្លៃសរុប" : "Total Amount"}:{" "}
              <strong>${total.toFixed(2)}</strong>
            </Typography>

            <TextField
              fullWidth
              label={language === "kh" ? "ទឹកប្រាក់ដែលទទួលបាន" : "Amount Received"}
              value={amountPaid}
              onChange={handleAmountChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              sx={{ mt: 3, mb: 2 }}
              error={amountPaid && parseFloat(amountPaid) < total}
              helperText={
                amountPaid && parseFloat(amountPaid) < total
                  ? language === "kh"
                    ? "ទឹកប្រាក់មិនគ្រប់គ្រាន់"
                    : "Insufficient amount"
                  : ""
              }
            />

            <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
              {[5, 10, 20].map((amount) => (
                <Button
                  key={amount}
                  variant="outlined"
                  onClick={() => setAmountPaid((total + amount).toFixed(2))}
                >
                  +${amount}
                </Button>
              ))}
              <Button variant="contained" onClick={handleExactPayment}>
                {t(`exact_amount`)}
              </Button>
            </Stack>

            {amountPaid && !isNaN(amountPaid) && parseFloat(amountPaid) >= total && (
              <Paper sx={{ p: 2, bgcolor: "success.light" }}>
                <Typography variant="body1" fontWeight="bold">
                  {language === "kh" ? "ការប្រាក់អាប់" : "Change Due"}: ${change.toFixed(2)}
                </Typography>
              </Paper>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">
          {isPending
            ? language === "kh"
              ? "បង្កើតវិក័យប័ត្របណ្ដោះអាសន្ន"
              : "Create Pending Invoice"
            : language === "kh"
              ? "ការទូទាត់"
              : "Payment"}
        </Typography>
      </DialogTitle>
      <DialogContent>
        {!isPending && (
          <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>
                  {index === 0
                    ? language === "kh"
                      ? "វិធីសាស្រ្តទូទាត់"
                      : "Payment Method"
                    : language === "kh"
                      ? "ចំនួនទឹកប្រាក់"
                      : "Amount"}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        )}

        {renderStepContent(isPending ? 1 : activeStep)}
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={isPending ? onClose : activeStep === 0 ? onClose : handleBack}
          color="inherit"
        >
          {isPending
            ? language === "kh"
              ? "បោះបង់"
              : "Cancel"
            : activeStep === 0
              ? language === "kh"
                ? "បោះបង់"
                : "Cancel"
              : language === "kh"
                ? "ត្រឡប់ក្រោយ"
                : "Back"}
        </Button>
        <Button
          onClick={handleNext}
          variant="contained"
          disabled={
            creating ||
            (!isPending && activeStep === 0 && !paymentMethod) ||
            (!isPending && activeStep === 1 && (!amountPaid || parseFloat(amountPaid) < total))
          }
          color={isPending ? "warning" : "primary"}
        >
          {isPending
            ? creating
              ? language === "kh"
                ? "កំពុងបង្កើត..."
                : "Creating..."
              : language === "kh"
                ? "បង្កើតវិក័យប័ត្របណ្ដោះអាសន្ន"
                : "Create Pending Invoice"
            : paymentMethod === "qr" && activeStep === 0
              ? creating
                ? "Creating QR..."
                : "Create QR"
            : activeStep === steps.length - 1
              ? creating
                ? language === "kh"
                  ? "កំពុងទូទាត់..."
                  : "Processing..."
                : language === "kh"
                  ? "បញ្ជាក់ការទូទាត់"
                  : "Confirm Payment"
              : language === "kh"
                ? "បន្ត"
                : "Continue"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentDialog;
