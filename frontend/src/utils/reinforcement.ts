// src/utils/reinforcement.ts

type Mood = 'happy' | 'neutral' | 'sad' | 'anxious';
type Action = 'music' | 'quote' | 'breathing' | 'journal_prompt';

const moods: Mood[] = ['happy', 'neutral', 'sad', 'anxious'];
const actions: Action[] = ['music', 'quote', 'breathing', 'journal_prompt'];

type QTable = Record<Mood, Record<Action, number>>;

const STORAGE_KEY = 'rl_qtable';

/**
 * Initializes or loads the Q-table from localStorage
 */
export function initQTable(): QTable {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);

  const table: QTable = {} as QTable;
  moods.forEach((mood) => {
    table[mood] = {} as Record<Action, number>;
    actions.forEach((action) => {
      table[mood][action] = Math.random(); // Or start with 0
    });
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(table));
  return table;
}

/**
 * Choose an action using ε-greedy strategy
 */
export function chooseAction(
  mood: Mood,
  qTable: QTable,
  epsilon = 0.1
): Action {
  if (Math.random() < epsilon) {
    // Explore
    return actions[Math.floor(Math.random() * actions.length)];
  }

  // Exploit: pick action with max Q-value
  const moodActions = qTable[mood];
  return (Object.keys(moodActions) as Action[]).reduce((best, curr) =>
    moodActions[curr] > moodActions[best] ? curr : best
  );
}

/**
 * Update Q-table using Q-learning formula
 */
export function updateQ(
  qTable: QTable,
  mood: Mood,
  action: Action,
  reward: number,
  learningRate = 0.1,
  discountFactor = 0.95
): QTable {
  const currentQ = qTable[mood][action];
  const maxNextQ = Math.max(...Object.values(qTable[mood]));
  const updatedQ =
    currentQ + learningRate * (reward + discountFactor * maxNextQ - currentQ);

  qTable[mood][action] = updatedQ;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(qTable));
  return qTable;
}
