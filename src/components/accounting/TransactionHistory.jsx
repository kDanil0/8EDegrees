import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Divider,
  TextField,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
} from "@mui/material";
import { accountingService } from "../../services/api";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";

const TransactionHistory = () => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    status: "",
    customer_id: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Detail view state
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Refund/Cancel dialogs
  const [refundOpen, setRefundOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      // Only send non-empty filters
      const activeFilters = {};
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          activeFilters[key] = filters[key];
        }
      });

      const data = await accountingService.getTransactions(activeFilters);
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleSearch = () => {
    fetchTransactions();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetails = async (transaction) => {
    setSelectedTransaction(transaction);
    setDetailOpen(true);
  };

  const handleRefundClick = (transaction) => {
    setSelectedTransaction(transaction);
    setReason("");
    setRefundOpen(true);
  };

  const handleCancelClick = (transaction) => {
    setSelectedTransaction(transaction);
    setReason("");
    setCancelOpen(true);
  };

  const handleRefundConfirm = async () => {
    if (!reason.trim()) {
      return;
    }

    setProcessing(true);
    try {
      await accountingService.refundTransaction(selectedTransaction.id, {
        reason,
      });
      setRefundOpen(false);
      fetchTransactions();
    } catch (error) {
      console.error("Error refunding transaction:", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleCancelConfirm = async () => {
    if (!reason.trim()) {
      return;
    }

    setProcessing(true);
    try {
      await accountingService.cancelTransaction(selectedTransaction.id, {
        reason,
      });
      setCancelOpen(false);
      fetchTransactions();
    } catch (error) {
      console.error("Error canceling transaction:", error);
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  const formatCurrency = (amount) => {
    return `₱${parseFloat(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getStatusChipColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "refunded":
        return "warning";
      case "canceled":
        return "error";
      default:
        return "default";
    }
  };

  const getPaymentBadge = (mode, reference) => {
    if (mode === "cash") {
      return (
        <Chip size="small" label="Cash" color="primary" variant="outlined" />
      );
    } else if (mode === "ewallet") {
      return (
        <Box>
          <Chip
            size="small"
            label="E-Wallet"
            color="secondary"
            variant="outlined"
          />
          {reference && (
            <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
              Ref: {reference}
            </Typography>
          )}
        </Box>
      );
    }
    return null;
  };

  return (
    <Box>
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden", mb: 4 }}>
        <Box
          sx={{
            p: 2,
            background: "#a31515",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Transaction History
          </Typography>
          <Button
            variant="contained"
            color="inherit"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={fetchTransactions}
            sx={{ color: "#a31515", background: "white" }}
          >
            Refresh
          </Button>
        </Box>

        <Box sx={{ p: 2, display: "flex", flexWrap: "wrap", gap: 2 }}>
          <TextField
            label="Start Date"
            type="date"
            name="start_date"
            value={filters.start_date}
            onChange={handleFilterChange}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
          <TextField
            label="End Date"
            type="date"
            name="end_date"
            value={filters.end_date}
            onChange={handleFilterChange}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
          <TextField
            select
            label="Status"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            size="small"
            sx={{ minWidth: 150 }}
            SelectProps={{ native: true }}
          >
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="refunded">Refunded</option>
            <option value="canceled">Canceled</option>
          </TextField>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
          >
            Search
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Payment Mode</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.id}</TableCell>
                          <TableCell>
                            {formatDate(transaction.timestamp)}
                          </TableCell>
                          <TableCell>
                            {transaction.customer
                              ? transaction.customer.name
                              : "Walk-in Customer"}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(transaction.total_amount)}
                          </TableCell>
                          <TableCell>
                            {getPaymentBadge(
                              transaction.payment_mode,
                              transaction.reference_number
                            )}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={transaction.status}
                              color={getStatusChipColor(transaction.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Box
                              sx={{
                                display: "flex",
                                gap: 1,
                                justifyContent: "center",
                              }}
                            >
                              <Button
                                size="small"
                                variant="text"
                                onClick={() => handleViewDetails(transaction)}
                              >
                                View
                              </Button>

                              {transaction.status === "completed" && (
                                <>
                                  <Button
                                    size="small"
                                    color="warning"
                                    variant="contained"
                                    onClick={() =>
                                      handleRefundClick(transaction)
                                    }
                                  >
                                    Refund
                                  </Button>
                                  <Button
                                    size="small"
                                    color="error"
                                    variant="contained"
                                    onClick={() =>
                                      handleCancelClick(transaction)
                                    }
                                  >
                                    Cancel
                                  </Button>
                                </>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={transactions.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        )}
      </Paper>

      {/* Transaction Detail Dialog */}
      <Dialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Transaction Details
          <IconButton
            aria-label="close"
            onClick={() => setDetailOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedTransaction && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Transaction Info
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    ID
                  </Typography>
                  <Typography variant="body1">
                    {selectedTransaction.id}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Date & Time
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(selectedTransaction.timestamp)}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Status
                  </Typography>
                  <Chip
                    label={selectedTransaction.status}
                    color={getStatusChipColor(selectedTransaction.status)}
                    size="small"
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Payment Mode
                  </Typography>
                  <Chip
                    label={
                      selectedTransaction.payment_mode === "cash"
                        ? "Cash"
                        : "E-Wallet"
                    }
                    color={
                      selectedTransaction.payment_mode === "cash"
                        ? "primary"
                        : "secondary"
                    }
                    variant="outlined"
                    size="small"
                  />
                </Box>
                {selectedTransaction.payment_mode === "ewallet" && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      Reference Number
                    </Typography>
                    <Typography variant="body1">
                      {selectedTransaction.reference_number || "N/A"}
                    </Typography>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Customer Info
                </Typography>
                {selectedTransaction.customer ? (
                  <>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">
                        Name
                      </Typography>
                      <Typography variant="body1">
                        {selectedTransaction.customer.name}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">
                        Contact
                      </Typography>
                      <Typography variant="body1">
                        {selectedTransaction.customer.contactNum || "N/A"}
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <Typography variant="body1">Walk-in Customer</Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Items
                </Typography>
                <TableContainer
                  component={Paper}
                  variant="outlined"
                  sx={{ mt: 1 }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Unit Price</TableCell>
                        <TableCell align="right">Discount</TableCell>
                        <TableCell align="right">Subtotal</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedTransaction.items &&
                        selectedTransaction.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.product.name}</TableCell>
                            <TableCell align="right">{item.quantity}</TableCell>
                            <TableCell align="right">
                              {formatCurrency(item.price)}
                            </TableCell>
                            <TableCell align="right">
                              {formatCurrency(item.discount || 0)}
                            </TableCell>
                            <TableCell align="right">
                              {formatCurrency(
                                item.subtotal - (item.discount || 0)
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box sx={{ mt: 2, textAlign: "right" }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Total Amount:{" "}
                    {formatCurrency(selectedTransaction.total_amount)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>

      {/* Refund Dialog */}
      <Dialog
        open={refundOpen}
        onClose={() => !processing && setRefundOpen(false)}
      >
        <DialogTitle>Refund Transaction</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will refund the transaction but the product quantities will NOT
            be returned to inventory.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for Refund"
            fullWidth
            variant="outlined"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={processing}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRefundOpen(false)} disabled={processing}>
            Cancel
          </Button>
          <Button
            onClick={handleRefundConfirm}
            color="warning"
            variant="contained"
            disabled={processing || !reason.trim()}
          >
            {processing ? <CircularProgress size={24} /> : "Refund"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog
        open={cancelOpen}
        onClose={() => !processing && setCancelOpen(false)}
      >
        <DialogTitle>Cancel Transaction</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will cancel the transaction and return the product quantities
            to inventory.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for Cancellation"
            fullWidth
            variant="outlined"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={processing}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelOpen(false)} disabled={processing}>
            No
          </Button>
          <Button
            onClick={handleCancelConfirm}
            color="error"
            variant="contained"
            disabled={processing || !reason.trim()}
          >
            {processing ? <CircularProgress size={24} /> : "Yes, Cancel"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TransactionHistory;
