
import React, { useRef, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
  MenuItem,
  Button,
  Tabs,
  Tab,
  IconButton,
  Avatar,
  Menu,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Editprofilebanner from "../assets/educational_banner2.jpg";
import "./studentEditForm.css";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import CircularProgressWithLabe from "./progressBar";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

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

export default function BasicTabs() {
  const personalForm = useForm();
  const educationForm = useForm();
  const bankingForm = useForm();

  const { control, watch, handleSubmit, register, setValue } = personalForm;
  const { control: educationControl, watch: watchEducation } = educationForm;
  const { watch: watchBanking } = bankingForm;

  const [personalData, setPersonalData] = useState({});
  const [educationData, setEducationData] = useState({});
  const [tabIndex, setTabIndex] = useState(0);
  const [enabledTabs, setEnabledTabs] = useState([true, false, false]);
  const [progress, setProgress] = useState(10);
  const [image, setImage] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [getStudentData, setGetStudentData] = useState(null);
  const [error, setError] = useState(null);

  // Watch values for personal form fields
  const firstname = watch("firstname");
  const lastname = watch("lastname");
  const email = watch("email");
  const gender = watch("gender");
  const contactNumber = watch("contact_number");
  const altContact = watch("alt_contact");
  const pincode = watch("pincode");
  const designation = watch("designation");
  const motherName = watch("mother_name");
  const fatherName = watch("father_name");
  const streetName = watch("street_name");
  const doorNumber = watch("door_number");
  const landmark = watch("landmark");
  const country = watch("country");
  const state = watch("state");
  const city = watch("city");
  const description = watch("description");

  // Watch values for education form fields
  const institution_name = watchEducation("institution_name");
  const qualification = watchEducation("qualification");
  const cgpa = watchEducation("cgpa");
  const location = watchEducation("location");
  const majorSubject = watchEducation("major_subject");
  const passedout = watchEducation("passedout");

  // Watch values for banking form fields
  const accountHolderName = watchBanking("account_holder_name");
  const bankName = watchBanking("bank_name");
  const accountNumber = watchBanking("account_number");
  const ifscCode = watchBanking("ifsc_code");
  const branchName = watchBanking("branch_name");
  const bankLocation = watchBanking("bank_location");

  const inputRef = useRef();

  const BASE_URL = "http://localhost:8000";

  // Static location data for country-state-city
  const locationData = {
    India: {
      TamilNadu: ["Chennai", "Coimbatore", "Madurai"],
      Karnataka: ["Bangalore", "Mysore", "Mangalore"],
      Maharashtra: ["Mumbai", "Pune", "Nagpur"],
    },
    USA: {
      California: ["Los Angeles", "San Francisco", "San Diego"],
      Texas: ["Houston", "Austin", "Dallas"],
      NewYork: ["New York City", "Buffalo", "Rochester"],
    },
  };

  const countries = Object.keys(locationData);
  const states = country ? Object.keys(locationData[country] || {}) : [];
  const cities = state && country ? locationData[country][state] || [] : [];

  // Reset state and city when country changes
  useEffect(() => {
    if (country) {
      setValue("state", "");
      setValue("city", "");
    }
  }, [country, setValue]);

  // Reset city when state changes
  useEffect(() => {
    if (state) {
      setValue("city", "");
    }
  }, [state, setValue]);

  const fetchData = async () => {
    try {
      const studentEmail = localStorage.getItem("userEmail");
      if (!studentEmail) {
        throw new Error("User email not found in localStorage");
      }

      console.log("Fetching student data for email:", studentEmail);
      const response = await fetch(
        `${BASE_URL}/admin_gmt/student/?email=${studentEmail}`,
        {
          method: "GET",
        }
      );
      console.log("Raw Response:", response);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch student data: ${response.status} ${response.statusText}`
        );
      }

      const studentData = await response.json();
      console.log("Parsed student Data:", studentData);

      if (studentData.status !== "success") {
        throw new Error("Failed to fetch student data: Invalid response status");
      }

      const student = studentData.data;
      if (!student || typeof student !== "object") {
        throw new Error("No student data returned from the backend");
      }

      console.log("student Data:", student);
      setGetStudentData(student);
      const profilePicture = student.profile_picture
        ? `${BASE_URL}${student.profile_picture}`
        : null;
      setImage(profilePicture);
      if (profilePicture) {
        setProgress((prev) => Math.min(prev + 20, 100));
      }

      return student;
    } catch (error) {
      console.error("Error fetching student data:", error);
      setError(error.message);
      return null;
    }
  };

  // UseEffect to fetch data on mount
  useEffect(() => {
    fetchData();
    const savedPersonal = JSON.parse(
      localStorage.getItem("personalData") || "{}"
    );
    const savedEducation = JSON.parse(
      localStorage.getItem("educationData") || "{}"
    );

    setPersonalData(savedPersonal);
    setEducationData(savedEducation);
  }, []);

  // UseEffect to populate form fields when getStudentData changes
  useEffect(() => {
    if (getStudentData && Object.keys(getStudentData).length > 0) {
      personalForm.reset({
        firstname: getStudentData.firstname || "",
        lastname: getStudentData.lastname || "",
        email: getStudentData.email || "",
        gender: getStudentData.gender || "",
        contact_number: getStudentData.contact_number || "",
        alt_contact: getStudentData.alt_contact || "",
        pincode: getStudentData.pincode || "",
        designation: getStudentData.designation || "",
        mother_name: getStudentData.mother_name || "",
        father_name: getStudentData.father_name || "",
        street_name: getStudentData.street_name || "",
        door_number: getStudentData.door_number || "",
        landmark: getStudentData.landmark || "",
        country: getStudentData.country || "",
        state: getStudentData.state || "",
        city: getStudentData.city || "",
        description: getStudentData.description || "",
        skills:
          getStudentData.skills && Array.isArray(getStudentData.skills)
            ? getStudentData.skills
            : [],
      });

      educationForm.reset({
        institution_name: getStudentData.institution_name || "",
        qualification: getStudentData.qualification || "",
        cgpa: getStudentData.cgpa || "",
        location: getStudentData.location || "",
        major_subject: getStudentData.major_subject || "",
        passedout: getStudentData.passedout
          ? new Date(parseInt(getStudentData.passedout), 0, 1)
          : null,
      });

      bankingForm.reset({
        account_holder_name: getStudentData.account_holder_name || "",
        bank_name: getStudentData.bank_name || "",
        account_number: getStudentData.account_number || "",
        ifsc_code: getStudentData.ifsc_code || "",
        branch_name: getStudentData.branch_name || "",
        bank_location: getStudentData.bank_location || "",
      });
    }
  }, [getStudentData, personalForm, educationForm, bankingForm]);

  const handlePersonalSave = (data) => {
    setPersonalData(data);
    localStorage.setItem("personalData", JSON.stringify(data));
    setProgress((prev) => Math.min(prev + 20, 100));
    enableTabAndMove(1);
    alert("Personal details saved.");
  };

  const handleEducationSave = (data) => {
    const formattedData = {
      ...data,
      passedout: data.passedout
        ? new Date(data.passedout).getFullYear().toString()
        : null,
    };
    setEducationData(formattedData);
    localStorage.setItem("educationData", JSON.stringify(formattedData));
    setProgress((prev) => Math.min(prev + 20, 100));
    enableTabAndMove(2);
    alert("Education details saved.");
  };

  const handleFinalSubmit = async (bankingData) => {
    const finalData = {
      ...personalData,
      ...educationData,
      ...bankingData,
    };

    console.log("Final Data:", finalData);
    setProgress((prev) => Math.min(prev + 20, 100));
    const formData = new FormData();
    Object.entries(finalData).forEach(([key, value]) => {
      if (key === "skills" && Array.isArray(value)) {
        // Append as stringified array format, e.g. '["data1","data2"]'
        formData.append(key, JSON.stringify(value));
      } else if (key === "passedout" && value) {
        formData.append(key, value.toString());
      } else {
        formData.append(key, value || "");
      }
    });
    if (image && image.startsWith("data:")) {
      const blob = await fetch(image).then((res) => res.blob());
      formData.append("profile_picture", blob, "profile.jpg");
    }
    console.log("FormData values:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    try {
      const response = await fetch(
        `${BASE_URL}/admin_gmt/update/student/?email=${encodeURIComponent(
          finalData.email
        )}`,
        {
          method: "PUT",
          body: formData,
        }
      );
      if (!response.ok) throw new Error("Failed to submit personal form");
      const result = await response.json();
      alert(`Personal form submitted successfully: ${result.message}`);
    } catch (error) {
      console.error("Error submitting personal form:", error);
      alert("Failed to submit form. Please try again.");
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setProgress((prev) => Math.min(prev + 20, 100));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIconClick = () => {
    inputRef.current.click();
  };

  const enableTabAndMove = (nextTabIndex) => {
    setEnabledTabs((prev) => {
      const updated = [...prev];
      updated[nextTabIndex] = true;
      return updated;
    });
    setTabIndex(nextTabIndex);
  };

  const handleTabChange = (event, newValue) => {
    if (enabledTabs[newValue]) {
      setTabIndex(newValue);
    }
  };

  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const skillOptions = [
    "React",
    "Node.js",
    "JavaScript",
    "Python",
    "Java",
    "C++",
    "Go",
    "CSS",
    "HTML",
    "Angular",
  ];

  return (
    <div>
      {error && (
        <Typography color="error" align="center">
          {error}
        </Typography>
      )}
      <div style={{ position: "relative" }}>
        <div className="profile-icon-container">
          <IconButton onClick={handleProfileClick} aria-label="Profile">
            <Avatar src={image} alt="Profile" sx={{ width: 40, height: 40 }} />
          </IconButton>
          <Menu
            anchorEl={profileAnchorEl}
            open={Boolean(profileAnchorEl)}
            onClose={handleProfileClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              sx: {
                opacity: 1,
                transition:
                  "opacity 251ms cubic-bezier(0.4, 0, 0.2, 1), transform 167ms cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: 3,
                backgroundColor: "background.paper",
                borderRadius: "4px",
                minWidth: 150,
                left: "auto",
                right: 0,
              },
            }}
          >
            <MenuItem onClick={handleProfileClose}>Profile</MenuItem>
            <MenuItem onClick={handleProfileClose}>Settings</MenuItem>
            <MenuItem onClick={handleProfileClose}>Logout</MenuItem>
          </Menu>
        </div>

        <div className="EditStudentDetails">
          <img
            src={Editprofilebanner}
            style={{ width: "100%", height: "220px", objectFit: "cover" }}
            alt="Profile banner"
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
                        <div
                          style={{
                            position: "relative",
                            display: "inline-block",
                          }}
                        >
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
                        <h6>{getStudentData?.firstname || "N/A"}</h6>
                        <small>
                          {getStudentData?.designation || "Student"}
                        </small>
                      </div>
                      <div>
                        <List aria-label="mailbox folders">
                          <ListItem>
                            <ListItemText primary="Profile Status" />
                            <Box>
                              <CircularProgressWithLabe value={progress} />
                            </Box>
                          </ListItem>
                          <Divider component="li" />
                          <ListItem>
                            <ListItemText primary="Course Completed" />
                            <Box>
                              <Typography style={{ color: "red" }}>
                                Pending
                              </Typography>
                            </Box>
                          </ListItem>
                          <Divider component="li" />
                          <ListItem>
                            <ListItemText primary="Course Enrolled" />
                            <Box>
                              <Typography>
                                {getStudentData?.courseEnrolled || 5}
                              </Typography>
                            </Box>
                          </ListItem>
                          <Divider component="li" />
                          <ListItem>
                            <ListItemText primary="Activated Course" />
                            <Box>
                              <Typography>
                                {getStudentData?.activatedCourse || 2}
                              </Typography>
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
                      <Tabs
                        value={tabIndex}
                        onChange={handleTabChange}
                        aria-label="form tabs"
                      >
                        <Tab
                          label="Personal Details"
                          disabled={!enabledTabs[0]}
                          {...a11yProps(0)}
                        />
                        <Tab
                          label="Educational Details"
                          disabled={!enabledTabs[1]}
                          {...a11yProps(1)}
                        />
                        <Tab
                          label="Bank Details"
                          disabled={!enabledTabs[2]}
                          {...a11yProps(2)}
                        />
                      </Tabs>
                    </Box>

                    <CardContent>
                      <CustomTabPanel value={tabIndex} index={0}>
                        <form
                          onSubmit={personalForm.handleSubmit(
                            handlePersonalSave
                          )}
                        >
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label={
                                  <>
                                    First Name{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </>
                                }
                                InputLabelProps={{ shrink: !!firstname }}
                                {...register("firstname", {
                                  required: "First name is required",
                                  pattern: {
                                    value: /^[A-Za-z\s]+$/,
                                    message:
                                      "Only letters and spaces are allowed",
                                  },
                                })}
                                error={!!personalForm.formState.errors.firstname}
                                helperText={
                                  personalForm.formState.errors.firstname?.message
                                }
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label={
                                  <>
                                    Last Name{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </>
                                }
                                InputLabelProps={{ shrink: !!lastname }}
                                {...register("lastname", {
                                  required: "Last name is required",
                                  pattern: {
                                    value: /^[A-Za-z\s]+$/,
                                    message:
                                      "Only letters and spaces are allowed",
                                  },
                                })}
                                error={!!personalForm.formState.errors.lastname}
                                helperText={
                                  personalForm.formState.errors.lastname?.message
                                }
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                type="email"
                                label={
                                  <>
                                    Email{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </>
                                }
                                InputLabelProps={{ shrink: !!email }}
                                {...register("email", {
                                  required: "Email is required",
                                  pattern: {
                                    value:
                                      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Invalid email format",
                                  },
                                })}
                                error={!!personalForm.formState.errors.email}
                                helperText={
                                  personalForm.formState.errors.email?.message
                                }
                              />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Controller
                                name="gender"
                                control={control}
                                defaultValue=""
                                rules={{ required: "Gender is required" }}
                                render={({ field, fieldState: { error } }) => (
                                  <TextField
                                    {...field}
                                    fullWidth
                                    select
                                    label={
                                      <>
                                        Gender{" "}
                                        <span style={{ color: "red" }}>*</span>
                                      </>
                                    }
                                    InputLabelProps={{ shrink: true }}
                                    error={!!error}
                                    helperText={error?.message}
                                  >
                                    <MenuItem value="">Select Gender</MenuItem>
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Female">Female</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                  </TextField>
                                )}
                              />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <TextField
                                fullWidth
                                label={
                                  <>
                                    Contact Number{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </>
                                }
                                type="tel"
                                InputLabelProps={{ shrink: !!contactNumber }}
                                {...register("contact_number", {
                                  required: "Contact number is required",
                                  pattern: {
                                    value: /^\+\d{1,4}\d{6,14}$/,
                                    message:
                                      "Enter a valid phone number with country code",
                                  },
                                })}
                                error={
                                  !!personalForm.formState.errors.contact_number
                                }
                                helperText={
                                  personalForm.formState.errors.contact_number
                                    ?.message
                                }
                              />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <TextField
                                fullWidth
                                label="Alternative Number"
                                type="tel"
                                InputLabelProps={{ shrink: !!altContact }}
                                {...register("alt_contact", {
                                  pattern: {
                                    value: /^\+\d{1,4}\d{6,14}$/,
                                    message:
                                      "Enter a valid phone number with country code",
                                  },
                                })}
                                error={!!personalForm.formState.errors.alt_contact}
                                helperText={
                                  personalForm.formState.errors.alt_contact
                                    ?.message
                                }
                              />
                            </Grid>
                            <Grid item xs={12} sm={8}>
                              <Controller
                                name="skills"
                                control={control}
                                defaultValue={[]}
                                rules={{
                                  required: "At least one skill is required",
                                }}
                                render={({ field }) => (
                                  <Autocomplete
                                    {...field}
                                    multiple
                                    options={skillOptions}
                                    value={field.value || []}
                                    onChange={(_, newValue) =>
                                      field.onChange(newValue)
                                    }
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label={
                                          <>
                                            Skills{" "}
                                            <span style={{ color: "red" }}>
                                              *
                                            </span>
                                          </>
                                        }
                                        InputLabelProps={{
                                          shrink:
                                            (field.value &&
                                              field.value.length > 0) ||
                                            params.inputProps.value,
                                        }}
                                        error={
                                          !!personalForm.formState.errors.skills
                                        }
                                        helperText={
                                          personalForm.formState.errors.skills
                                            ?.message
                                        }
                                      />
                                    )}
                                  />
                                )}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Pincode"
                                type="number"
                                InputLabelProps={{ shrink: !!pincode }}
                                {...register("pincode", {
                                  pattern: {
                                    value: /^[0-9]{6}$/,
                                    message: "Enter a valid 6-digit pincode",
                                  },
                                })}
                                error={!!personalForm.formState.errors.pincode}
                                helperText={
                                  personalForm.formState.errors.pincode?.message
                                }
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Designation"
                                InputLabelProps={{ shrink: !!designation }}
                                {...register("designation")}
                                error={!!personalForm.formState.errors.designation}
                                helperText={
                                  personalForm.formState.errors.designation
                                    ?.message
                                }
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Mother's Name"
                                InputLabelProps={{ shrink: !!motherName }}
                                {...register("mother_name", {
                                  pattern: {
                                    value: /^[A-Za-z\s]+$/,
                                    message:
                                      "Only letters and spaces are allowed",
                                  },
                                })}
                                error={!!personalForm.formState.errors.mother_name}
                                helperText={
                                  personalForm.formState.errors.mother_name
                                    ?.message
                                }
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Father's Name"
                                InputLabelProps={{ shrink: !!fatherName }}
                                {...register("father_name", {
                                  pattern: {
                                    value: /^[A-Za-z\s]+$/,
                                    message:
                                      "Only letters and spaces are allowed",
                                  },
                                })}
                                error={!!personalForm.formState.errors.father_name}
                                helperText={
                                  personalForm.formState.errors.father_name
                                    ?.message
                                }
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label={
                                  <>
                                    Street Name{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </>
                                }
                                InputLabelProps={{ shrink: !!streetName }}
                                {...register("street_name", {
                                  required: "Street name is required",
                                  pattern: {
                                    value: /^[A-Za-z0-9\s]+$/,
                                    message:
                                      "Only letters, numbers, and spaces are allowed",
                                  },
                                })}
                                error={!!personalForm.formState.errors.street_name}
                                helperText={
                                  personalForm.formState.errors.street_name
                                    ?.message
                                }
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Door Number"
                                InputLabelProps={{ shrink: !!doorNumber }}
                                {...register("door_number", {
                                  pattern: {
                                    value: /^[A-Za-z0-9\s\/-]+$/,
                                    message:
                                      "Only letters, numbers, spaces, slashes, and hyphens are allowed",
                                  },
                                })}
                                error={!!personalForm.formState.errors.door_number}
                                helperText={
                                  personalForm.formState.errors.door_number
                                    ?.message
                                }
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Landmark"
                                InputLabelProps={{ shrink: !!landmark }}
                                {...register("landmark", {
                                  pattern: {
                                    value: /^[A-Za-z0-9\s]+$/,
                                    message:
                                      "Only letters, numbers, and spaces are allowed",
                                  },
                                })}
                                error={!!personalForm.formState.errors.landmark}
                                helperText={
                                  personalForm.formState.errors.landmark?.message
                                }
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Controller
                                name="country"
                                control={control}
                                defaultValue=""
                                rules={{ required: "Country is required" }}
                                render={({ field, fieldState: { error } }) => (
                                  <TextField
                                    {...field}
                                    fullWidth
                                    select
                                    label={
                                      <>
                                        Country{" "}
                                        <span style={{ color: "red" }}>*</span>
                                      </>
                                    }
                                    InputLabelProps={{ shrink: true }}
                                    error={!!error}
                                    helperText={error?.message}
                                  >
                                    <MenuItem value="">Select Country</MenuItem>
                                    {countries.map((countryOption) => (
                                      <MenuItem
                                        key={countryOption}
                                        value={countryOption}
                                      >
                                        {countryOption}
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                )}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Controller
                                name="state"
                                control={control}
                                defaultValue=""
                                rules={{ required: "State is required" }}
                                render={({ field, fieldState: { error } }) => (
                                  <TextField
                                    {...field}
                                    fullWidth
                                    select
                                    label={
                                      <>
                                        State{" "}
                                        <span style={{ color: "red" }}>*</span>
                                      </>
                                    }
                                    InputLabelProps={{ shrink: true }}
                                    error={!!error}
                                    helperText={error?.message}
                                    disabled={!country}
                                  >
                                    <MenuItem value="">Select State</MenuItem>
                                    {states.map((stateOption) => (
                                      <MenuItem
                                        key={stateOption}
                                        value={stateOption}
                                      >
                                        {stateOption}
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                )}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Controller
                                name="city"
                                control={control}
                                defaultValue=""
                                rules={{ required: "City is required" }}
                                render={({ field, fieldState: { error } }) => (
                                  <TextField
                                    {...field}
                                    fullWidth
                                    select
                                    label={
                                      <>
                                        City{" "}
                                        <span style={{ color: "red" }}>*</span>
                                      </>
                                    }
                                    InputLabelProps={{ shrink: true }}
                                    error={!!error}
                                    helperText={error?.message}
                                    disabled={!state}
                                  >
                                    <MenuItem value="">Select City</MenuItem>
                                    {cities.map((cityOption) => (
                                      <MenuItem
                                        key={cityOption}
                                        value={cityOption}
                                      >
                                        {cityOption}
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                )}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Description"
                                multiline
                                rows={3}
                                InputLabelProps={{ shrink: !!description }}
                                {...register("description")}
                                error={!!personalForm.formState.errors.description}
                                helperText={
                                  personalForm.formState.errors.description
                                    ?.message
                                }
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Box sx={{ display: "flex", gap: 2 }}>
                                <Button type="submit" variant="contained">
                                  Save
                                </Button>
                                <Button
                                  type="button"
                                  variant="outlined"
                                  onClick={() => personalForm.reset()}
                                >
                                  Reset
                                </Button>
                              </Box>
                            </Grid>
                          </Grid>
                        </form>
                      </CustomTabPanel>

                      <CustomTabPanel value={tabIndex} index={1}>
                        <form
                          onSubmit={educationForm.handleSubmit(
                            handleEducationSave
                          )}
                        >
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                label={
                                  <>
                                    College/School Name{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </>
                                }
                                fullWidth
                                InputLabelProps={{
                                  shrink: !!institution_name,
                                }}
                                {...educationForm.register("institution_name", {
                                  required: "Institution name is required",
                                })}
                                error={
                                  !!educationForm.formState.errors.institution_name
                                }
                                helperText={
                                  educationForm.formState.errors.institution_name
                                    ?.message
                                }
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                label={
                                  <>
                                    Qualification{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </>
                                }
                                fullWidth
                                InputLabelProps={{ shrink: !!qualification }}
                                {...educationForm.register("qualification", {
                                  required: "Qualification is required",
                                })}
                                error={
                                  !!educationForm.formState.errors.qualification
                                }
                                helperText={
                                  educationForm.formState.errors.qualification
                                    ?.message
                                }
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                label={
                                  <>
                                    Total Percentage/CGPA{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </>
                                }
                                type="number"
                                fullWidth
                                InputLabelProps={{ shrink: !!cgpa }}
                                {...educationForm.register("cgpa", {
                                  required: "CGPA is required",
                                  min: {
                                    value: 0,
                                    message: "CGPA cannot be negative",
                                  },
                                  max: {
                                    value: 10,
                                    message: "CGPA cannot exceed 10",
                                  },
                                })}
                                error={!!educationForm.formState.errors.cgpa}
                                helperText={
                                  educationForm.formState.errors.cgpa?.message
                                }
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                label={
                                  <>
                                    Location{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </>
                                }
                                fullWidth
                                InputLabelProps={{ shrink: !!location }}
                                {...educationForm.register("location", {
                                  required: "Location is required",
                                })}
                                error={!!educationForm.formState.errors.location}
                                helperText={
                                  educationForm.formState.errors.location?.message
                                }
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                label={
                                  <>
                                    Major Subject{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </>
                                }
                                fullWidth
                                InputLabelProps={{ shrink: !!majorSubject }}
                                {...educationForm.register("major_subject", {
                                  required: "Major subject is required",
                                })}
                                error={
                                  !!educationForm.formState.errors.major_subject
                                }
                                helperText={
                                  educationForm.formState.errors.major_subject
                                    ?.message
                                }
                              />
                            </Grid>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <Grid item xs={12} sm={6}>
                                <Controller
                                  name="passedout"
                                  control={educationControl}
                                  rules={{
                                    required: "Year of passing is required",
                                    validate: (date) => {
                                      if (!date) return "Date is required";
                                      const year = new Date(date).getFullYear();
                                      const currentYear =
                                        new Date().getFullYear() + 1;
                                      if (year < 1900)
                                        return "Enter a valid year";
                                      if (year > currentYear)
                                        return "Cannot be in the future";
                                      return true;
                                    },
                                  }}
                                  render={({
                                    field,
                                    fieldState: { error },
                                  }) => (
                                    <DatePicker
                                      label="Year of Passed Out"
                                      views={["year"]}
                                      value={field.value || null}
                                      onChange={(date) => field.onChange(date)}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          fullWidth
                                          InputLabelProps={{
                                            shrink: !!passedout,
                                          }}
                                          error={!!error}
                                          helperText={error?.message}
                                        />
                                      )}
                                    />
                                  )}
                                />
                              </Grid>
                            </LocalizationProvider>
                            <Grid item xs={12}>
                              <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                              >
                                Save
                              </Button>
                            </Grid>
                            <Grid item xs={12}>
                              <Button
                                type="button"
                                variant="outlined"
                                fullWidth
                                color="primary"
                                onClick={() => educationForm.reset()}
                              >
                                Reset
                              </Button>
                            </Grid>
                          </Grid>
                        </form>
                      </CustomTabPanel>

                      <CustomTabPanel value={tabIndex} index={2}>
                        <form
                          onSubmit={bankingForm.handleSubmit(handleFinalSubmit)}
                        >
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                label={
                                  <>
                                    Account Holder Name{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </>
                                }
                                fullWidth
                                InputLabelProps={{
                                  shrink: !!accountHolderName,
                                }}
                                {...bankingForm.register("account_holder_name", {
                                  required: "Account holder name is required",
                                  pattern: {
                                    value: /^[A-Za-z\s]+$/,
                                    message:
                                      "Only letters and spaces are allowed",
                                  },
                                })}
                                error={
                                  !!bankingForm.formState.errors
                                    .account_holder_name
                                }
                                helperText={
                                  bankingForm.formState.errors
                                    .account_holder_name?.message
                                }
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                label={
                                  <>
                                    Bank Name{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </>
                                }
                                fullWidth
                                InputLabelProps={{ shrink: !!bankName }}
                                {...bankingForm.register("bank_name", {
                                  required: "Bank name is required",
                                })}
                                error={!!bankingForm.formState.errors.bank_name}
                                helperText={
                                  bankingForm.formState.errors.bank_name?.message
                                }
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                label={
                                  <>
                                    Account Number{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </>
                                }
                                fullWidth
                                InputLabelProps={{ shrink: !!accountNumber }}
                                {...bankingForm.register("account_number", {
                                  required: "Account number is required",
                                  pattern: {
                                    value: /^[0-9]{9,18}$/,
                                    message:
                                      "Account number should be 9 to 18 digits",
                                  },
                                })}
                                error={
                                  !!bankingForm.formState.errors.account_number
                                }
                                helperText={
                                  bankingForm.formState.errors.account_number
                                    ?.message
                                }
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                label={
                                  <>
                                    IFSC Code{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </>
                                }
                                fullWidth
                                InputLabelProps={{ shrink: !!ifscCode }}
                                {...bankingForm.register("ifsc_code", {
                                  required: "IFSC code is required",
                                  pattern: {
                                    value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                                    message: "Enter a valid IFSC code",
                                  },
                                })}
                                error={!!bankingForm.formState.errors.ifsc_code}
                                helperText={
                                  bankingForm.formState.errors.ifsc_code?.message
                                }
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                label={
                                  <>
                                    Branch Name{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </>
                                }
                                fullWidth
                                InputLabelProps={{ shrink: !!branchName }}
                                {...bankingForm.register("branch_name", {
                                  required: "Branch name is required",
                                })}
                                error={!!bankingForm.formState.errors.branch_name}
                                helperText={
                                  bankingForm.formState.errors.branch_name
                                    ?.message
                                }
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                label={
                                  <>
                                    Bank Location{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </>
                                }
                                fullWidth
                                InputLabelProps={{ shrink: !!bankLocation }}
                                {...bankingForm.register("bank_location", {
                                  required: "Bank location is required",
                                })}
                                error={
                                  !!bankingForm.formState.errors.bank_location
                                }
                                helperText={
                                  bankingForm.formState.errors.bank_location
                                    ?.message
                                }
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                              >
                                Submit
                              </Button>
                            </Grid>
                            <Grid item xs={12}>
                              <Button
                                type="button"
                                variant="outlined"
                                onClick={() => bankingForm.reset()}
                                fullWidth
                              >
                                Reset
                              </Button>
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
