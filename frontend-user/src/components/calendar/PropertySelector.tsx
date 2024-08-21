"use client";
import React from 'react';
import { Property } from '@/types';

interface PropertySelectorProps {
    properties: Property[];
    selectedProperty: Property | null;
    onPropertyChange: (property: Property) => void;
}

const PropertySelector: React.FC<PropertySelectorProps> = ({ properties, selectedProperty, onPropertyChange }) => {
    return (
        <select
            value={selectedProperty?.id || ''}
            onChange={(e) => {
                const property = properties.find(p => p.id === Number(e.target.value));
                if (property) onPropertyChange(property);
            }}
        >
            {properties.map(property => (
                <option key={property.id} value={property.id}>
                    {property.address}
                </option>
            ))}
        </select>
    );
};

export default PropertySelector;