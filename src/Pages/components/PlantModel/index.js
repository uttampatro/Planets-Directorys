import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import "./style.css";

const PlanetModal = ({ open, onClose, planet, residentsData }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{planet && `Residents of ${planet.name}`}</DialogTitle>
      <DialogContent>
        <ul className="residents-list">
          {planet &&
            residentsData[planet.name] &&
            residentsData[planet.name].map((resident, index) => (
              <li key={index} className="resident-item">
                <strong>{index + 1} - </strong>
                <strong> Name:</strong> {resident.data.name},{" "}
                <strong>Height:</strong> {resident.data.height},{" "}
                <strong>Mass:</strong> {resident.data.mass},{" "}
                <strong>Gender:</strong> {resident.data.gender}
              </li>
            ))}
        </ul>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlanetModal;
