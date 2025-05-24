import { useState } from "react";
import TableOperations from "../../ui/TableOperations";
import Filter from "../../ui/Filter";
import SortBy from "../../ui/SortBy";
import Modal from "../../ui/Modal";
import BookingForm from "../bookings/BookingForm";
import Button from "../../ui/Button";
import styled from "styled-components";
// Add styled component for the container
const OperationsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

function BookingTableOperations() {
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  return (
    <OperationsContainer>
      <TableOperations>
        <Filter
          filterField="status"
          options={[
            { value: "all", label: "All" },
            { value: "checked_out", label: "Checked out" },
            { value: "checked_in", label: "Checked in" },
            { value: "unconfirmed", label: "Unconfirmed" },
          ]}
        />

        <SortBy
          options={[
            {
              value: "startDate-desc",
              label: "Sort by date (recent first)",
            },
            {
              value: "startDate-asc",
              label: "Sort by date (earlier first)",
            },
            {
              value: "totalPrice-desc",
              label: "Sort by amount (high first)",
            },
            {
              value: "totalPrice-asc",
              label: "Sort by amount (low first)",
            },
          ]}
        />
      </TableOperations>
      
      <button 
        className="create-booking-btn"
        onClick={() => setShowBookingModal(true)}
      >
        Create New Booking
      </button>
      
      {/* Booking Modal */}
      {showBookingModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              className="close-modal-btn"
              onClick={() => setShowBookingModal(false)}
            >
              &times;
            </button>
            <BookingForm onClose={() => setShowBookingModal(false)} />
          </div>
        </div>
      )}
      
      <style jsx="true">{`
        .operations-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }
        
        .create-booking-btn {
          background-color: #4CAF50;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.3s;
        }
        
        .create-booking-btn:hover {
          background-color: #45a049;
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .modal-content {
          background-color: rgba(0, 0, 0, 0.5);
          padding: 20px;
          border-radius: 8px;
          max-width: 90%;
          max-height: 90%;
          overflow-y: auto;
          position: relative;
        }
        
        .close-modal-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
        }
        
        .close-modal-btn:hover {
          color: #000;
        }
      `}</style>

    </OperationsContainer>
  );
}

export default BookingTableOperations;