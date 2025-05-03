import React from "react";
import { Box, Typography, Skeleton } from "@mui/material";
import PropTypes from "prop-types";

const StatsCard = ({ title, value, loading = false }) => {
  // Ensure the value is displayable, handle nulls/undefined
  const displayValue = value !== undefined && value !== null ? value : 0;

  return (
    <Box
      sx={{
        p: 2.5,
        height: "100%",
        border: "1px solid #e0e0e0",
        borderRadius: "4px",
        bgcolor: "white",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      <Typography
        variant="body1"
        sx={{
          mb: 0.5,
          color: "text.secondary",
          fontSize: "0.9rem",
        }}
      >
        {title}
      </Typography>
      {loading ? (
        <Skeleton
          variant="text"
          width="60%"
          sx={{
            fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" },
            mb: 0.5,
          }}
        />
      ) : (
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" },
          }}
        >
          {displayValue}
        </Typography>
      )}
    </Box>
  );
};

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  loading: PropTypes.bool,
};

export default StatsCard;
