import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {Property, PropertyOccupation, ProviderOccupation} from "@/types";
import { propertiesService } from "@/api/services/properties";
import {servicesService} from "@/api/services/services";

const useCalendarActions = () => {
  const { role } = useSelector((state: RootState) => state.auth);
  const [occupations, setOccupations] = useState<ProviderOccupation[]>([]);

  useEffect(() => {
    const fetchOccupations = async () => {
      if (role === "SERVICE_PROVIDER") {
        const response = await servicesService.getMyOccupations();
        setOccupations(response.data);
      }
    };
    fetchOccupations().then();
  }, [role]);

  const createOccupation = async (occupation: Pick<ProviderOccupation, "startDate" | "endDate">) => {
    const response = await servicesService.createOccupation(occupation);
    setOccupations([...occupations, response.data]);
  };

  const updateOccupation = async (id: number, occupation: Partial<ProviderOccupation>) => {
    const response = await servicesService.updateOccupation(id, occupation);
    setOccupations(occupations.map(o => o.id === id ? response.data : o));
  };

  const deleteOccupation = async (id: number) => {
    await servicesService.deleteOccupation(id);
    await refreshCalendar();
  };

  const refreshCalendar = async () => {
      const response = await servicesService.getMyOccupations();
      setOccupations(response.data);
  };

  return {
    occupations,
    actions: {
      createOccupation,
      updateOccupation,
      deleteOccupation,
      refreshCalendar,
    },
  };
};

export default useCalendarActions;