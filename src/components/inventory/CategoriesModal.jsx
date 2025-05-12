import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Box,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  IconButton,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import { inventoryService } from "../../services/api";
import { useTheme } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import Snackbar from "@mui/material/Snackbar";

const CategoriesModal = ({ open, onClose }) => {
  const [tab, setTab] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    if (open) fetchCategories();
  }, [open]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await inventoryService.getCategories();
      setCategories(data);
    } catch (e) {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setLoading(true);
    try {
      await inventoryService.createCategory({ name: newCategory });
      setNewCategory("");
      fetchCategories();
      setTab(0);
      setSuccess(true);
    } catch (e) {
      setError("Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat) => {
    setEditId(cat.id);
    setEditValue(cat.name);
  };

  const handleEditSave = async (cat) => {
    try {
      await inventoryService.updateCategory(cat.id, { name: editValue });
      setEditId(null);
      setEditValue("");
      fetchCategories();
      setSuccess(true);
    } catch {
      setError("Failed to update category");
    }
  };

  const handleDelete = async (cat) => {
    setDeleteError("");
    try {
      // Check if category has products
      const products = await inventoryService.getProducts();
      const hasProduct = products.some((p) => p.category_id === cat.id);
      if (hasProduct) {
        setDeleteError("Cannot delete: Category has existing products.");
        setTimeout(() => setDeleteError(""), 2000);
        return;
      }
      setDeleteId(cat.id);
      setShowDeleteConfirm(true);
    } catch {
      setError("Delete check failed");
    }
  };

  const confirmDelete = async () => {
    try {
      await inventoryService.deleteCategory(deleteId);
      setShowDeleteConfirm(false);
      setDeleteId(null);
      fetchCategories();
      setSuccess(true);
    } catch {
      setError("Failed to delete category");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          background: theme.palette.background.default,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: "bold",
          color: "#fff",
          background: "#a31515",
          pb: 1,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
      >
        Categories
        <IconButton onClick={onClose} size="small" sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider sx={{ mb: 1 }} />
      <DialogContent>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          textColor="primary"
          indicatorColor="primary"
          sx={{ mb: 2 }}
        >
          <Tab label="All Categories" />
          <Tab label="Add Category" />
        </Tabs>
        <Box mt={0}>
          {tab === 0 &&
            (loading ? (
              <Box display="flex" justifyContent="center">
                <CircularProgress
                  size={24}
                  sx={{ color: theme.palette.primary.main }}
                />
              </Box>
            ) : (
              <List>
                {categories.map((cat) => (
                  <ListItem
                    key={cat.id}
                    sx={{
                      borderRadius: 1,
                      mb: 1,
                      bgcolor: theme.palette.action.hover,
                    }}
                    secondaryAction={
                      editId === cat.id ? (
                        <>
                          <IconButton
                            edge="end"
                            onClick={() => handleEditSave(cat)}
                            size="small"
                            color="primary"
                          >
                            <CheckIcon />
                          </IconButton>
                          <IconButton
                            edge="end"
                            onClick={() => {
                              setEditId(null);
                              setEditValue("");
                            }}
                            size="small"
                          >
                            <CloseIcon />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton
                            edge="end"
                            onClick={() => handleEdit(cat)}
                            size="small"
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            edge="end"
                            onClick={() => handleDelete(cat)}
                            size="small"
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </>
                      )
                    }
                  >
                    {editId === cat.id ? (
                      <TextField
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        size="small"
                        autoFocus
                        sx={{ bgcolor: "white", borderRadius: 1 }}
                      />
                    ) : (
                      <ListItemText primary={cat.name} />
                    )}
                  </ListItem>
                ))}
                {categories.length === 0 && (
                  <ListItem>
                    <ListItemText primary="No categories found" />
                  </ListItem>
                )}
              </List>
            ))}
          {tab === 1 && (
            <form onSubmit={handleAddCategory}>
              <TextField
                label="Category Name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                fullWidth
                autoFocus
                margin="normal"
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading || !newCategory.trim()}
                sx={{
                  mt: 1,
                  fontWeight: "bold",
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  "&:hover": { backgroundColor: theme.palette.primary.dark },
                }}
              >
                Add Category
              </Button>
            </form>
          )}
          {error && (
            <Box color="error.main" mt={2}>
              {error}
            </Box>
          )}
        </Box>
        <Snackbar
          open={success}
          autoHideDuration={2000}
          onClose={() => setSuccess(false)}
          message="Category created successfully!"
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          ContentProps={{
            sx: {
              minHeight: "unset",
              py: 0.5,
              px: 2,
              fontSize: 15,
              borderRadius: 2,
            },
          }}
        />
        <Snackbar
          open={!!deleteError}
          autoHideDuration={2000}
          onClose={() => setDeleteError("")}
          message={deleteError}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          ContentProps={{
            sx: {
              minHeight: "unset",
              py: 0.5,
              px: 2,
              fontSize: 15,
              borderRadius: 2,
            },
          }}
        />
        <Dialog
          open={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
        >
          <DialogTitle>Delete Category?</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this category?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
            <Button color="error" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};

export default CategoriesModal;
