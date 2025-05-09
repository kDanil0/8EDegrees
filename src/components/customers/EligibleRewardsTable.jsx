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
  Chip,
  Button,
} from "@mui/material";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";

const EligibleRewardsTable = ({
  rewards,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onAddRewardClick,
  onPointsRateClick,
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "primary.main",
            display: "flex",
            alignItems: "center",
            borderLeft: 4,
            borderColor: "primary.main",
            pl: 2,
            fontWeight: 500,
          }}
        >
          Rewards
        </Typography>
        <Box>
          <Button
            color="primary"
            startIcon={<SettingsIcon />}
            onClick={onPointsRateClick}
            size="small"
            sx={{ mr: 1 }}
          >
            Points Rate
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={onAddRewardClick}
          >
            Add Reward
          </Button>
        </Box>
      </Box>

      <TableContainer sx={{ flexGrow: 1 }}>
        <Table
          size="small"
          aria-label="eligible rewards table"
          sx={{
            width: "100%",
            tableLayout: "fixed",
          }}
        >
          <TableHead>
            <TableRow sx={{ backgroundColor: "rgba(163, 21, 21, 0.05)" }}>
              <TableCell width="25%" sx={{ py: 1.5, fontSize: "0.9rem" }}>
                Reward
              </TableCell>
              <TableCell width="50%" sx={{ py: 1.5, fontSize: "0.9rem" }}>
                Description
              </TableCell>
              <TableCell
                align="center"
                width="25%"
                sx={{ py: 1.5, fontSize: "0.9rem" }}
              >
                Points Needed
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rewards && rewards.length > 0 ? (
              rewards
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((reward) => (
                  <TableRow
                    key={reward.id}
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
                        <Chip
                          icon={<CardGiftcardIcon fontSize="small" />}
                          label={reward.name}
                          size="small"
                          sx={{
                            bgcolor: "rgba(163, 21, 21, 0.1)",
                            color: "primary.main",
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 1.5, fontSize: "0.85rem" }}>
                      {reward.description}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        py: 1.5,
                        fontWeight: "bold",
                        color: "primary.main",
                      }}
                    >
                      {reward.pointsNeeded}
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No rewards available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10]}
        component="div"
        count={rewards ? rewards.length : 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        sx={{ mt: 0.5, py: 0 }}
      />
    </Paper>
  );
};

export default EligibleRewardsTable;
