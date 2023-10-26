const calculatePercentage = (count, total) => {
  return ((count / total) * 100).toFixed(2) + '%';
};

const wordsArray = [
  "Beautiful",
  "Quickly",
  "Friendship",
  "Committed",
  "Quietly",
  "Knowledge",
  "Delightful",
  "Swiftly",
  "Dreaming",
  "Disobedient",
  "Wonderful",
  "Creatively",
  "Strength",
  "Generously",
  "Sorrowful",
  "Delicious",
  "Angrily",
  "Adventure",
  "Mysterious",
  "Seriously",
  "Excitement",
  "Carefully",
  "Lonely",
  "Courageously",
  "Happiness",
  "Elegantly",
  "Successful",
  "Daring",
  "Hesitantly",
  "Curiosity",
  "Curious",
  "Honestly",
  "Laughter",
  "Brilliant",
  "Reluctantly",
  "Freedom",
  "Powerful",
  "Grateful",
  "Silently",
  "Friendship",
  "Quickly",
  "Gentle",
  "Enthusiastically",
  "Hopeful",
  "Surprising",
  "Confident",
  "Abundant",
  "Frightened",
  "Sympathy",
  "Joyful"
];

function getRandomWordsWithoutRepetition(array, numWords) {

  const shuffledArray = array.slice(); // Create a copy of the array to shuffle.
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Shuffle the array.
  }

  return shuffledArray.slice(0, numWords); // Get the first `numWords` from the shuffled array.
}

const addOptions = function(options){
  const randomWords = getRandomWordsWithoutRepetition(wordsArray, 3);
  options = [...options, ...randomWords];
  console.log("these are options",options);
  return options;
}

module.exports = {addOptions, calculatePercentage}