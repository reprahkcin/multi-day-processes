import React, { useState, useEffect } from 'react';
import { formatDateTime, getTimeRemaining, getCurrentStep, getNextStep } from '../utils';
import './Dashboard.css';

function Dashboard({ scheduledProcesses, onCompleteStep, onDeleteProcess }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (scheduledProcesses.length === 0) {
    return (
      <div className="dashboard empty">
        <div className="empty-state">
          <h2>No Scheduled Processes</h2>
          <p>Create a new process from a preset to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h2>Active Processes</h2>
      <div className="process-list">
        {scheduledProcesses.map(process => {
          const currentStep = getCurrentStep(process);
          const nextStep = getNextStep(process);
          const progress = (process.steps.filter(s => s.completed).length / process.steps.length) * 100;

          return (
            <div key={process.id} className={`process-card ${process.status}`}>
              <div className="process-header">
                <h3>{process.name}</h3>
                <span className={`status-badge ${process.status}`}>
                  {process.status}
                </span>
              </div>

              <div className="process-timeline">
                <div className="timeline-info">
                  <span>Started: {formatDateTime(process.startTime)}</span>
                  <span>Ends: {formatDateTime(process.endTime)}</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="progress-text">
                  {Math.round(progress)}% complete ({process.steps.filter(s => s.completed).length}/{process.steps.length} steps)
                </div>
              </div>

              {currentStep && (
                <div className="current-step active-step">
                  <div className="step-badge">Current Step</div>
                  <h4>{currentStep.name}</h4>
                  <p>{currentStep.description}</p>
                  {currentStep.notes && (
                    <div className="step-notes">📝 {currentStep.notes}</div>
                  )}
                  <div className="step-actions">
                    <button
                      className="btn-complete"
                      onClick={() => onCompleteStep(process.id, currentStep.index)}
                    >
                      ✓ Mark Complete
                    </button>
                  </div>
                </div>
              )}

              {!currentStep && nextStep && (
                <div className="next-step">
                  <div className="step-badge upcoming">Next Step</div>
                  <h4>{nextStep.name}</h4>
                  <p>{nextStep.description}</p>
                  <div className="step-time">
                    ⏰ {formatDateTime(nextStep.scheduledTime)}
                    <span className="time-remaining">
                      ({getTimeRemaining(nextStep.scheduledTime)} remaining)
                    </span>
                  </div>
                </div>
              )}

              {!currentStep && !nextStep && process.status === 'completed' && (
                <div className="completed-message">
                  <span className="completion-icon">🎉</span>
                  <h4>Process Complete!</h4>
                  <p>Completed at {formatDateTime(process.completedAt)}</p>
                </div>
              )}

              <details className="steps-details">
                <summary>View All Steps ({process.steps.length})</summary>
                <div className="steps-list">
                  {process.steps.map((step, idx) => (
                    <div 
                      key={step.id} 
                      className={`step-item ${step.completed ? 'completed' : ''} ${currentStep?.index === idx ? 'current' : ''}`}
                    >
                      <div className="step-number">{idx + 1}</div>
                      <div className="step-content">
                        <div className="step-title">
                          {step.completed && <span className="check-mark">✓</span>}
                          {step.name}
                        </div>
                        <div className="step-time-info">
                          {formatDateTime(step.scheduledTime)}
                          {!step.completed && step.scheduledTime > currentTime && (
                            <span className="time-until">
                              {' '}({getTimeRemaining(step.scheduledTime)})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </details>

              <div className="process-actions">
                <button
                  className="btn-delete"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this process?')) {
                      onDeleteProcess(process.id);
                    }
                  }}
                >
                  Delete Process
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;
