import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import PercentIcon from "@mui/icons-material/Percent";
import SettingsIcon from "@mui/icons-material/Settings";
import { customerService } from "../../services/api/customer";
import DiscountManagementModal from "./DiscountManagementModal";

const DiscountManagementCard = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const data = await customerService.getDiscounts();
      setDiscounts(data);
    } catch (error) {
      console.error("Error fetching discounts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    fetchDiscounts(); // Refresh discounts after modal is closed
  };

  // Get active discounts count
  const activeDiscountsCount = discounts.filter((d) => d.is_active).length;

  return (
    <>
      <Card variant="outlined" sx={{ height: "100%" }}>
        <CardHeader
          title={
            <Box display="flex" alignItems="center">
              <PercentIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Discounts</Typography>
            </Box>
          }
          action={
            <Tooltip title="Manage Discounts">
              <IconButton onClick={handleOpenModal} color="primary">
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          }
        />
        <CardContent>
          {loading ? (
            <Box display="flex" justifyContent="center" my={3}>
              <CircularProgress size={30} />
            </Box>
          ) : (
            <>
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Manage percentage-based discounts for special customers
                  (Senior, PWD, etc.)
                </Typography>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  bgcolor="action.hover"
                  p={1.5}
                  borderRadius={1}
                  mt={1}
                >
                  <Typography>Total Discounts</Typography>
                  <Chip label={discounts.length} color="primary" size="small" />
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  bgcolor="action.hover"
                  p={1.5}
                  borderRadius={1}
                  mt={1}
                >
                  <Typography>Active Discounts</Typography>
                  <Chip
                    label={activeDiscountsCount}
                    color="success"
                    size="small"
                  />
                </Box>
              </Box>

              {discounts.length > 0 ? (
                <Box sx={{ maxHeight: "300px", overflow: "auto" }}>
                  <Stack spacing={1} mt={2}>
                    {discounts.map((discount) => (
                      <Box
                        key={discount.id}
                        p={1}
                        borderRadius={1}
                        border="1px solid"
                        borderColor="divider"
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {discount.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {discount.description || "No description"}
                          </Typography>
                        </Box>
                        <Chip
                          label={`${discount.percentage}%`}
                          size="small"
                          color={discount.is_active ? "success" : "default"}
                        />
                      </Box>
                    ))}
                  </Stack>
                </Box>
              ) : (
                <Typography
                  textAlign="center"
                  sx={{ my: 4 }}
                  color="text.secondary"
                >
                  No discounts available
                </Typography>
              )}

              <Box display="flex" justifyContent="center" mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenModal}
                >
                  Manage Discounts
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </Card>

      <DiscountManagementModal open={modalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default DiscountManagementCard;
