import React from "react";
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Box,
  Avatar,
  Chip,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

const RecentCustomersTable = ({
  customers,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  title = "Recent Customers",
}) => {
  return (
    <Paper
      sx={{
        p: 2,
        height: "400px",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          color: "primary.main",
          display: "flex",
          alignItems: "center",
          borderLeft: 4,
          borderColor: "primary.main",
          pl: 2,
          fontWeight: 500,
        }}
      >
        {title}
      </Typography>

      <TableContainer sx={{ flexGrow: 1 }}>
        <Table
          size="small"
          aria-label="customer table"
          sx={{
            width: "100%",
            tableLayout: "fixed",
          }}
        >
          <TableHead>
            <TableRow sx={{ backgroundColor: "rgba(163, 21, 21, 0.05)" }}>
              <TableCell width="45%" sx={{ py: 1.5, fontSize: "0.9rem" }}>
                Customer
              </TableCell>
              <TableCell
                align="right"
                width="25%"
                sx={{ py: 1.5, fontSize: "0.9rem" }}
              >
                Total Points
              </TableCell>
              <TableCell
                align="center"
                width="30%"
                sx={{ py: 1.5, fontSize: "0.9rem" }}
              >
                Eligible for Rewards
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers && customers.length > 0 ? (
              customers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((customer) => (
                  <TableRow
                    key={customer.id}
                    sx={{
                      "&:nth-of-type(even)": {
                        backgroundColor: "rgba(163, 21, 21, 0.02)",
                      },
                      "&:hover": {
                        backgroundColor: "rgba(163, 21, 21, 0.05)",
                      },
                    }}
                  >
                    <TableCell component="th" scope="row" sx={{ py: 1.5 }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          sx={{
                            bgcolor: "rgba(163, 21, 21, 0.1)",
                            color: "primary.main",
                            width: 28,
                            height: 28,
                            mr: 1,
                          }}
                        >
                          <PersonIcon fontSize="small" />
                        </Avatar>
                        <Typography variant="body2">{customer.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ py: 1.5, fontSize: "0.9rem" }}
                    >
                      {customer.points}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        py: 1.5,
                      }}
                    >
                      <Chip
                        label={customer.eligibleForRewards ? "Yes" : "No"}
                        size="small"
                        color={
                          customer.eligibleForRewards ? "primary" : "default"
                        }
                        sx={{
                          fontWeight: customer.eligibleForRewards
                            ? "bold"
                            : "normal",
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No customers available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={customers ? customers.length : 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        sx={{ mt: 0.5, py: 0 }}
      />
    </Paper>
  );
};

export default RecentCustomersTable;
