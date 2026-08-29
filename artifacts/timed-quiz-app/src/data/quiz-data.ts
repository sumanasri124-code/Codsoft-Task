export type QuizQuestion = {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctAnswer: number;
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'capital-australia',
    question: 'Which city is the capital of Australia?',
    options: ['Sydney', 'Canberra', 'Melbourne', 'Perth'],
    correctAnswer: 1,
  },
  {
    id: 'red-planet',
    question: 'Which planet is often called the Red Planet?',
    options: ['Venus', 'Jupiter', 'Mars', 'Mercury'],
    correctAnswer: 2,
  },
  {
    id: 'largest-ocean',
    question: 'What is the largest ocean on Earth?',
    options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
    correctAnswer: 3,
  },
  {
    id: 'photosynthesis',
    question: 'What gas do plants take in during photosynthesis?',
    options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'],
    correctAnswer: 2,
  },
  {
    id: 'shakespeare',
    question: 'Who wrote the play Romeo and Juliet?',
    options: ['William Shakespeare', 'Jane Austen', 'Mark Twain', 'Charles Dickens'],
    correctAnswer: 0,
  },
  {
    id: 'boiling-point',
    question: 'At sea level, water boils at what temperature in Celsius?',
    options: ['90°C', '100°C', '110°C', '120°C'],
    correctAnswer: 1,
  },
  {
    id: 'ancient-egypt',
    question: 'The pyramids at Giza were built in which ancient civilization?',
    options: ['Roman', 'Mayan', 'Egyptian', 'Persian'],
    correctAnswer: 2,
  },
  {
    id: 'human-heart',
    question: 'How many chambers does a healthy human heart have?',
    options: ['Two', 'Three', 'Four', 'Five'],
    correctAnswer: 2,
  },
  {
    id: 'speed-light',
    question: 'What travels fastest through a vacuum?',
    options: ['Sound', 'Light', 'Water', 'Wind'],
    correctAnswer: 1,
  },
  {
    id: 'currency-japan',
    question: 'What is the official currency of Japan?',
    options: ['Won', 'Yuan', 'Rupee', 'Yen'],
    correctAnswer: 3,
  },
];