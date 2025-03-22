
import React from "react";
import { reservationSuccessContent } from "@/data/siteContent";

export const ReservationHeader: React.FC = () => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-display font-bold text-primary mb-2">
        {reservationSuccessContent.title}
      </h2>
      <p className="text-lg mb-4">
        {reservationSuccessContent.subtitle}
      </p>
    </div>
  );
};
