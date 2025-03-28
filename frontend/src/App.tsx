import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './App.css';
import AddServiceForm from './components/AddServiceForm';
import ServiceList from './components/ServiceList';
import { Service } from './types/Service';

const API_BASE_URL = 'http://localhost:3000/api';
const SOCKET_URL = 'http://localhost:3000';

function App() {
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    socket.on('services', (initialServices: Service[]) => {
      setServices(initialServices);
    });

    socket.on('serviceUpdate', (updatedService: Service) => {
      setServices(prevServices => {
        const index = prevServices.findIndex(s => s.id === updatedService.id);
        if (index === -1) {
          return [...prevServices, updatedService];
        }
        const newServices = [...prevServices];
        newServices[index] = updatedService;
        return newServices;
      });
    });

    return () => {
      socket.close();
    };
  }, []);

  const handleAddService = async (name: string, url: string) => {
    try {
      setError(null); // Clear any previous errors
      const response = await fetch(`${API_BASE_URL}/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add service');
      }
    } catch (error) {
      console.error('Error adding service:', error);
      setError(error instanceof Error ? error.message : 'Failed to add service');
    }
  };

  const handleDeleteService = async (id: string) => {
    try {
      await fetch(`${API_BASE_URL}/services/${id}`, {
        method: 'DELETE',
      });
      // The socket event will handle updating the UI
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Health Monitoring System</h1>
      </header>
      <main>
        <AddServiceForm 
          onSubmit={handleAddService} 
          onInputChange={() => setError(null)}
        />
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        <ServiceList services={services} onDelete={handleDeleteService} />
      </main>
    </div>
  );
}

export default App;
