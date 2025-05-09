import React, { useRef, useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  Typography,
  Box,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import PaymentIcon from "@mui/icons-material/Payment";

// CSS for print mode to match the 58mm receipt style
const printStyles = `
  @page {
    size: 58mm auto;
    margin: 0mm;
  }
  body {
    margin: 0;
    padding: 5mm;
    font-family: "Courier New", monospace;
    width: 58mm;
    box-sizing: border-box;
  }
  .receipt-header {
    text-align: center;
    font-size: 10px;
  }
  .receipt-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 5px;
    text-align: center;
  }
  .receipt-info {
    font-size: 10px;
    margin: 2px 0;
  }
  .receipt-divider {
    border-top: 1px dotted #000;
    margin: 5px 0;
    width: 100%;
  }
  .receipt-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 9px;
  }
  .receipt-table th, .receipt-table td {
    padding: 2px;
    font-size: 9px;
    text-align: left;
  }
  .receipt-table th:last-child, .receipt-table td:last-child {
    text-align: right;
  }
  .receipt-total {
    font-size: 11px;
    font-weight: bold;
    text-align: right;
  }
  .receipt-footer {
    margin-top: 8px;
    font-size: 10px;
    text-align: center;
  }
  p, h1, h2, h3, h4, h5, h6 {
    margin: 2px 0;
  }
  table {
    width: 100%;
  }
`;

/**
 * Component for displaying and printing e-receipts
 */
const Receipt = ({
  open,
  onClose,
  transaction,
  customer,
  cartItems,
  subtotal,
  discount,
  total,
  pointsEarned,
  appliedReward,
  tenderedCash,
  change,
  paymentMode,
  referenceNumber,
  selectedDiscount,
}) => {
  const receiptRef = useRef(null);
  const printFrameRef = useRef(null);
  const currentDate = new Date().toLocaleString();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isPrinting, setIsPrinting] = useState(false);

  // Calculate the percentage discount amount if a discount is selected
  const percentageDiscountAmount = selectedDiscount
    ? (subtotal * selectedDiscount.percentage) / 100
    : 0;

  // Initialize iframe for printing
  useEffect(() => {
    // Create iframe for printing if it doesn't exist
    if (!document.getElementById("receipt-print-frame")) {
      const iframe = document.createElement("iframe");
      iframe.id = "receipt-print-frame";
      iframe.name = "receipt-print-frame";
      iframe.style.position = "absolute";
      iframe.style.top = "-999px";
      iframe.style.left = "-999px";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "0";
      document.body.appendChild(iframe);
      printFrameRef.current = iframe;
    } else {
      printFrameRef.current = document.getElementById("receipt-print-frame");
    }

    // Cleanup iframe when component unmounts
    return () => {
      // We'll keep the iframe for reuse
    };
  }, []);

  // Direct printing method using iframe
  const handlePrint = () => {
    if (isPrinting) return; // Prevent multiple click

    try {
      setIsPrinting(true);

      // Get the iframe document
      const iframe = printFrameRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

      // Write receipt content to iframe
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Receipt-${transaction?.id || "POS"}</title>
          <style>${printStyles}</style>
        </head>
        <body>
          ${receiptRef.current.innerHTML}
        </body>
        </html>
      `);
      iframeDoc.close();

      // Handle print completion
      if (iframe.contentWindow.onafterprint === undefined) {
        // For browsers that don't support onafterprint
        iframe.contentWindow.addEventListener("afterprint", () => {
          setIsPrinting(false);
          showSnackbar("Receipt printed successfully");
        });
      } else {
        iframe.contentWindow.onafterprint = () => {
          setIsPrinting(false);
          showSnackbar("Receipt printed successfully");
        };
      }

      // Print with a slight delay to ensure content is rendered
      setTimeout(() => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();

        // Fallback for browsers where afterprint doesn't fire
        setTimeout(() => {
          if (isPrinting) {
            setIsPrinting(false);
            showSnackbar("Receipt printed successfully");
          }
        }, 2000);
      }, 200);
    } catch (error) {
      console.error("Print error:", error);
      setIsPrinting(false);
      showSnackbar("Error printing receipt", "error");
    }
  };

  // Show a snackbar notification
  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Format date for receipt
  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
  };

  if (!open) return null;

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogContent>
          {/* Printable receipt content */}
          <Paper
            ref={receiptRef}
            className="receipt-to-print"
            sx={{
              p: 3,
              width: "220px", // Approximate 58mm width for on-screen display
              minHeight: "60vh",
              margin: "0 auto", // Center on screen
              fontFamily: "'Courier New', monospace",
            }}
          >
            <Box className="receipt-header">
              <Typography
                variant="h5"
                className="receipt-title"
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: "18px",
                }}
              >
                8E DEGREES
              </Typography>
              <Typography
                variant="body2"
                className="receipt-info"
                align="center"
              >
                owned by: CCIS-8E
              </Typography>
              <Typography
                variant="body2"
                className="receipt-info"
                align="center"
              >
                Systems Plus College
              </Typography>
              <Typography
                variant="body2"
                className="receipt-info"
                align="center"
              >
                Foundation
              </Typography>
              <Typography
                variant="body2"
                className="receipt-info"
                align="center"
              >
                Balibago, Angeles City
              </Typography>
              <Typography
                variant="body2"
                className="receipt-info"
                align="center"
              >
                Pampanga
              </Typography>
              <Typography
                variant="body2"
                className="receipt-info"
                align="center"
              >
                Tel: (045) 123-4567
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} className="receipt-divider" />

            <Typography
              variant="body1"
              className="receipt-info"
              align="center"
              sx={{ fontWeight: "bold", my: 1 }}
            >
              --INVOICE--
            </Typography>

            <Typography variant="body2" className="receipt-info">
              Transaction ID: {transaction?.id || "TRN-000123"}
            </Typography>
            <Typography variant="body2" className="receipt-info">
              Cashier: Cashier001
            </Typography>

            <Box sx={{ mt: 1.5 }}>
              <Typography variant="body2" className="receipt-info">
                Customer Name: {customer?.name || ""}
              </Typography>
              <Typography variant="body2" className="receipt-info">
                Mode of Payment: {paymentMode === "cash" ? "Cash" : "E-Wallet"}
                {paymentMode === "ewallet" &&
                  referenceNumber &&
                  ` (Ref: ${referenceNumber})`}
              </Typography>
            </Box>

            <Divider
              sx={{ my: 1, borderStyle: "dashed", borderWidth: "1px" }}
              className="receipt-divider"
            />

            <TableContainer component={Box} sx={{ my: 1 }}>
              <Table size="small" className="receipt-table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ p: 0.5, fontSize: "10px" }}>QTY</TableCell>
                    <TableCell sx={{ p: 0.5, fontSize: "10px" }}>
                      DESCRIPTION
                    </TableCell>
                    <TableCell align="right" sx={{ p: 0.5, fontSize: "10px" }}>
                      PRICE
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item.product_id}>
                      <TableCell sx={{ p: 0.5, fontSize: "10px" }}>
                        {item.quantity}
                      </TableCell>
                      <TableCell sx={{ p: 0.5, fontSize: "10px" }}>
                        {item.name}
                        {item.is_free_item && (
                          <Typography
                            component="span"
                            sx={{
                              fontSize: "9px",
                              fontWeight: "bold",
                              color: "success.main",
                              ml: 0.5,
                            }}
                          >
                            (FREE)
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ p: 0.5, fontSize: "10px" }}
                      >
                        {item.is_free_item
                          ? "₱0.00"
                          : `₱${(item.price * item.quantity).toFixed(2)}`}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Divider
              sx={{ my: 1, borderStyle: "dashed", borderWidth: "1px" }}
              className="receipt-divider"
            />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: "10px" }} className="receipt-info">
                  Sub Total:
                </Typography>
                <Typography sx={{ fontSize: "10px" }} className="receipt-info">
                  ₱{subtotal.toFixed(2)}
                </Typography>
              </Box>

              {discount > 0 && appliedReward && (
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    sx={{ fontSize: "10px" }}
                    className="receipt-info"
                  >
                    {appliedReward.type === "percentage_discount"
                      ? `Discount (${appliedReward.value}%):`
                      : appliedReward.type === "free_item" &&
                        appliedReward.product
                      ? `Reward (Free ${appliedReward.product.name}):`
                      : `Discount (Reward):`}
                  </Typography>
                  <Typography
                    sx={{ fontSize: "10px" }}
                    className="receipt-info"
                  >
                    {appliedReward.type === "free_item"
                      ? "APPLIED"
                      : `-₱${discount.toFixed(2)}`}
                  </Typography>
                </Box>
              )}

              {selectedDiscount && (
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    sx={{ fontSize: "10px" }}
                    className="receipt-info"
                  >
                    {selectedDiscount.name} ({selectedDiscount.percentage}%):
                  </Typography>
                  <Typography
                    sx={{ fontSize: "10px" }}
                    className="receipt-info"
                  >
                    -₱{percentageDiscountAmount.toFixed(2)}
                  </Typography>
                </Box>
              )}
            </Box>

            <Divider
              sx={{ my: 1, borderStyle: "dashed", borderWidth: "1px" }}
              className="receipt-divider"
            />

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                sx={{ fontWeight: "bold", fontSize: "12px" }}
                className="receipt-total"
              >
                TOTAL:
              </Typography>
              <Typography
                sx={{ fontWeight: "bold", fontSize: "12px" }}
                className="receipt-total"
              >
                ₱{total.toFixed(2)}
              </Typography>
            </Box>

            <Divider
              sx={{ my: 1, borderStyle: "dashed", borderWidth: "1px" }}
              className="receipt-divider"
            />

            {/* Payment Information */}
            {paymentMode === "cash" && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    sx={{ fontSize: "10px" }}
                    className="receipt-info"
                  >
                    Tendered Cash:
                  </Typography>
                  <Typography
                    sx={{ fontSize: "10px" }}
                    className="receipt-info"
                  >
                    ₱{tenderedCash.toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    sx={{ fontWeight: "bold", fontSize: "10px" }}
                    className="receipt-info"
                  >
                    Change:
                  </Typography>
                  <Typography
                    sx={{ fontWeight: "bold", fontSize: "10px" }}
                    className="receipt-info"
                  >
                    ₱{change.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            )}

            <Divider
              sx={{ my: 1, borderStyle: "dashed", borderWidth: "1px" }}
              className="receipt-divider"
            />

            {/* Points Information */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: "10px" }} className="receipt-info">
                  Points Earned:
                </Typography>
                <Typography sx={{ fontSize: "10px" }} className="receipt-info">
                  {pointsEarned || 0}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: "10px" }} className="receipt-info">
                  Current Points:
                </Typography>
                <Typography sx={{ fontSize: "10px" }} className="receipt-info">
                  {customer ? customer.points || 0 : 0}
                </Typography>
              </Box>
            </Box>

            <Divider
              sx={{ my: 1, borderStyle: "dashed", borderWidth: "1px" }}
              className="receipt-divider"
            />

            <Typography variant="body2" className="receipt-info" align="center">
              Date: {formatDate(transaction?.timestamp || new Date())}
            </Typography>

            <Box sx={{ mt: 2, textAlign: "center" }} className="receipt-footer">
              <Typography variant="body2" className="receipt-info">
                Thank you for your
              </Typography>
              <Typography variant="body2" className="receipt-info">
                purchase!
              </Typography>
            </Box>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            startIcon={<CloseIcon />}
            onClick={onClose}
            className="no-print"
          >
            Close
          </Button>
          <Button
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            variant="contained"
            disabled={isPrinting}
            className="no-print"
          >
            {isPrinting ? "Printing..." : "Print"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Receipt;
