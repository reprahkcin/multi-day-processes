/**
 * Schema for multi-day process presets
 * 
 * This schema defines the structure for process templates
 * that can be scheduled and adjusted based on start times.
 */

/**
 * @typedef {Object} ProcessStep
 * @property {string} id - Unique identifier for the step
 * @property {string} name - Name of the step (e.g., "Feed starter")
 * @property {string} description - Detailed description of what to do
 * @property {number} durationMinutes - How long this step takes (0 if instantaneous)
 * @property {number} delayAfterPreviousMinutes - Minutes to wait after previous step completes
 * @property {boolean} hasAlarm - Whether this step should trigger an alarm
 * @property {string} [notes] - Optional additional notes
 */

/**
 * @typedef {Object} ProcessPreset
 * @property {string} id - Unique identifier for the preset
 * @property {string} name - Name of the process (e.g., "Classic Sourdough")
 * @property {string} category - Category (e.g., "Bread", "Painting")
 * @property {string} description - Description of the process
 * @property {number} totalDurationMinutes - Estimated total duration
 * @property {ProcessStep[]} steps - Array of steps in the process
 * @property {Object} [metadata] - Optional metadata (difficulty, yield, etc.)
 */

/**
 * @typedef {Object} ScheduledProcess
 * @property {string} id - Unique identifier for this scheduled instance
 * @property {string} presetId - ID of the preset being used
 * @property {string} name - Name of this scheduled process
 * @property {Date} startTime - When the process starts
 * @property {ProcessStep[]} steps - Steps with calculated times
 * @property {string} status - Current status (scheduled, in-progress, completed, paused)
 * @property {number} currentStepIndex - Index of current step
 * @property {Date} [completedAt] - When the process was completed
 */

// Default sourdough bread-making preset
export const sourdoughPreset = {
  id: 'sourdough-classic',
  name: 'Classic Sourdough Bread',
  category: 'Bread',
  description: 'Traditional sourdough bread using natural starter. Takes 2-3 days from start to finish.',
  totalDurationMinutes: 2880, // ~48 hours
  metadata: {
    difficulty: 'Intermediate',
    yield: '2 loaves',
    temperature: '70-75°F ambient'
  },
  steps: [
    {
      id: 'step-1',
      name: 'Feed Starter',
      description: 'Feed your sourdough starter with equal parts flour and water. Use 50g starter, 50g flour, 50g water.',
      durationMinutes: 15,
      delayAfterPreviousMinutes: 0,
      hasAlarm: true,
      notes: 'Starter should be active and bubbly from previous feeding'
    },
    {
      id: 'step-2',
      name: 'Wait for Starter Peak',
      description: 'Wait for starter to double in size and become bubbly and active.',
      durationMinutes: 0,
      delayAfterPreviousMinutes: 240, // 4 hours
      hasAlarm: true,
      notes: 'Timing depends on temperature. Should pass float test.'
    },
    {
      id: 'step-3',
      name: 'Mix Dough (Autolyse)',
      description: 'Mix 500g bread flour, 350g water. Let rest for 30-60 minutes.',
      durationMinutes: 10,
      delayAfterPreviousMinutes: 0,
      hasAlarm: true,
      notes: 'No salt or starter yet, just flour and water'
    },
    {
      id: 'step-4',
      name: 'Add Starter and Salt',
      description: 'Add 100g active starter and 10g salt to the dough. Mix thoroughly by hand.',
      durationMinutes: 15,
      delayAfterPreviousMinutes: 45,
      hasAlarm: true,
      notes: 'Pinch and fold to incorporate fully'
    },
    {
      id: 'step-5',
      name: 'Bulk Fermentation - Fold 1',
      description: 'Perform first set of stretch and folds (4 folds).',
      durationMinutes: 5,
      delayAfterPreviousMinutes: 30,
      hasAlarm: true,
      notes: 'Wet hands, stretch dough and fold over itself'
    },
    {
      id: 'step-6',
      name: 'Bulk Fermentation - Fold 2',
      description: 'Perform second set of stretch and folds.',
      durationMinutes: 5,
      delayAfterPreviousMinutes: 30,
      hasAlarm: true
    },
    {
      id: 'step-7',
      name: 'Bulk Fermentation - Fold 3',
      description: 'Perform third set of stretch and folds.',
      durationMinutes: 5,
      delayAfterPreviousMinutes: 30,
      hasAlarm: true
    },
    {
      id: 'step-8',
      name: 'Bulk Fermentation - Rest',
      description: 'Let dough rest undisturbed until it has grown 50-75% in size.',
      durationMinutes: 0,
      delayAfterPreviousMinutes: 180, // 3 hours
      hasAlarm: true,
      notes: 'Total bulk fermentation: ~4-5 hours'
    },
    {
      id: 'step-9',
      name: 'Pre-shape',
      description: 'Turn dough onto floured surface, divide if making 2 loaves, pre-shape into rounds.',
      durationMinutes: 10,
      delayAfterPreviousMinutes: 0,
      hasAlarm: true,
      notes: 'Handle gently to preserve air bubbles'
    },
    {
      id: 'step-10',
      name: 'Bench Rest',
      description: 'Let pre-shaped dough rest on counter, covered.',
      durationMinutes: 0,
      delayAfterPreviousMinutes: 20,
      hasAlarm: true
    },
    {
      id: 'step-11',
      name: 'Final Shape',
      description: 'Shape dough into final form (boule or batard). Place in floured banneton seam-side up.',
      durationMinutes: 10,
      delayAfterPreviousMinutes: 0,
      hasAlarm: true,
      notes: 'Create good surface tension for nice rise'
    },
    {
      id: 'step-12',
      name: 'Cold Proof (Overnight)',
      description: 'Cover banneton and place in refrigerator for cold proof.',
      durationMinutes: 0,
      delayAfterPreviousMinutes: 720, // 12 hours minimum
      hasAlarm: true,
      notes: 'Can proof 8-24 hours. Longer = more sour flavor'
    },
    {
      id: 'step-13',
      name: 'Preheat Oven',
      description: 'Preheat oven to 500°F (260°C) with Dutch oven inside.',
      durationMinutes: 45,
      delayAfterPreviousMinutes: 0,
      hasAlarm: true,
      notes: 'Dutch oven must be very hot'
    },
    {
      id: 'step-14',
      name: 'Score and Bake',
      description: 'Turn dough onto parchment, score with lame or sharp knife. Bake covered 20 min at 500°F, then uncovered 25-30 min at 450°F.',
      durationMinutes: 50,
      delayAfterPreviousMinutes: 0,
      hasAlarm: true,
      notes: 'Internal temp should reach 205-210°F'
    },
    {
      id: 'step-15',
      name: 'Cool',
      description: 'Remove from oven and cool on wire rack.',
      durationMinutes: 0,
      delayAfterPreviousMinutes: 60,
      hasAlarm: true,
      notes: 'Wait at least 1 hour before slicing!'
    }
  ]
};

export const presets = [sourdoughPreset];

export default {
  sourdoughPreset,
  presets
};
