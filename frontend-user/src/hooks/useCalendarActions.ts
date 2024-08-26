import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Property, PropertyOccupation } from "@/types";
import { propertiesService } from "@/api/services/properties";

const useCalendarActions = () => {
  const { role, idRole } = useSelector((state: RootState) => state.auth);
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [occupations, setOccupations] = useState<PropertyOccupation[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      if (role === "LANDLORD" && idRole) {
        const response = await propertiesService.getApprovedPropertiesByLandlord(idRole);
        setProperties(response.data);
      }
    };
    fetchProperties().then();
  }, [role, idRole]);

  const selectProperty = async (property: Property) => {
    setSelectedProperty(property);
    const response = await propertiesService.getPropertyOccupations(property.id || 0);
    setOccupations(response.data);
  };

  const createOccupation = async (occupation: Omit<PropertyOccupation, "id">) => {
    const response = await propertiesService.createPropertyOccupation(occupation);
    setOccupations([...occupations, response.data]);
  };

  const updateOccupation = async (id: number, occupation: Partial<PropertyOccupation>) => {
    const response = await propertiesService.updatePropertyOccupation(id, occupation);
    setOccupations(occupations.map(o => o.id === id ? response.data : o));
  };

  const deleteOccupation = async (id: number) => {
    await propertiesService.deletePropertyOccupation(id);
    await refreshCalendar();
  };

  const refreshCalendar = async () => {
    if (selectedProperty) {
      const response = await propertiesService.getPropertyOccupations(selectedProperty.id || 0);
      setOccupations(response.data);
    }
  };

  return {
    properties,
    selectedProperty,
    occupations,
    actions: {
      selectProperty,
      createOccupation,
      updateOccupation,
      deleteOccupation,
      refreshCalendar,
    },
  };
};

export default useCalendarActions;