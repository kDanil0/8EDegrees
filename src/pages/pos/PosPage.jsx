import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  Typography,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
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
import ConfirmationDialog from "../../components/pos/ConfirmationDialog";

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

  // Tendered cash and change
  const [tenderedCash, setTenderedCash] = useState(0);
  const [change, setChange] = useState(0);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

  // Payment mode
  const [paymentMode, setPaymentMode] = useState("cash");
  const [referenceNumber, setReferenceNumber] = useState("");

  // Discount state
  const [discounts, setDiscounts] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState(null);

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

  // Load discounts on component mount
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const data = await posService.getActiveDiscounts();
        setDiscounts(data);
      } catch (error) {
        console.error("Error fetching discounts:", error);
      }
    };

    fetchDiscounts();
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

  // Handle payment mode change
  const handlePaymentModeChange = (mode) => {
    setPaymentMode(mode);
    // Reset related fields on mode change
    if (mode === "cash") {
      setReferenceNumber("");
    } else {
      setTenderedCash(0);
      setChange(0);
    }
  };

  // Handle reference number change
  const handleReferenceNumberChange = (value) => {
    setReferenceNumber(value);
  };

  // Handle tendered cash change
  const handleTenderedCashChange = (value) => {
    const parsed = parseFloat(value) || 0;
    setTenderedCash(parsed);

    // Calculate change whenever tendered cash changes
    const totalAmount = calculateTotal();
    setChange(Math.max(parsed - totalAmount, 0));
  };

  // Handle discount selection
  const handleDiscountChange = (discountId) => {
    if (!discountId) {
      setSelectedDiscount(null);
      return;
    }

    const discount = discounts.find((d) => d.id === discountId);
    setSelectedDiscount(discount);
  };

  // Calculate discount amount
  const calculateDiscountAmount = () => {
    if (!selectedDiscount) {
      return calculateDiscount(); // Use existing reward discount if no percentage discount
    }

    const subtotal = calculateSubtotal();
    return (subtotal * selectedDiscount.percentage) / 100;
  };

  // Process order - Initial handler that validates and shows confirmation
  const handleProcessOrder = async () => {
    if (cartItems.length === 0) {
      showNotification("Cart is empty. Please add items.", "warning");
      return;
    }

    // Validate based on payment mode
    if (paymentMode === "cash") {
      // Validate tendered cash
      const totalAmount = calculateTotal();
      if (tenderedCash < totalAmount) {
        showNotification(
          "Tendered cash must be greater than or equal to the total amount.",
          "warning"
        );
        return;
      }
    } else if (paymentMode === "ewallet") {
      // Validate reference number
      if (!referenceNumber) {
        showNotification(
          "Reference number is required for e-wallet payment.",
          "warning"
        );
        return;
      }
    }

    // Open confirmation dialog
    setConfirmationDialogOpen(true);
  };

  // Process transaction after confirmation
  const handleConfirmOrder = async () => {
    setConfirmationDialogOpen(false);

    // Show processing indication
    showNotification("Processing transaction...", "info");

    try {
      // If a reward is being applied, redeem it first
      let rewardApplied = false;
      if (appliedReward && customer) {
        try {
          await posService.redeemReward(customer.id, appliedReward.id);
          rewardApplied = true;
        } catch (error) {
          console.error("Error redeeming reward:", error);
          showNotification(
            "Error applying reward, but continuing transaction.",
            "warning"
          );
          // Continue with the transaction despite reward error
        }
      }

      // Build the transaction data
      const transactionData = {
        items: cartItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount || 0, // Make sure discount is included
        })),
        subtotal: calculateSubtotal(),
        discount: calculateDiscount(),
        total: calculateTotal(),
        payment_mode: paymentMode,
        tendered_cash: paymentMode === "cash" ? tenderedCash : 0,
        reference_number: paymentMode === "ewallet" ? referenceNumber : null,
        change: paymentMode === "cash" ? change : 0,
        customer_id: customer ? customer.id : null,
        reward_id: rewardApplied ? appliedReward.id : null,
        is_discount: rewardApplied || selectedDiscount !== null, // Updated for both types of discounts
        discount_id: selectedDiscount ? selectedDiscount.id : null,
      };

      // Process the transaction
      const response = await posService.processTransaction(transactionData);

      // Set last transaction and points earned
      setLastTransaction(response.transaction);
      setPointsEarned(response.pointsEarned || 0);

      // Show receipt
      setReceiptDialogOpen(true);

      // Show success notification
      showNotification("Transaction completed successfully", "success");

      // If customer data was used, refresh points information in the background
      if (customer && customer.id) {
        try {
          const updatedCustomerData = await posService.getCustomerByPhone(
            customer.contactNum
          );
          if (updatedCustomerData && !updatedCustomerData.message) {
            setCustomer(updatedCustomerData);
          }
        } catch (error) {
          // Just log the error but don't show to user since transaction succeeded
          console.log("Could not refresh customer data:", error);
        }
      }
    } catch (error) {
      console.error("Error processing order:", error);
      // More detailed error message based on what we get from the backend
      const errorMessage =
        error.response?.data?.message ||
        "Error processing order. Please try again.";
      showNotification(errorMessage, "error");
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
    setTenderedCash(0);
    setChange(0);
    setPaymentMode("cash");
    setReferenceNumber("");
    setSelectedDiscount(null); // Reset selected discount

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
    const rewardDiscount = calculateDiscount();
    const percentageDiscount = selectedDiscount
      ? (subtotal * selectedDiscount.percentage) / 100
      : 0;

    // Apply both discounts
    return Math.max(subtotal - rewardDiscount - percentageDiscount, 0);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          p: 2,
          backgroundColor: "#a31515",
          color: "white",
        }}
      >
        <Typography variant="h4">Point of Sale</Typography>
        <Button
          variant="contained"
          color="inherit"
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
        >
          Logout
        </Button>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          overflow: "hidden",
        }}
      >
        {/* Product/Category Section */}
        <Box
          sx={{
            width: "70%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Category/Product Header */}
          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid #ddd",
              display: "flex",
              alignItems: "center",
            }}
          >
            {selectedCategory ? (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleBackToCategories}
                  startIcon={<ArrowBackIcon />}
                  sx={{ mr: 2 }}
                >
                  Back
                </Button>
                <Typography variant="h6">
                  {categories.find((cat) => cat.id === selectedCategory)
                    ?.name || "Products"}
                </Typography>
              </>
            ) : (
              <Typography variant="h6">MAIN MENU</Typography>
            )}
          </Box>

          {/* Category/Product Grids */}
          <Box sx={{ flexGrow: 1, overflow: "auto", p: 2 }}>
            {selectedCategory ? (
              <ProductGrid products={products} onAddToCart={handleAddToCart} />
            ) : (
              <CategoryGrid
                categories={categories}
                onSelectCategory={handleCategorySelect}
              />
            )}
          </Box>
        </Box>

        {/* Cart & Checkout Section */}
        <Box
          sx={{
            width: "30%",
            borderLeft: "1px solid #ddd",
            display: "flex",
            flexDirection: "column",
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
            tenderedCash={tenderedCash}
            onTenderedCashChange={handleTenderedCashChange}
            change={change}
            paymentMode={paymentMode}
            onPaymentModeChange={handlePaymentModeChange}
            referenceNumber={referenceNumber}
            onReferenceNumberChange={handleReferenceNumberChange}
            discounts={discounts}
            selectedDiscount={selectedDiscount}
            onDiscountChange={handleDiscountChange}
            calculateDiscountAmount={calculateDiscountAmount}
          />
        </Box>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

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

      {/* Order Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmationDialogOpen}
        onClose={() => setConfirmationDialogOpen(false)}
        onConfirm={handleConfirmOrder}
        cartItems={cartItems}
        subtotal={calculateSubtotal()}
        discount={calculateDiscount()}
        total={calculateTotal()}
        tenderedCash={tenderedCash}
        change={change}
        customer={customer}
        appliedReward={appliedReward}
        paymentMode={paymentMode}
        referenceNumber={referenceNumber}
        selectedDiscount={selectedDiscount}
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
        tenderedCash={tenderedCash}
        change={change}
        paymentMode={paymentMode}
        referenceNumber={referenceNumber}
        selectedDiscount={selectedDiscount}
      />
    </Box>
  );
}
