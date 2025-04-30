
import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { UnitHeader } from "./UnitHeader";
import UnitContent from "./UnitContent";
import ReservationPanel from "./ReservationPanel";
import { getDomoImages } from "@/components/unit-detail/utils/unitHelpers";
import { useReservations } from "@/hooks/reservations";

const UnitDetail = () => {
  const { unitId } = useParams<{ unitId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchGlampingUnit } = useReservations();
  const [unit, setUnit] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Obtener el tipo de viajero desde los parámetros de consulta
  const queryParams = new URLSearchParams(location.search);
  const travelerType = queryParams.get('type') || 'default';

  useEffect(() => {
    const getUnitDetails = async () => {
      if (!unitId) {
        navigate('/');
        return;
      }

      try {
        const unitData = await fetchGlampingUnit(unitId);
        if (!unitData) {
          navigate('/');
          return;
        }
        
        setUnit(unitData);
      } catch (error) {
        console.error("Error fetching unit details:", error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    getUnitDetails();
  }, [unitId, navigate, fetchGlampingUnit]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="h-96 bg-gray-200 rounded mb-8"></div>
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!unit) return null;

  const domoImages = getDomoImages(unit.name);

  return (
    <div className="container mx-auto px-4 py-8">
      <UnitHeader navigate={navigate} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <UnitContent 
            unit={unit}
            domoImages={domoImages}
            travelerType={travelerType}
          />
        </div>
        
        <div className="sticky top-24 self-start">
          <ReservationPanel unitId={unitId || ''} unitType={unit.unit_type} />
        </div>
      </div>
    </div>
  );
};

export default UnitDetail;
