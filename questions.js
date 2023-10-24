


const { Questions } = require('./app/models');
// Define a function to insert dummy questions
const insertQuestions = async (questions, questionModule = "nothing") => {
  try {
    await Questions.create(questions);
    console.log(`Dummy questions added successfully. for module ${questionModule}`);
  } catch (error) {
    console.error('Error adding dummy questions:', error);
  }
};

// Dummy questions related to the "Noun" exercise for English language
// const dummyNounQuestions = [
//   {
//     Question: 'What is a common noun?',
//     Answer: 'A common noun is a generic name for a person, place, thing, or idea.',
//     Difficulty_level: 1,
//     Exercise_id: 'replace_with_actual_exercise_id1',
//     Language_id: 'replace_with_actual_language_id1',
//   },
//   {
//     Question: 'Identify the noun in the sentence: "The sun is shining."',
//     Answer: 'Noun: sun',
//     Difficulty_level: 1,
//     Exercise_id: 'replace_with_actual_exercise_id1',
//     Language_id: 'replace_with_actual_language_id1',
//   },
//   {
//     Question: 'Sort the following words into common nouns and proper nouns: teacher, London, school, river.',
//     Answer: 'Common Nouns: teacher, school, river; Proper Nouns: London',
//     Difficulty_level: 2,
//     Exercise_id: 'replace_with_actual_exercise_id1',
//     Language_id: 'replace_with_actual_language_id1',
//   },
//   {
//     Question: 'Provide an example of a collective noun.',
//     Answer: 'Example: team',
//     Difficulty_level: 2,
//     Exercise_id: 'replace_with_actual_exercise_id1',
//     Language_id: 'replace_with_actual_language_id1',
//   },
//   {
//     Question: 'Write a sentence using three common nouns.',
//     Answer: 'The dog, book, and tree are in the park.',
//     Difficulty_level: 3,
//     Exercise_id: 'replace_with_actual_exercise_id1',
//     Language_id: 'replace_with_actual_language_id1',
//   },
//   {
//     Question: 'What is the plural form of "child"?',
//     Answer: 'children',
//     Difficulty_level: 1,
//     Exercise_id: 'replace_with_actual_exercise_id1',
//     Language_id: 'replace_with_actual_language_id1',
//   },
//   {
//     Question: 'Rewrite the sentence using a pronoun: "The girl is playing in the garden."',
//     Answer: 'She is playing in the garden.',
//     Difficulty_level: 2,
//     Exercise_id: 'replace_with_actual_exercise_id1',
//     Language_id: 'replace_with_actual_language_id1',
//   },
//   {
//     Question: 'Identify the abstract noun in the sentence: "Hope is a beautiful thing."',
//     Answer: 'Abstract Noun: hope',
//     Difficulty_level: 2,
//     Exercise_id: 'replace_with_actual_exercise_id1',
//     Language_id: 'replace_with_actual_language_id1',
//   },
//   {
//     Question: 'Write a sentence using a proper noun and an abstract noun.',
//     Answer: 'London is known for its history.',
//     Difficulty_level: 3,
//     Exercise_id: 'replace_with_actual_exercise_id1',
//     Language_id: 'replace_with_actual_language_id1',
//   },
//   {
//     Question: 'Provide an example of a material noun.',
//     Answer: 'Example: gold',
//     Difficulty_level: 1,
//     Exercise_id: 'replace_with_actual_exercise_id1',
//     Language_id: 'replace_with_actual_language_id1',
//   },
// ];

// const pronounQuestions = [
//     {
//       Question: 'What is a pronoun?',
//       Answer: 'A pronoun is a word used to replace a noun to avoid repetition.',
//       Difficulty_level: 1,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Identify the pronoun in the sentence: "She is reading a book."',
//       Answer: 'Pronoun: She',
//       Difficulty_level: 1,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Rewrite the sentence using a pronoun: "The dog is barking loudly."',
//       Answer: 'It is barking loudly.',
//       Difficulty_level: 2,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'What is the possessive pronoun for "he"?',
//       Answer: 'His',
//       Difficulty_level: 1,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Provide an example of a reflexive pronoun.',
//       Answer: 'Example: herself',
//       Difficulty_level: 2,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Write a sentence using an indefinite pronoun.',
//       Answer: 'Everyone enjoyed the party.',
//       Difficulty_level: 3,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Replace the noun with a pronoun: "The car is fast."',
//       Answer: 'It is fast.',
//       Difficulty_level: 2,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Identify the relative pronoun in the sentence: "The book that I read is interesting."',
//       Answer: 'Relative Pronoun: that',
//       Difficulty_level: 3,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Write a sentence using both a subject and an object pronoun.',
//       Answer: 'She loves him.',
//       Difficulty_level: 3,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'What is the plural form of "it"?',
//       Answer: 'they',
//       Difficulty_level: 1,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
// ];

// const verbQuestions = [
//     {
//       Question: 'What is a verb?',
//       Answer: 'A verb is a word that describes an action or occurrence.',
//       Difficulty_level: 1,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Identify the verb in the sentence: "She sings beautifully."',
//       Answer: 'Verb: sings',
//       Difficulty_level: 1,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Write a sentence using an irregular verb.',
//       Answer: 'He ate dinner.',
//       Difficulty_level: 2,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Provide an example of an auxiliary verb.',
//       Answer: 'Example: "is"',
//       Difficulty_level: 2,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Rewrite the sentence using a modal verb: "You should eat your vegetables."',
//       Answer: 'You must eat your vegetables.',
//       Difficulty_level: 3,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'What is the past tense of "run"?',
//       Answer: 'ran',
//       Difficulty_level: 1,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Write a sentence using an intransitive verb.',
//       Answer: 'She sleeps peacefully.',
//       Difficulty_level: 2,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Identify the linking verb in the sentence: "The sky is blue."',
//       Answer: 'Linking Verb: is',
//       Difficulty_level: 3,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Write a sentence using both an action verb and a state-of-being verb.',
//       Answer: 'She dances gracefully and is happy.',
//       Difficulty_level: 3,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'What is the present participle of "sing"?',
//       Answer: 'singing',
//       Difficulty_level: 1,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
// ];

const adjectiveQuestions = [
    {
      Question: 'What is an adjective?',
      Answer: 'An adjective is a word that describes or modifies a noun.',
      Difficulty_level: 1,
      Exercise_id: excerId,
      Language_id: langId,
    },
    {
      Question: 'Identify the adjective in the sentence: "The red car is fast."',
      Answer: 'Adjective: red',
      Difficulty_level: 1,
      Exercise_id: excerId,
      Language_id: langId,
    },
    {
      Question: 'Write a sentence using a comparative adjective.',
      Answer: 'She is taller than her friend.',
      Difficulty_level: 2,
      Exercise_id: excerId,
      Language_id: langId,
    },
    {
      Question: 'Provide an example of a demonstrative adjective.',
      Answer: 'Example: "this"',
      Difficulty_level: 2,
      Exercise_id: excerId,
      Language_id: langId,
    },
    {
      Question: 'Rewrite the sentence using a superlative adjective: "This is a fast car."',
      Answer: 'This is the fastest car.',
      Difficulty_level: 3,
      Exercise_id: excerId,
      Language_id: langId,
    },
    {
      Question: 'What is the opposite of "happy"?',
      Answer: 'sad',
      Difficulty_level: 1,
      Exercise_id: excerId,
      Language_id: langId,
    },
    {
      Question: 'Write a sentence using an attributive adjective.',
      Answer: 'The beautiful flowers bloom in spring.',
      Difficulty_level: 2,
      Exercise_id: excerId,
      Language_id: langId,
    },
    {
      Question: 'Identify the adjective clause in the sentence: "The book that you borrowed is on the shelf."',
      Answer: 'Adjective Clause: that you borrowed',
      Difficulty_level: 3,
      Exercise_id: excerId,
      Language_id: langId,
    },
    {
      Question: 'Write a sentence using both a descriptive and a limiting adjective.',
      Answer: 'The tall tower is the tallest in the city.',
      Difficulty_level: 3,
      Exercise_id: excerId,
      Language_id: langId,
    },
    {
      Question: 'Provide an example of a possessive adjective.',
      Answer: 'Example: "my"',
      Difficulty_level: 1,
      Exercise_id: excerId,
      Language_id: langId,
    },
];

// const adverbQuestions = [
//     {
//       Question: 'What is an adverb?',
//       Answer: 'An adverb is a word that describes or modifies a verb, adjective, or other adverbs.',
//       Difficulty_level: 1,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Identify the adverb in the sentence: "She sings beautifully."',
//       Answer: 'Adverb: beautifully',
//       Difficulty_level: 1,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Write a sentence using a manner adverb.',
//       Answer: 'She speaks softly.',
//       Difficulty_level: 2,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Provide an example of a frequency adverb.',
//       Answer: 'Example: "often"',
//       Difficulty_level: 2,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Rewrite the sentence using a degree adverb: "She runs fast."',
//       Answer: 'She runs very fast.',
//       Difficulty_level: 3,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'What is the adverbial phrase in the sentence: "He spoke with great enthusiasm."',
//       Answer: 'Adverbial Phrase: with great enthusiasm',
//       Difficulty_level: 1,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Write a sentence using a time adverb.',
//       Answer: 'She arrived early.',
//       Difficulty_level: 2,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Identify the adverb clause in the sentence: "She smiled when she saw the gift."',
//       Answer: 'Adverb Clause: when she saw the gift',
//       Difficulty_level: 3,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Write a sentence using both a manner adverb and a frequency adverb.',
//       Answer: 'He speaks loudly and often during meetings.',
//       Difficulty_level: 3,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Provide an example of a place adverb.',
//       Answer: 'Example: "here"',
//       Difficulty_level: 1,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
// ];

// const prepositionQuestions = [
//     {
//       Question: 'What is a preposition?',
//       Answer: 'A preposition is a word that shows the relationship between a noun or pronoun and other words in a sentence.',
//       Difficulty_level: 1,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Identify the preposition in the sentence: "The book is on the table."',
//       Answer: 'Preposition: on',
//       Difficulty_level: 1,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Write a sentence using a time preposition.',
//       Answer: 'They arrived at 8 o'clock.',
//       Difficulty_level: 2,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Provide an example of a place preposition.',
//       Answer: 'Example: "under"',
//       Difficulty_level: 2,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Rewrite the sentence using a direction preposition: "The cat jumped over the fence."',
//       Answer: 'The cat jumped across the fence.',
//       Difficulty_level: 3,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'What is the object of the preposition in the sentence: "She went to the store."',
//       Answer: 'Object of the Preposition: store',
//       Difficulty_level: 1,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Write a sentence using a compound preposition.',
//       Answer: 'The book is on top of the shelf.',
//       Difficulty_level: 2,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Identify the prepositional phrase in the sentence: "He went to the park with his friends."',
//       Answer: 'Prepositional Phrase: to the park',
//       Difficulty_level: 3,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Write a sentence using both a time and a place preposition.',
//       Answer: 'She arrived at the airport on time.',
//       Difficulty_level: 3,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Provide an example of a cause preposition.',
//       Answer: 'Example: "because of"',
//       Difficulty_level: 1,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
// ];

// const conjunctionQuestions = [
//     {
//       Question: 'What is a conjunction?',
//       Answer: 'A conjunction is a word that connects words, phrases, or clauses in a sentence.',
//       Difficulty_level: 1,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Identify the conjunction in the sentence: "She wanted both cake and ice cream."',
//       Answer: 'Conjunction: and',
//       Difficulty_level: 1,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Write a sentence using a coordinating conjunction.',
//       Answer: 'She is kind, but he is strict.',
//       Difficulty_level: 2,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Provide an example of a subordinating conjunction.',
//       Answer: 'Example: "although"',
//       Difficulty_level: 2,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Rewrite the sentence using a correlative conjunction: "Either you help or you leave."',
//       Answer: 'You either help or you leave.',
//       Difficulty_level: 3,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'What is the conjunction that indicates a contrast?',
//       Answer: 'Conjunction: but',
//       Difficulty_level: 1,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Write a sentence using a conjunctive adverb as a conjunction.',
//       Answer: 'He likes running; moreover, he enjoys swimming.',
//       Difficulty_level: 2,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Identify the compound sentence with a coordinating conjunction: "She sang, and he danced."',
//       Answer: 'Compound Sentence: She sang, and he danced.',
//       Difficulty_level: 3,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Write a sentence using both a coordinating and a subordinating conjunction.',
//       Answer: 'He is both smart, and he studies hard because he wants to succeed.',
//       Difficulty_level: 3,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Provide an example of a correlative conjunction.',
//       Answer: 'Example: "neither...nor"',
//       Difficulty_level: 1,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
// ];

// const interjectionQuestions = [
//     {
//       Question: 'What is an interjection?',
//       Answer: 'An interjection is a word or phrase used to express strong emotion or sudden exclamations.',
//       Difficulty_level: 1,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Identify the interjection in the sentence: "Wow, that was amazing!"',
//       Answer: 'Interjection: Wow',
//       Difficulty_level: 1,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Write an interjection to express surprise.',
//       Answer: 'Interjection: Oh!',
//       Difficulty_level: 2,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Provide an example of an interjection used for expressing pain.',
//       Answer: 'Example: "Ouch!"',
//       Difficulty_level: 2,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Rewrite the sentence with an interjection: "Congratulations on your achievement."',
//       Answer: 'Hooray! Congratulations on your achievement!',
//       Difficulty_level: 3,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Write an interjection used to express approval.',
//       Answer: 'Interjection: Bravo!',
//       Difficulty_level: 1,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Write a sentence with an interjection that expresses disbelief.',
//       Answer: 'Oh no, I can\'t believe it!',
//       Difficulty_level: 2,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Identify the interjection that conveys excitement: "Yay, it's my birthday!"',
//       Answer: 'Interjection: Yay',
//       Difficulty_level: 3,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Write a sentence with an interjection used to express relief.',
//       Answer: 'Phew, I finally finished the project!',
//       Difficulty_level: 3,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
//     {
//       Question: 'Provide an example of an interjection used for greeting.',
//       Answer: 'Example: "Hello"',
//       Difficulty_level: 1,
//       Exercise_id: excerId,
//       Language_id: langId,
//     },
// ];
  
module.exports = {
insertQuestions,
}
