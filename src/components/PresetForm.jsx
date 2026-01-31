import React, { useState } from 'react';
import { presets } from '../schema';
import { scheduleProcess, formatDateTime } from '../utils';
import './PresetForm.css';

function PresetForm({ onScheduleProcess }) {
  const [selectedPreset, setSelectedPreset] = useState(presets[0]);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // Set default start time to now
  React.useEffect(() => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().slice(0, 5);
    setStartDate(date);
    setStartTime(time);
  }, []);

  const handlePresetChange = (e) => {
    const preset = presets.find(p => p.id === e.target.value);
    setSelectedPreset(preset);
    setShowPreview(false);
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleSchedule = () => {
    if (!startDate || !startTime) {
      alert('Please select a start date and time');
      return;
    }

    const startDateTime = new Date(`${startDate}T${startTime}`);
    if (isNaN(startDateTime.getTime())) {
      alert('Invalid date/time');
      return;
    }

    const scheduledProcess = scheduleProcess(selectedPreset, startDateTime);
    onScheduleProcess(scheduledProcess);
    
    // Reset form
    const now = new Date();
    setStartDate(now.toISOString().split('T')[0]);
    setStartTime(now.toTimeString().slice(0, 5));
    setShowPreview(false);
  };

  const getPreviewSchedule = () => {
    if (!startDate || !startTime) return null;
    const startDateTime = new Date(`${startDate}T${startTime}`);
    if (isNaN(startDateTime.getTime())) return null;
    return scheduleProcess(selectedPreset, startDateTime);
  };

  const previewSchedule = showPreview ? getPreviewSchedule() : null;

  return (
    <div className="preset-form">
      <h2>Schedule a Process</h2>
      
      <div className="form-section">
        <label htmlFor="preset-select">Select Process Preset:</label>
        <select 
          id="preset-select"
          value={selectedPreset.id} 
          onChange={handlePresetChange}
          className="preset-select"
        >
          {presets.map(preset => (
            <option key={preset.id} value={preset.id}>
              {preset.name} ({preset.category})
            </option>
          ))}
        </select>
      </div>

      {selectedPreset && (
        <div className="preset-info">
          <h3>{selectedPreset.name}</h3>
          <p className="preset-description">{selectedPreset.description}</p>
          
          {selectedPreset.metadata && (
            <div className="preset-metadata">
              {Object.entries(selectedPreset.metadata).map(([key, value]) => (
                <div key={key} className="metadata-item">
                  <strong>{key}:</strong> {value}
                </div>
              ))}
            </div>
          )}

          <div className="preset-steps-summary">
            <strong>Steps:</strong> {selectedPreset.steps.length} steps
            <span className="separator">•</span>
            <strong>Total Duration:</strong> ~{Math.round(selectedPreset.totalDurationMinutes / 60)} hours
          </div>
        </div>
      )}

      <div className="form-section">
        <label htmlFor="start-date">Start Date:</label>
        <input
          id="start-date"
          type="date"
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            setShowPreview(false);
          }}
          className="date-input"
        />
      </div>

      <div className="form-section">
        <label htmlFor="start-time">Start Time:</label>
        <input
          id="start-time"
          type="time"
          value={startTime}
          onChange={(e) => {
            setStartTime(e.target.value);
            setShowPreview(false);
          }}
          className="time-input"
        />
      </div>

      <div className="form-actions">
        <button 
          onClick={handlePreview}
          className="btn-preview"
        >
          Preview Schedule
        </button>
        <button 
          onClick={handleSchedule}
          className="btn-schedule"
        >
          Schedule Process
        </button>
      </div>

      {previewSchedule && (
        <div className="schedule-preview">
          <h3>Schedule Preview</h3>
          <div className="preview-info">
            <div>
              <strong>Start:</strong> {formatDateTime(previewSchedule.startTime)}
            </div>
            <div>
              <strong>End:</strong> {formatDateTime(previewSchedule.endTime)}
            </div>
          </div>
          
          <div className="preview-steps">
            <h4>Timeline:</h4>
            <div className="timeline">
              {previewSchedule.steps.map((step, idx) => (
                <div key={step.id} className="timeline-step">
                  <div className="timeline-marker">{idx + 1}</div>
                  <div className="timeline-content">
                    <div className="timeline-step-name">
                      {step.name}
                      {step.hasAlarm && <span className="alarm-icon" title="Alarm enabled">🔔</span>}
                    </div>
                    <div className="timeline-step-time">
                      {formatDateTime(step.scheduledTime)}
                      {step.durationMinutes > 0 && (
                        <span className="duration"> ({step.durationMinutes} min)</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PresetForm;
