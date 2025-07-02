import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
  Button,
  IconButton,
  Avatar,
  Tabs,
  Tab,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import profilePhoto from "../../assets/emptyprofile.png";
import EditBanner from "../../assets/educational_banner.jpg";
import "../studentEditForm.css";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import CircularProgressWithLabel from "../progressBar";

function CustomTabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function VendorEditProfile() {
  const [tabValue, setTabValue] = useState(0);
  const [vendorData, setVendorData] = useState({});
  const [progress, setProgress] = useState(10);
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      vendor_name: "",
      registration_number: "",
      contact_person: "",
      email: "",
      phone: "",
      address: "",
      bank_name: "",
      bank_account_number: "",
      tax_id: "",
      website: "",
      products_services: "",
      description: "",
    },
  });

  const BASE_URL = 'http://localhost:8000';

  const fetchData = async () => {
    try {
      const vendorEmail = localStorage.getItem('userEmail');
      if (!vendorEmail) {
        throw new Error('Vendor email not found in localStorage');
      }

      console.log('Fetching vendor data for email:', vendorEmail);
      const response = await fetch(`${BASE_URL}/admin_gmt/vendor/?email=${vendorEmail}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Raw Response:', response);

      if (!response.ok) {
        throw new Error(`Failed to fetch vendor data: ${response.status} ${response.statusText}`);
      }

      const vendorData = await response.json();
      console.log('Parsed Vendor Data:', vendorData);

      if (vendorData.status !== 'success') {
        throw new Error('Failed to fetch vendor data: Invalid response status');
      }

      const vendor = vendorData.data;
      if (!vendor || typeof vendor !== 'object') {
        throw new Error('No vendor data returned from the backend');
      }

      setVendorData(vendor);
      console.log('Vendor Data:', vendor);

      // Populate form fields
      setValue('vendor_name', vendor.vendor_name || '');
      setValue('registration_number', vendor.registration_number || '');
      setValue('contact_person', vendor.contact_person || '');
      setValue('email', vendor.email || '');
      setValue('phone', vendor.phone || '');
      setValue('address', vendor.address || '');
      setValue('bank_name', vendor.bank_name || '');
      setValue('bank_account_number', vendor.bank_account_number || '');
      setValue('tax_id', vendor.tax_id || '');
      setValue('website', vendor.website || '');
      setValue('products_services', vendor.products_services || '');
      setValue('description', vendor.description || '');

      const profilePicture = vendor.profile_picture ? `${BASE_URL}${vendor.profile_picture}` : null;
      setImage(profilePicture);
      if (profilePicture) {
        setProgress((prev) => Math.min(prev + 20, 100));
      }

      return vendor;
    } catch (error) {
      console.error('Error fetching vendor data:', error);
      setError(error.message);
      return null;
    }
  };

  useEffect(() => {
    fetchData();

    // Load from localStorage as fallback
    const savedData = JSON.parse(localStorage.getItem("vendorData") || "{}");
    if (savedData && Object.keys(savedData).length > 0) {
      setVendorData(savedData);
      Object.entries(savedData).forEach(([key, value]) => {
        setValue(key, value);
      });
      if (savedData.image) {
        setImage(savedData.image);
        setProgress((prev) => Math.min(prev + 20, 100));
      }
    }
  }, [setValue]);

  const handleVendorSubmit = async (data) => {
    try {
      console.log("Submitting data:", data);
      const updatedData = { ...data, image };
      setVendorData(updatedData);
      localStorage.setItem("vendorData", JSON.stringify(updatedData));
      setProgress((prev) => Math.min(prev + 20, 100));

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (image && image.startsWith("data:")) {
        const blob = await fetch(image).then((r) => r.blob());
        formData.append("image", blob, "profile.jpg");
      }

      const response = await fetch(`${BASE_URL}/api_vendor/vendors/${vendorData.id || 1}/`, {
        method: "PUT",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to update vendor");
      }

      alert("Vendor updated successfully!");
      console.log("Vendor updated successfully:", result);
      reset();
      setImage(null);
      setProgress(10);
      localStorage.removeItem("vendorData");
    } catch (error) {
      console.error("Error updating vendor:", error);
      alert(`Error updating vendor: ${error.message}`);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setProgress((prev) => Math.min(prev + 20, 100));
        localStorage.setItem(
          "vendorData",
          JSON.stringify({ ...vendorData, image: reader.result })
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIconClick = () => {
    inputRef.current.click();
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCancel = () => {
    reset();
    setImage(null);
    setProgress(10);
    localStorage.removeItem("vendorData");
    setVendorData({});
  };

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <div>
      <div style={{ position: "relative" }}>
        <div className="EditStudentDetails">
          <img
            src={EditBanner}
            style={{ width: "100%", height: "220px", objectFit: "cover" }}
            alt="Banner"
          />
          <div>
            <div className="row" style={{ position: "relative" }}>
              <div
                className="col-lg-4 col-md-4 col-xl-4"
                style={{
                  padding: "0px 20px",
                  position: "absolute",
                  top: "-40px",
                  left: "20px",
                }}
              >
                <Card>
                  <CardContent>
                    <div>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ position: "relative", display: "inline-block" }}>
                          <Avatar
                            src={image || profilePhoto}
                            alt="Profile"
                            sx={{ width: 120, height: 120 }}
                          />
                          <input
                            type="file"
                            accept="image/*"
                            ref={inputRef}
                            onChange={handleImageChange}
                            style={{ display: "none" }}
                          />
                          <IconButton
                            onClick={handleIconClick}
                            style={{
                              position: "absolute",
                              bottom: 0,
                              right: 0,
                              backgroundColor: "white",
                            }}
                            size="small"
                          >
                            <PhotoCameraIcon />
                          </IconButton>
                        </div>
                        <h6>{vendorData.vendor_name || "Vendor"}</h6>
                        <small>{vendorData.description || "Vendor Role"}</small>
                      </div>
                      <div>
                        <List aria-label="mailbox folders">
                          <ListItem>
                            <ListItemText primary="Profile Status" />
                            <Box>
                              <CircularProgressWithLabel value={progress} />
                            </Box>
                          </ListItem>
                          <Divider component="li" />
                          <ListItem>
                            <ListItemText primary="Contracts Completed" />
                            <Box>
                              <Typography style={{ color: "red" }}>Pending</Typography>
                            </Box>
                          </ListItem>
                          <Divider component="li" />
                          <ListItem>
                            <ListItemText primary="Active Contracts" />
                            <Box>
                              <Typography>5</Typography>
                            </Box>
                          </ListItem>
                        </List>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div
                className="col-lg-8 col-md-8 col-xl-8"
                style={{
                  padding: "0px 50px",
                  position: "absolute",
                  top: "-40px",
                  right: "5px",
                }}
              >
                <Box>
                  <Card variant="outlined">
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                      <Tabs value={tabValue} onChange={handleTabChange} aria-label="form tabs">
                        <Tab label="Vendor Details" {...a11yProps(0)} />
                      </Tabs>
                    </Box>

                    <CardContent>
                      <CustomTabPanel value={tabValue} index={0}>
                        <form onSubmit={handleSubmit(handleVendorSubmit)} noValidate>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label={
                                  <>
                                    Vendor Name <span style={{ color: "red" }}>*</span>
                                  </>
                                }
                                {...register("vendor_name", { required: "Vendor name is required" })}
                                error={!!errors.vendor_name}
                                helperText={errors.vendor_name?.message}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label={
                                  <>
                                    Business Registration Number <span style={{ color: "red" }}>*</span>
                                  </>
                                }
                                {...register("registration_number", {
                                  required: "Registration number is required",
                                })}
                                error={!!errors.registration_number}
                                helperText={errors.registration_number?.message}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label={
                                  <>
                                    Contact Person Name <span style={{ color: "red" }}>*</span>
                                  </>
                                }
                                {...register("contact_person", {
                                  required: "Contact person name is required",
                                })}
                                error={!!errors.contact_person}
                                helperText={errors.contact_person?.message}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label={
                                  <>
                                    Email Address <span style={{ color: "red" }}>*</span>
                                  </>
                                }
                                type="email"
                                {...register("email", {
                                  required: "Email is required",
                                  pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Invalid email address",
                                  },
                                })}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label={
                                  <>
                                    Phone Number <span style={{ color: "red" }}>*</span>
                                  </>
                                }
                                type="tel"
                                {...register("phone", {
                                  required: "Phone number is required",
                                  pattern: {
                                    value: /^[0-9]{10}$/,
                                    message: "Invalid phone number (10 digits required)",
                                  },
                                })}
                                error={!!errors.phone}
                                helperText={errors.phone?.message}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Business Address"
                                {...register("address")}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Bank Name"
                                {...register("bank_name")}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Bank Account Number"
                                {...register("bank_account_number", {
                                  pattern: {
                                    value: /^[0-9]{9,18}$/,
                                    message: "Invalid account number (9-18 digits)",
                                  },
                                })}
                                error={!!errors.bank_account_number}
                                helperText={errors.bank_account_number?.message}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Tax Identification Number (TIN)"
                                {...register("tax_id")}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Company Website"
                                {...register("website", {
                                  pattern: {
                                    value: /^https?:\/\/[^\s/$.?#].[^\s]*$/,
                                    message: "Invalid URL",
                                  },
                                })}
                                error={!!errors.website}
                                helperText={errors.website?.message}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Products/Services Offered"
                                {...register("products_services")}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Description"
                                {...register("description")}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Box sx={{ display: "flex", gap: 2 }}>
                                <Button type="submit" variant="contained" color="primary" fullWidth>
                                  Update
                                </Button>
                                <Button
                                  type="button"
                                  variant="outlined"
                                  color="info"
                                  fullWidth
                                  onClick={handleCancel}
                                >
                                  Cancel
                                </Button>
                              </Box>
                            </Grid>
                          </Grid>
                        </form>
                      </CustomTabPanel>
                    </CardContent>
                  </Card>
                </Box>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}