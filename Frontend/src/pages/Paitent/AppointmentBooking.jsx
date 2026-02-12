import React from "react";
import { GoBackBtn } from "../../components/CustomComponents";

const AppointmentBooking = () => {
  return (
    <div className="page-container">
      <GoBackBtn title="Back to All Users" onBack="/admin/users" />
    </div>
  );
};

export default AppointmentBooking;
