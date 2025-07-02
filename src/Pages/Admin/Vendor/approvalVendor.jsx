import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useEffect } from 'react';
// const initialRows = [
//   { id: 1, name: 'John Doe', email: 'john@example.com', expertise: 'Math', status: 'Pending', message: '' },
//   { id: 2, name: 'Jane Smith', email: 'jane@example.com', expertise: 'Science', status: 'Pending', message: '' },
// ];

export default function VendorApproval() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);


  useEffect(() => {
  fetch('http://localhost:8000/admin_gmt/vendors/')
      .then((res) => res.json())
      .then((result) => {
      // result: { status: "success", data: [...] }
      const data = Array.isArray(result.data) ? result.data : [];
      const updatedData = data.map((row, idx) => ({
        id: row.id || idx,
        firstname: row.firstname || '',
        business_name: row.business_name || '',
        contact_email: row.contact_email || '',
        contact_phone: row.contact_phone || '',
        gst_number: row.gst_number || '',
        message: '',
        ...row
      }));
      setRows(updatedData);
      })
      .catch((err) => {
        console.error('Error fetching trainers:', err);
      });
  }, []);

  const handleApprove = async (id) => {
    try {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('status', 'Approved');

      const response = await fetch('http://localhost:8000/admin_gmt/update-status', {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        setRows(prev =>
          prev.map(row =>
            row.id === id
              ? { ...row, status: 'Approved', message: 'Approved successfully ✅' }
              : row
          )
        );
      } else {
        console.error('Failed to approve trainer.');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
    setOpen(false);
  };

  const handleReject = async (id) => {
    try {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('status', 'Rejected');

      const response = await fetch('http://localhost:8000/admin_gmt/update-status', {
        method: 'PUT',
        body: formData,
      });
      console.log(formData);
      if (response.ok) {
        setRows(prev =>
          prev.map(row =>
            row.id === id
              ? { ...row, status: 'Rejected', message: 'Rejected successfully ❌' }
              : row
          )
        );
      } else {
        console.error('Failed to reject trainer.');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
    setOpen(false);
  };

  const handleView = (row) => {

    setSelectedRow(row);
    setOpen(true);
  };

  const columns = [
    { field: 'contact_email', headerName: 'Email', width: 120 },
    { field: 'firstname', headerName: 'First Name', width: 200 },
    { field: 'business_name', headerName: 'Buiesness Name', width: 220 },
    { field: 'contact_phone', headerName: 'Contact Number', width: 160 },  
    { field: 'gst_number', headerName: 'GST NUMBER', width: 160 },  
    { field: 'status', headerName: 'Status of Request', width: 160 },
    {
      field: 'actions',
      headerName: 'View',
      width: 100,
      renderCell: (params) => (
        <>
          <IconButton
            aria-label="view"
            color="primary"
            onClick={() => handleView(params.row)}
          >
            <VisibilityIcon />
          </IconButton>
        </>
      ),
    },
    {
    field: 'status-update',
    headerName: 'Status',
    width: 250,
    renderCell: (params) => {
      const handleChange = async (event) => {
        const newStatus = event.target.value;
        try {
          const formData = new FormData();
          console.log(params.row.id);
          formData.append('id', params.row.id); // Pass email
          formData.append('status', newStatus);
          console.log(formData);
          const response = await fetch('http://localhost:8000/admin_gmt/update-vendor-status/', {
            method: 'PUT',
            body: formData,
          });
          if (response.ok) {
            setRows(prev =>
              prev.map(row =>
                row.id === params.row.id
                  ? { ...row, status: newStatus, message: newStatus === 'Approved' ? 'Approved successfully ✅' : newStatus === 'Rejected' ? 'Rejected successfully ❌' : '' }
                  : row
              )
            );
          }
        } catch (error) {
          console.error('Network error:', error);
        }
      };

      return (
        <select value={params.row.status || 'waiting'} onChange={handleChange} class = "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          <option value="waiting">Waiting</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      );
    },

    },
  ];

  return (
<Paper style={{ height: 500, width: '100%', padding: 16 }}>
  <DataGrid
    rows={rows}
    columns={columns}
    pageSize={5}
    rowsPerPageOptions={[5]}
  />

  <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
    <DialogTitle>Vendor Details</DialogTitle>
    <DialogContent dividers>
      {selectedRow && (
        <>
          <Typography><strong>Vendor ID:</strong> {selectedRow.id}</Typography>
          <Typography><strong>Name:</strong> {selectedRow.name}</Typography>
          <Typography><strong>Email:</strong> {selectedRow.email}</Typography>
          <Typography><strong>Expertise:</strong> {selectedRow.expertise}</Typography>
          <Typography><strong>Status:</strong> {selectedRow.status}</Typography>
        </>
      )}
    </DialogContent>
    <DialogActions>
      <DialogActions>
          <Button
            color="success"
            variant="contained"
            startIcon={<CheckIcon />}
            onClick={() => handleApprove(selectedRow.id)}
          >
            Approve
          </Button>
          <Button
            color="error"
            variant="contained"
            startIcon={<CloseIcon />}
            onClick={() => handleReject(selectedRow.id)}
          >
            Reject
          </Button>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      <Button onClick={() => setOpen(false)}>Close</Button>
    </DialogActions>
  </Dialog>
</Paper>

  );
}
