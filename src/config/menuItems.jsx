import React from "react";
import InventoryIcon from "@mui/icons-material/Inventory";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PeopleIcon from "@mui/icons-material/People";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";

export const menuItems = [
  {
    text: "Product Inventory",
    path: "/",
    icon: <InventoryIcon fontSize="small" />,
  },
  {
    text: "Accounting",
    path: "/accounting",
    icon: <AccountBalanceIcon fontSize="small" />,
  },
  {
    text: "Supply Chain",
    path: "/supply-chain",
    icon: <LocalShippingIcon fontSize="small" />,
  },
  {
    text: "Customer Management",
    path: "/customers",
    icon: <PeopleIcon fontSize="small" />,
  },
  {
    text: "POS",
    path: "/pos",
    icon: <PointOfSaleIcon fontSize="small" />,
  },
];
