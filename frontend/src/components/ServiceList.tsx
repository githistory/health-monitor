import React from 'react';
import { Service } from '../types/Service';
import ServiceCard from './ServiceCard';

interface ServiceListProps {
  services: Service[];
  onDelete: (id: string) => void;
}

const ServiceList: React.FC<ServiceListProps> = ({ services, onDelete }) => {
  return (
    <div className="service-list">
      <h2>Monitored Services</h2>
      <div className="services-grid">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default ServiceList; 