/**
 * Utilities for managing scheduled processes
 */

/**
 * Calculate the scheduled time for each step in a process
 * @param {Object} preset - The process preset
 * @param {Date} startTime - When the process should start
 * @returns {Object} Scheduled process with calculated step times
 */
export function scheduleProcess(preset, startTime) {
  const scheduledSteps = [];
  let currentTime = new Date(startTime);

  for (const step of preset.steps) {
    // Add delay after previous step
    currentTime = new Date(currentTime.getTime() + step.delayAfterPreviousMinutes * 60000);
    
    const scheduledStep = {
      ...step,
      scheduledTime: new Date(currentTime),
      endTime: new Date(currentTime.getTime() + step.durationMinutes * 60000),
      completed: false
    };
    
    scheduledSteps.push(scheduledStep);
    
    // Move current time forward by step duration
    currentTime = new Date(currentTime.getTime() + step.durationMinutes * 60000);
  }

  const totalMinutes = (currentTime - startTime) / 60000;
  
  return {
    id: `process-${Date.now()}`,
    presetId: preset.id,
    name: preset.name,
    startTime: new Date(startTime),
    endTime: currentTime,
    totalDurationMinutes: totalMinutes,
    steps: scheduledSteps,
    status: 'scheduled',
    currentStepIndex: 0,
    completedAt: null
  };
}

/**
 * Get the current active step for a scheduled process
 * @param {Object} scheduledProcess - The scheduled process
 * @returns {Object|null} The current step or null if none active
 */
export function getCurrentStep(scheduledProcess) {
  const now = new Date();
  
  for (let i = 0; i < scheduledProcess.steps.length; i++) {
    const step = scheduledProcess.steps[i];
    if (!step.completed && step.scheduledTime <= now) {
      return { ...step, index: i };
    }
  }
  
  return null;
}

/**
 * Get the next upcoming step
 * @param {Object} scheduledProcess - The scheduled process
 * @returns {Object|null} The next step or null if none
 */
export function getNextStep(scheduledProcess) {
  const now = new Date();
  
  for (let i = 0; i < scheduledProcess.steps.length; i++) {
    const step = scheduledProcess.steps[i];
    if (!step.completed && step.scheduledTime > now) {
      return { ...step, index: i };
    }
  }
  
  return null;
}

/**
 * Mark a step as completed
 * @param {Object} scheduledProcess - The scheduled process
 * @param {number} stepIndex - Index of the step to complete
 * @returns {Object} Updated scheduled process
 */
export function completeStep(scheduledProcess, stepIndex) {
  const updatedSteps = [...scheduledProcess.steps];
  updatedSteps[stepIndex] = {
    ...updatedSteps[stepIndex],
    completed: true,
    completedAt: new Date()
  };
  
  const allCompleted = updatedSteps.every(step => step.completed);
  
  return {
    ...scheduledProcess,
    steps: updatedSteps,
    currentStepIndex: stepIndex + 1,
    status: allCompleted ? 'completed' : 'in-progress',
    completedAt: allCompleted ? new Date() : null
  };
}

/**
 * Format duration in a human-readable way
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration
 */
export function formatDuration(minutes) {
  if (minutes < 60) {
    return `${minutes} min`;
  } else if (minutes < 1440) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  } else {
    const days = Math.floor(minutes / 1440);
    const hours = Math.floor((minutes % 1440) / 60);
    return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
  }
}

/**
 * Format a date/time for display
 * @param {Date} date - The date to format
 * @returns {string} Formatted date/time
 */
export function formatDateTime(date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
}

/**
 * Get time remaining until a future date
 * @param {Date} futureDate - The future date
 * @returns {string} Time remaining in human-readable format
 */
export function getTimeRemaining(futureDate) {
  const now = new Date();
  const diffMs = futureDate - now;
  
  if (diffMs <= 0) {
    return 'Now';
  }
  
  const minutes = Math.floor(diffMs / 60000);
  return formatDuration(minutes);
}
