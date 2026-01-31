import React, { useState, useEffect, useRef } from 'react';
import { getCurrentStep, formatDateTime } from '../utils';
import './AlarmNotifier.css';

function AlarmNotifier({ scheduledProcesses }) {
  const [notifications, setNotifications] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioRef = useRef(null);
  const checkedSteps = useRef(new Set());

  useEffect(() => {
    // Create audio element for alarm sound
    if (!audioRef.current) {
      audioRef.current = new Audio();
      // Using a simple beep sound (data URL for a simple tone)
      audioRef.current.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURAQT6bn77BfHwc+j9L0xnMnBjOFz/LbjjkIHG3A7+SbUhERUajm8K9dHgU5kdP0yHUnBDaFz/LbjDgIG2u/7uCZUBEQUKjn8KpeHQU0j9P1y3YqBTSEzvLbizkIGmu/7uCZTRAQUqjn8KpfHgU1j9T1y3YqBDSFzvPaiTgIGmq/7t+XTRAQUqjo8KpfHgU1j9T1y3YqBDSEzvPaizcIGmu+7t+XTRAQUqjo8KpfHgU1j9T1y3YqBDSFzvPaizcIGmu/7uCZUBEQUKjn8KpeHQU0j9P1y3YqBTSEzvLbjDgHGmu/7uCZUBEQUKjn8KpeHQU0j9P1y3YqBTSEzvLbjDgHGmu/7uCZUBEQUKjn8KpeHQU0j9P1y3YqBTSEzvLbjDgHGmu/7uCZUBEQUKjn8KpdHgU1j9P1y3YqBTOEzvLbjDgHGmu/7uCZUBEQUKjn8KpdHgU1j9P1y3YqBTOEzvLbjDgHGmu/7uCZUBEQUKjn8KpdHgU1j9P1y3YqBTOEzvLbjDgHGmu/7uCZUBEQUKjn8KpdHgU1j9P1y3YqBTOEzvLbjDgHGmu/7uCZUBEQUKjn8KpdHgU1j9P1y3YqBTOEzvLbjDgHGmu/7uCZUBEQUKjn8KpdHgU1j9P1y3YqBTOEzvLbjDgHGmu/7uCZUBEQUKjn8KpdHgU1j9P1y3YqBTOEzvLbjDgHGmu/7uCZUBEQUKjn8KpdHgU1j9P1y3YqBTOEzvLbjDgHGmu/7uCZUBEQUKjn8KpdHgU1j9P1y3YqBTOEzvLbjDgHGmu/7uCZUBEQUKjn8KpdHgU1j9P1y3YqBTOEzvLbjDgHGmu/7uCZUBEQUKjn8KpdHgU1j9P1y3YqBTOEzvLbjDgHGmu/7uCZUBEQUKjn8KpdHgU1j9P1y3YqBTOEzvLbjDgHGmu/7uCZUBEQUKjn8KpdHgU1j9P1y3YqBTOEzvLbjDgHGmu/7uCZUBEQUKjn8KpdHgU1j9P1y3YqBTOEzvLbjDgHGmu/7uCZUBEQUKjn8KpdHgU1j9P1y3YqBTOEzvLbjDgHGmu/7uCZUBEQUKjn8KpdHgU1j9P1y3YqBTOEzvLbjDgHGmu/7uCZUBEQUKjn8KpdHgU1j9P1y3YqBTOEzvLbjDgHGmu/7uCZUBEQUKjn8KpdHg';
    }
  }, []);

  useEffect(() => {
    const checkForAlarms = () => {
      const now = new Date();
      const newNotifications = [];

      scheduledProcesses.forEach(process => {
        if (process.status === 'completed') return;

        const currentStep = getCurrentStep(process);
        
        // Check if we need to notify about current step
        if (currentStep && currentStep.hasAlarm) {
          const stepKey = `${process.id}-${currentStep.id}`;
          
          // Only notify once per step
          if (!checkedSteps.current.has(stepKey)) {
            // Check if step just became current (within last 5 seconds)
            const timeSinceScheduled = now - currentStep.scheduledTime;
            if (timeSinceScheduled >= 0 && timeSinceScheduled < 5000) {
              newNotifications.push({
                id: stepKey,
                processName: process.name,
                stepName: currentStep.name,
                description: currentStep.description,
                time: now
              });
              checkedSteps.current.add(stepKey);
            }
          }
        }
      });

      if (newNotifications.length > 0) {
        setNotifications(prev => [...newNotifications, ...prev].slice(0, 5));
        
        // Play sound
        if (soundEnabled && audioRef.current) {
          audioRef.current.play().catch(err => {
            console.warn('Could not play alarm sound:', err);
          });
        }

        // Show browser notification if permitted
        if ('Notification' in window && Notification.permission === 'granted') {
          newNotifications.forEach(notif => {
            new Notification(`${notif.processName}: ${notif.stepName}`, {
              body: notif.description,
              icon: '/vite.svg',
              tag: notif.id
            });
          });
        }
      }
    };

    // Check every second
    const interval = setInterval(checkForAlarms, 1000);
    checkForAlarms(); // Check immediately

    return () => clearInterval(interval);
  }, [scheduledProcesses, soundEnabled]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="alarm-notifier">
      <div className="alarm-controls">
        <label className="sound-toggle">
          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={(e) => setSoundEnabled(e.target.checked)}
          />
          <span>🔔 Sound Alarms</span>
        </label>
        
        {('Notification' in window && Notification.permission !== 'granted') && (
          <button 
            onClick={requestNotificationPermission}
            className="btn-enable-notifications"
          >
            Enable Browser Notifications
          </button>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="notifications-panel">
          <div className="notifications-header">
            <h3>🔔 Notifications ({notifications.length})</h3>
            <button onClick={clearAllNotifications} className="btn-clear">
              Clear All
            </button>
          </div>
          <div className="notifications-list">
            {notifications.map(notif => (
              <div key={notif.id} className="notification-item">
                <div className="notification-content">
                  <div className="notification-title">
                    {notif.processName}: {notif.stepName}
                  </div>
                  <div className="notification-description">
                    {notif.description}
                  </div>
                  <div className="notification-time">
                    {formatDateTime(notif.time)}
                  </div>
                </div>
                <button
                  onClick={() => dismissNotification(notif.id)}
                  className="btn-dismiss"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AlarmNotifier;
