// src/utils/reinforcement.ts

export type Mood = 'happy' | 'neutral' | 'sad' | 'anxious' | 'angry' | 'burnt_out';
export type Action = 'music' | 'quote' | 'breathing' | 'journal' | 'evaluation' | 'daily-activities' | 'journal_prompt';

const moods: Mood[] = ['happy', 'neutral', 'sad', 'anxious', 'angry', 'burnt_out'];
const actions: Action[] = ['music', 'quote', 'breathing', 'journal', 'evaluation', 'daily-activities', 'journal_prompt'];

export type QTable = Record<Mood, Record<Action, number>>;

const STORAGE_KEY = 'rl_qtable';
const EPSILON_KEY = 'epsilon';
const FEEDBACK_KEY = 'feedback_log';

export function initQTable(): QTable {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);

  const table: QTable = {} as QTable;
  moods.forEach((mood) => {
    table[mood] = {} as Record<Action, number>;
    actions.forEach((action) => {
      table[mood][action] = Math.random();
    });
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(table));
  return table;
}

export function chooseAction(
  mood: Mood,
  qTable: QTable
): Action {
  let epsilon = parseFloat(localStorage.getItem(EPSILON_KEY) || '0.2');
  if (Math.random() < epsilon) {
    return actions[Math.floor(Math.random() * actions.length)];
  }

  const moodActions = qTable[mood];
  return (Object.keys(moodActions) as Action[]).reduce((best, curr) =>
    moodActions[curr] > moodActions[best] ? curr : best
  );
}

export function getRecommendedActionForMood(mood: Mood): Action {
  const qTable = initQTable();
  const action = chooseAction(mood, qTable);
  localStorage.setItem('rl_action_source', action);
  return action;
}

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

export function updateExplorationRate() {
  let epsilon = parseFloat(localStorage.getItem(EPSILON_KEY) || '0.2');
  epsilon = Math.max(0.05, epsilon * 0.98);
  localStorage.setItem(EPSILON_KEY, epsilon.toString());
}

export function logFeedback(mood: Mood, action: Action, reward: number) {
  const stored = localStorage.getItem(FEEDBACK_KEY);
  const feedbackLog: { mood: Mood; action: Action; reward: number }[] =
    stored ? JSON.parse(stored) : [];
  feedbackLog.push({ mood, action, reward });
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(feedbackLog));
}

export function flushFeedbackToQ(qTable: QTable): QTable {
  const stored = localStorage.getItem(FEEDBACK_KEY);
  if (!stored) return qTable;

  const feedbackLog: { mood: Mood; action: Action; reward: number }[] = JSON.parse(stored);
  feedbackLog.forEach(({ mood, action, reward }) => {
    updateQ(qTable, mood, action, reward);
  });
  localStorage.removeItem(FEEDBACK_KEY);
  return qTable;
}

export function detectMoodFromInput(input: string): Mood | null {
    const text = input.toLowerCase();
  
    if (
      /(sad|depressed|unhappy|upset|miserable|low|crying|hopeless|exhausted|fatigued|numb|empty)/.test(text)
    ) return 'sad';
  
    if (
      /(anxious|nervous|worried|tense|stressed|panic|can't sleep|insomnia|racing thoughts|restless|overthinking)/.test(text)
    ) return 'anxious';
  
    if (
      /(angry|frustrated|irritated|rage|furious|mad)/.test(text)
    ) return 'angry';
  
    if (
      /(burnt out|burned out|exhaustion|drained|overwhelmed|worn out)/.test(text)
    ) return 'burnt_out';
  
    if (
      /(okay|fine|normal|meh|neutral|average|nothing much|same as usual)/.test(text)
    ) return 'neutral';
  
    if (
      /(happy|joyful|excited|grateful|content|hopeful|optimistic|cheerful|good)/.test(text)
    ) return 'happy';
  
    return null;
  }