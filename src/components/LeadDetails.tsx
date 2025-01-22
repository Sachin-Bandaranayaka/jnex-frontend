import { useState } from "react";
import { Lead, LeadStatus } from "@/interfaces/interfaces";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
} from "@mui/material";
import LeadForm from "./LeadForm";

interface LeadDetailsProps {
  lead: Lead;
  onClose: () => void;
  onUpdate: (data: Partial<Lead>) => void;
}

export default function LeadDetails({ lead, onClose, onUpdate }: LeadDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = (data: Partial<Lead>) => {
    onUpdate(data);
    setIsEditing(false);
  };

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case "new":
        return "primary";
      case "contacted":
        return "warning";
      case "qualified":
        return "success";
      case "converted":
        return "success";
      case "lost":
        return "error";
      default:
        return "default";
    }
  };

  if (isEditing) {
    return (
      <LeadForm
        open={true}
        onClose={() => setIsEditing(false)}
        onSubmit={handleUpdate}
        initialData={lead}
        isEdit={true}
      />
    );
  }

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Lead Details</DialogTitle>
      <DialogContent>
        <Box className="space-y-4">
          <Box className="flex justify-between items-start">
            <Typography variant="h6">{lead.name}</Typography>
            <Chip
              label={lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
              color={getStatusColor(lead.status)}
              size="small"
            />
          </Box>

          <Divider />

          <Box className="space-y-2">
            <Typography variant="subtitle2" color="textSecondary">
              Contact Information
            </Typography>
            <Typography>Email: {lead.email}</Typography>
            <Typography>Phone: {lead.phone}</Typography>
          </Box>

          <Divider />

          <Box className="space-y-2">
            <Typography variant="subtitle2" color="textSecondary">
              Lead Information
            </Typography>
            <Typography>Source: {lead.source}</Typography>
            <Typography>Notes: {lead.notes}</Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={() => setIsEditing(true)} variant="contained" color="primary">
          Edit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
