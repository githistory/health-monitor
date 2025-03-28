import React, { useState } from 'react';

interface AddServiceFormProps {
  onSubmit: (name: string, url: string) => void;
}

const AddServiceForm: React.FC<AddServiceFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name, url);
    setName('');
    setUrl('');
  };

  return (
    <form onSubmit={handleSubmit} className="add-service-form">
      <h2>Add New Service</h2>
      <div className="form-group">
        <label htmlFor="name">Service Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="url">Service URL:</label>
        <input
          type="url"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
      </div>
      <button type="submit">Add Service</button>
    </form>
  );
};

export default AddServiceForm; 