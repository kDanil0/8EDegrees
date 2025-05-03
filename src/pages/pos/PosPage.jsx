import React, { useState, useEffect, useContext } from "react";
import { Box, Button, Typography, Snackbar, Alert } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { inventoryService } from "../../services/api/inventory";
import { posService } from "../../services/api/pos";
import { AuthContext } from "../../context/AuthContext";

// Import custom components
import CategoryGrid from "../../components/pos/CategoryGrid";
import ProductGrid from "../../components/pos/ProductGrid";
import CartSummary from "../../components/pos/CartSummary";
import DialogManager from "../../components/pos/DialogManager";
import Receipt from "../../components/pos/Receipt";

export default function PosPage() {
  // Add auth context and navigation
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Basic state
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  // Customer and rewards state
  const [customer, setCustomer] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [availableRewards, setAvailableRewards] = useState([]);
  const [appliedReward, setAppliedReward] = useState(null);

  // Dialog states
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);
  const [rewardsDialogOpen, setRewardsDialogOpen] = useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);

  // Notifications
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  // Transaction data
  const [lastTransaction, setLastTransaction] = useState(null);
  const [pointsEarned, setPointsEarned] = useState(0);

  // Load categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await inventoryService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Show notification helper
  const showNotification = (message, severity = "info") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Category and product handlers
  const handleCategorySelect = async (categoryId) => {
    setSelectedCategory(categoryId);
    try {
      const data = await posService.getProductsByCategory(categoryId);
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      showNotification("Failed to load products. Please try again.", "error");
    }
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  // Cart handlers
  const handleAddToCart = (product) => {
    const existingItem = cartItems.find(
      (item) => item.product_id === product.id
    );

    // Get the price from either sellingPrice or price field
    const productPrice = product.sellingPrice || product.price;

    if (existingItem) {
      // Update quantity if item already exists
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      // Add new item to cart
      setCartItems((prevItems) => [
        ...prevItems,
        {
          product_id: product.id,
          name: product.name,
          price: productPrice,
          quantity: 1,
          discount: 0,
        },
      ]);

      showNotification(`Added ${product.name} to cart`, "success");
    }
  };

  const handleRemoveFromCart = (productId) => {
    const existingItem = cartItems.find(
      (item) => item.product_id === productId
    );

    if (existingItem && existingItem.quantity > 1) {
      // Decrease quantity if more than 1
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.product_id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    } else {
      // Remove item completely if quantity is 1
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.product_id !== productId)
      );

      const itemName = existingItem ? existingItem.name : "Item";
      showNotification(`Removed ${itemName} from cart`, "info");
    }
  };

  // Customer dialog handlers
  const handleOpenCustomerDialog = () => {
    setCustomerDialogOpen(true);
  };

  const handleCloseCustomerDialog = () => {
    setCustomerDialogOpen(false);
  };

  const handleCustomerNameChange = (value) => {
    setCustomerName(value);
  };

  const handleCustomerPhoneChange = (value) => {
    setCustomerPhone(value);
  };

  const handleSaveCustomer = async () => {
    if (!customerName || !customerPhone) {
      showNotification("Please enter both name and phone number.", "warning");
      return;
    }

    try {
      const response = await posService.findOrCreateCustomer({
        name: customerName,
        contactNum: customerPhone,
      });

      setCustomer(response.customer);

      const isNewCustomer = response.message.includes("created");
      showNotification(
        isNewCustomer
          ? `Welcome, ${response.customer.name}! New account created.`
          : `Welcome back, ${response.customer.name}!`,
        "success"
      );

      // Check if customer has rewards
      if (response.customer.eligibleForRewards) {
        fetchAvailableRewards(response.customer.id);
      }

      handleCloseCustomerDialog();
    } catch (error) {
      console.error("Error saving customer:", error);
      showNotification("Error saving customer information.", "error");
    }
  };

  // Rewards handlers
  const fetchAvailableRewards = async (customerId) => {
    try {
      const response = await posService.getAvailableRewards(customerId);
      setAvailableRewards(response.rewards || []);
    } catch (error) {
      console.error("Error fetching rewards:", error);
    }
  };

  const handleOpenRewardsDialog = () => {
    if (!customer) {
      showNotification("Please add a customer first.", "info");
      return;
    }

    if (!customer.eligibleForRewards) {
      showNotification("Customer is not eligible for rewards.", "info");
      return;
    }

    if (cartItems.length === 0) {
      showNotification("Please add items to your cart first.", "warning");
      return;
    }

    setRewardsDialogOpen(true);
  };

  const handleCloseRewardsDialog = () => {
    setRewardsDialogOpen(false);
  };

  const handleApplyReward = (reward) => {
    setAppliedReward(reward);
    setRewardsDialogOpen(false);

    showNotification(`Reward applied: ${reward.name}`, "success");
  };

  // Process order
  const handleProcessOrder = async () => {
    if (cartItems.length === 0) {
      showNotification("Cart is empty. Please add items.", "warning");
      return;
    }

    try {
      // If a reward is being applied, redeem it first
      let rewardApplied = false;
      if (appliedReward && customer) {
        try {
          await posService.redeemReward(customer.id, appliedReward.id);
          rewardApplied = true;
        } catch (error) {
          console.error("Error redeeming reward:", error);
          showNotification("Error applying reward. Please try again.", "error");
          return; // Stop the process if reward redemption fails
        }
      }

      const orderData = {
        customer_id: customer?.id || null,
        items: cartItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount,
        })),
        is_discount: rewardApplied,
      };

      const response = await posService.processTransaction(orderData);

      // Save transaction data for receipt
      setLastTransaction(response.transaction);
      setPointsEarned(response.points_earned || 0);

      // Show receipt first, before trying to refresh customer data
      setReceiptDialogOpen(true);
      showNotification("Order processed successfully!", "success");

      // Refresh customer data if available (do this after showing the receipt)
      if (customer?.id && customer?.contactNum) {
        try {
          // Wrap in a setTimeout to avoid blocking the UI
          setTimeout(async () => {
            try {
              const customerResponse = await posService.getCustomerByPhone(
                customer.contactNum
              );
              if (customerResponse && !customerResponse.message) {
                setCustomer(customerResponse);
              }
            } catch (error) {
              // Just log the error but don't show it to the user
              // since the main transaction was successful
              console.log("Could not refresh customer data:", error);
            }
          }, 500);
        } catch (error) {
          // Just log the error but don't show to user
          console.log("Error setting up customer refresh:", error);
        }
      }
    } catch (error) {
      console.error("Error processing order:", error);
      showNotification("Error processing order. Please try again.", "error");
    }
  };

  // Receipt handlers
  const handleCloseReceipt = () => {
    setReceiptDialogOpen(false);

    // Reset cart and transaction data
    setCartItems([]);
    setAppliedReward(null);
    setLastTransaction(null);
    setPointsEarned(0);

    // Reset customer data
    setCustomer(null);
    setCustomerName("");
    setCustomerPhone("");
    setAvailableRewards([]);

    // Return to categories view
    setSelectedCategory(null);

    // Show success notification
    showNotification("Ready for a new transaction", "success");
  };

  // Calculate totals
  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const calculateDiscount = () => {
    return appliedReward ? appliedReward.pointsNeeded : 0;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    return Math.max(subtotal - discount, 0);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box
        sx={{
          backgroundColor: "#a31515",
          color: "white",
          padding: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">8E Degrees - POS System</Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          {selectedCategory && (
            <Button
              startIcon={<ArrowBackIcon />}
              variant="contained"
              color="secondary"
              onClick={handleBackToCategories}
            >
              Back to Categories
            </Button>
          )}
          <Button
            startIcon={<LogoutIcon />}
            variant="outlined"
            color="inherit"
            onClick={handleLogout}
            sx={{
              borderColor: "white",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
                borderColor: "white",
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "row",
          height: "calc(100vh - 80px)",
        }}
      >
        {/* Left Side - Categories/Products */}
        <Box
          sx={{
            width: "70%",
            padding: 2,
            backgroundColor: "#f5f5f5",
            overflowY: "auto",
          }}
        >
          {!selectedCategory ? (
            <CategoryGrid
              categories={categories}
              onSelectCategory={handleCategorySelect}
            />
          ) : (
            <ProductGrid
              products={products}
              onSelectProduct={handleAddToCart}
            />
          )}
        </Box>

        {/* Right Side - Cart & Order Summary */}
        <Box
          sx={{
            width: "30%",
            backgroundColor: "#e0e0e0",
          }}
        >
          <CartSummary
            cartItems={cartItems}
            customer={customer}
            appliedReward={appliedReward}
            onAddItem={handleAddToCart}
            onRemoveItem={handleRemoveFromCart}
            onOpenCustomerDialog={handleOpenCustomerDialog}
            onOpenRewardsDialog={handleOpenRewardsDialog}
            onProcessOrder={handleProcessOrder}
            calculateSubtotal={calculateSubtotal}
            calculateDiscount={calculateDiscount}
            calculateTotal={calculateTotal}
          />
        </Box>
      </Box>

      {/* Dialogs */}
      <DialogManager
        customerDialogOpen={customerDialogOpen}
        rewardsDialogOpen={rewardsDialogOpen}
        customerName={customerName}
        customerPhone={customerPhone}
        availableRewards={availableRewards}
        onCustomerNameChange={handleCustomerNameChange}
        onCustomerPhoneChange={handleCustomerPhoneChange}
        onCloseCustomerDialog={handleCloseCustomerDialog}
        onSaveCustomer={handleSaveCustomer}
        onCloseRewardsDialog={handleCloseRewardsDialog}
        onApplyReward={handleApplyReward}
      />

      {/* Receipt Dialog */}
      <Receipt
        open={receiptDialogOpen}
        onClose={handleCloseReceipt}
        transaction={lastTransaction}
        customer={customer}
        cartItems={cartItems}
        subtotal={calculateSubtotal()}
        discount={calculateDiscount()}
        total={calculateTotal()}
        pointsEarned={pointsEarned}
        appliedReward={appliedReward}
      />

      {/* Enhanced Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          variant="filled"
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
