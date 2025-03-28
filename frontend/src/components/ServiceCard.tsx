import React, { memo, useCallback } from 'react';
import { Service } from '../types/Service';
import UptimeChart from './UptimeChart';

interface ServiceCardProps {
  service: Service;
  onDelete: (id: string) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = memo(({ service, onDelete }) => {
  const handleDelete = useCallback(() => {
    onDelete(service.id);
  }, [onDelete, service.id]);

  return (
    <div className="service-card">
      <UptimeChart service={service} />
      <button 
        className="delete-button"
        onClick={handleDelete}
        aria-label="Delete service"
      >
        x
      </button>
      <h3>{service.name}</h3>
      <p>{service.url}</p>
      <div className={`status-indicator ${service.status.toLowerCase()}`}>
        {service.status}
      </div>
    </div>
  );
});

ServiceCard.displayName = 'ServiceCard';

export default ServiceCard; 