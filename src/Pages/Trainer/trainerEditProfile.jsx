import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Avatar,
  IconButton,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

export default function PersonalInformationForm() {
  const form = useForm();
  const { register, handleSubmit, reset, watch } = form;

  const [image, setImage] = useState(null);
  const inputRef = useRef();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIconClick = () => {
    inputRef.current.click();
  };

  const handleFormSubmit = (data) => {
    console.log("Form Data:", data);
    alert("Form submitted successfully!");
  };

  return (
    <div>
      <Typography variant="h4" align="center" gutterBottom color>
        Personal Information
      </Typography>
      <Card>
        <CardContent>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <div style={{ position: "relative", display: "inline-block" }}>
              <Avatar
                src={image}
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
          </Box>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  {...register("first_name", { required: true })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  {...register("last_name", { required: true })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  {...register("date_of_birth", { required: true })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Gender"
                  {...register("gender", { required: true })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  {...register("email", { required: true })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  type="tel"
                  {...register("phone_number", { required: true })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Role"
                  {...register("role", { required: true })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Highest Qualification"
                  {...register("highest_qualification", { required: true })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Specialization"
                  {...register("specialization", { required: true })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Total Experience (Years)"
                  type="number"
                  {...register("total_experience_years", { required: true })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Current Organization"
                  {...register("current_organization", { required: true })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Previous Teaching Experience"
                  {...register("previous_teaching_experience", { required: true })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Certifications"
                  {...register("certifications", { required: true })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Account Holder Name"
                  {...register("account_holder_name", { required: true })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Bank Name/Branch"
                  {...register("bank_name_branch", { required: true })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Account Number"
                  type="number"
                  {...register("account_number", { required: true })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="IFSC Code"
                  {...register("ifsc_code", { required: true })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Resume"
                  type="file"
                  InputLabelProps={{ shrink: true }}
                  {...register("resume", { required: true })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="ID Proof"
                  type="file"
                  InputLabelProps={{ shrink: true }}
                  {...register("id_proof", { required: true })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Educational Certificates"
                  type="file"
                  InputLabelProps={{ shrink: true }}
                  {...register("educational_certificates", { required: true })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Available Days"
                  {...register("available_days", { required: true })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Available Mode"
                  {...register("available_mode", { required: true })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Preferred Time Slots"
                  {...register("preferred_time_slots", { required: true })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Status"
                  {...register("status", { required: true })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Login ID"
                  {...register("login_id", { required: true })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Address"
                  {...register("address", { required: true })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Pincode"
                  type="number"
                  {...register("pincode", { required: true })}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button type="submit" variant="contained">
                    Submit
                  </Button>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => reset()}
                  >
                    Reset
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
