import React from "react";
import { Chip } from "@mui/material";
import PropTypes from "prop-types";

/**
 * A shared badge component for displaying stock status consistently across the application
 *
 * @param {Object} props Component props
 * @param {string} props.status The status text to display (e.g., "In Stock", "Low Stock", "Out of Stock")
 * @param {Object} props.sx Additional styles to apply to the badge
 * @param {string} props.size Size of the badge - 'small' or 'medium'
 */
const StatusBadge = ({ status, sx, size = "small", ...props }) => {
  // Normalize the status text for consistent comparison
  const normalizedStatus = status?.toLowerCase().trim() || "";

  // Determine color based on status
  let color = "success";
  if (normalizedStatus.includes("out of stock")) {
    color = "error";
  } else if (normalizedStatus.includes("low stock")) {
    color = "warning";
  }

  return (
    <Chip
      label={status}
      color={color}
      size={size}
      sx={{
        fontWeight: 500,
        ...sx,
      }}
      {...props}
    />
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  sx: PropTypes.object,
  size: PropTypes.oneOf(["small", "medium"]),
};

export default StatusBadge;
