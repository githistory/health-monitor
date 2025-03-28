import React from 'react';
import { Service } from '../types/Service';

interface ServiceListProps {
  services: Service[];
}

const ServiceList: React.FC<ServiceListProps> = ({ services }) => {
  return (
    <div className="service-list">
      <h2>Monitored Services</h2>
      <div className="services-grid">
        {services.map((service) => (
          <div key={service.id} className="service-card">
            <h3>{service.name}</h3>
            <p>{service.url}</p>
            <div className={`status-indicator ${service.status.toLowerCase()}`}>
              {service.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceList; 