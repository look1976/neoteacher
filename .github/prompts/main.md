I want to build a foreign language learning application from scratch, inspired by the classic eTeacher program from the 1990s, but in a modern form.

Create a complete single-page web application with a backend and a database. The application must work locally or in a self-hosted environment, without requiring cloud services. The goal is to build a multimedia language training tool, not a complete step-by-step course.

The main idea of the program:

- the user practices vocabulary, grammar, translations and sentence comprehension,
- the program checks answers,
- the program stores results,
- the program repeats incorrect or weakly mastered questions,
- the user can create custom exercises,
- the application supports multiple languages, initially English,
- the application works as a local “language practice laboratory”.

Application name: NeoTeacher.

────────────────────────────────────
1. MAIN ASSUMPTIONS
────────────────────────────────────

The application should include:

1. User/student profile system

   - the user selects an existing profile or creates a new one,
   - each profile has separate progress, settings and statistics,
   - a full online login system is not required; a local profile system is enough,
   - optionally, a simple username/password login may be added.

2. Student dashboard

   - view of recent exercises,
   - proficiency level,
   - number of completed exercises,
   - percentage of correct answers,
   - list of topics to review,
   - quick “Continue learning” button,
   - quick “Repeat mistakes” button.

3. Learning modules

   - Vocabulary,
   - Grammar,
   - Translations,
   - Mixed tests,
   - Picture exercises,
   - Audio exercises,
   - Mistake reviews,
   - Exam mode.

4. Two basic modes

   - Learning mode:
     - hints may be used,
     - the program may show explanations,
     - incorrect answers return after a few questions,
     - after correction, a question may be partially credited.

   - Test mode:
     - no hints,
     - optional time limit,
     - scoring is stricter,
     - a report is shown after completion.

5. Review system

   - questions answered incorrectly are added to the review queue,
   - difficult questions return more often,
   - easy questions return less often,
   - implement a simple spaced repetition algorithm,
   - each question has a mastery level from 0 to 5,
   - the mastery level increases after correct answers,
   - the mastery level decreases after incorrect answers.

6. Exercise editor

   - the user can create custom exercise sets,
   - the user can add questions, answers and answer variants,
   - the user can add images,
   - the user can add audio files,
   - the user can assign a difficulty level,
   - the user can assign category, topic, language and exercise type,
   - the user can import/export exercise sets as JSON.

7. Multimedia support

   - support images for picture-based questions,
   - support audio files for pronunciation,
   - button for playing recordings,
   - optional automatic audio playback after displaying a question,
   - images and audio can be local files stored in the application directory or uploaded by the user.

8. Grammar help

   - a separate “Grammar” module with short explanations of grammar topics,
   - ability to link a question to a specific grammar note,
   - in learning mode, the user can click “Explain the rule”,
   - in test mode, this option may be disabled.

────────────────────────────────────
2. TECHNOLOGY
────────────────────────────────────

Propose and implement the application using the following stack:

Frontend:

- React,
- TypeScript,
- Vite,
- Tailwind CSS,
- shadcn/ui or simple custom components,
- responsive layout,
- dark/light theme.

Backend:

- Node.js,
- Express or Fastify,
- TypeScript,
- REST API.

Database:

- MySQL,
- Prisma ORM.

File storage:

- local `uploads/` folder,
- separate subfolders:
  - `uploads/images/`,
  - `uploads/audio/`.

Running the application:

- the application should run locally using `npm install` and `npm run dev`,
- also prepare a Dockerfile and `docker-compose.yml`,
- backend and frontend may be separate services or part of one monorepo.

Project structure:

- use a monorepo:

/neoteacher
  /frontend
  /backend
  /docs
  /sample-data
  docker-compose.yml
  README.md

────────────────────────────────────
3. DATA MODEL
────────────────────────────────────

Design the database with the following entities:

UserProfile:

- id
- name
- nativeLanguage
- targetLanguage
- createdAt
- lastUsedAt

Language:

- id
- code
- name

ExerciseSet:

- id
- title
- description
- targetLanguage
- nativeLanguage
- level
- category
- createdBy
- isBuiltIn
- createdAt
- updatedAt

Exercise:

- id
- exerciseSetId
- type
- questionText
- promptText
- correctAnswers
- acceptableAnswers
- explanation
- grammarNoteId
- imagePath
- audioPath
- difficulty
- tags
- createdAt
- updatedAt

ExerciseType should support:

- multiple_choice
- picture_choice
- text_translation
- sentence_translation
- fill_gap
- transform_sentence
- build_question
- order_words
- match_pairs
- listening
- dictation

AnswerOption:

- id
- exerciseId
- text
- isCorrect
- imagePath
- audioPath
- sortOrder

GrammarNote:

- id
- language
- title
- topic
- contentMarkdown
- examplesJson
- level

UserExerciseProgress:

- id
- userProfileId
- exerciseId
- attempts
- correctAttempts
- wrongAttempts
- masteryLevel
- lastAnswer
- lastAnsweredAt
- nextReviewAt
- easeFactor
- intervalDays

TestSession:

- id
- userProfileId
- mode
- startedAt
- finishedAt
- totalQuestions
- correctAnswers
- scorePercent

TestSessionAnswer:

- id
- testSessionId
- exerciseId
- userAnswer
- isCorrect
- timeSpentSeconds
- usedHint
- answeredAt

Settings:

- id
- userProfileId
- autoPlayAudio
- showHintsInLearningMode
- repeatWrongAnswers
- learningIntensity
- theme

────────────────────────────────────
4. ANSWER CHECKING
────────────────────────────────────

Implement intelligent but simple answer checking.

Requirements:

- ignore letter case,
- ignore extra spaces,
- optionally ignore punctuation,
- allow multiple correct answers,
- allow acceptable answer variants,
- allow optional elements.

Example:

Correct answer:

"I have got a car"

Accepted variants:

"I've got a car"

"I have a car"

"I have got one car"

Design a format for storing answer variants.

You may use, for example:

- a `correctAnswers` array,
- an `acceptableAnswers` array,
- a simple mini-syntax:
  - `[word]` means an optional word,
  - `word1/word2` means an alternative,
  - `(formal)` means a comment ignored by the checker.

Example:

"I have [got] a car"

"I have got a car/I've got a car"

Implement the function:

checkAnswer(userAnswer, exercise): AnswerCheckResult

AnswerCheckResult:

- isCorrect: boolean
- normalizedUserAnswer: string
- matchedAnswer: string | null
- score: number
- feedback: string
- almostCorrect: boolean

Add support for “almost correct” answers:

- if the Levenshtein distance is small,
- if only punctuation is missing,
- if there is a small typo,
- then show the message “Almost correct, check your spelling.”

However, do not accept incorrect translations only because they are textually similar.

────────────────────────────────────
5. EXERCISE TYPES
────────────────────────────────────

Implement frontend components for each exercise type.

1. Multiple choice

   - text question,
   - several answers,
   - one or more correct answers,
   - immediate feedback in learning mode.

2. Picture choice

   - text or audio question,
   - answers shown as images,
   - clicking an image selects the answer.

3. Text translation

   - the user enters the translation of a single word or phrase,
   - answer variants are checked.

4. Sentence translation

   - the user translates a full sentence,
   - answer variants are checked,
   - after an error, the model answer is shown.

5. Fill gap

   - sentence with a gap,
   - the user enters the missing word,
   - support for multiple gaps.

6. Transform sentence

   - for example, change a positive sentence into a question,
   - change Present Simple into Past Simple,
   - change active voice into passive voice.

7. Build question

   - the user builds a question from the provided sentence.

8. Order words

   - the user arranges a sentence from shuffled words,
   - drag & drop or clickable tiles.

9. Match pairs

   - matching pairs:
     - word - translation,
     - image - word,
     - sentence - translation.

10. Listening

   - the user listens to audio and selects an answer.

11. Dictation

   - the user listens to audio and types the sentence they heard.

────────────────────────────────────
6. LEARNING MODE
────────────────────────────────────

Learning mode should work as follows:

- the user selects:
  - language,
  - exercise set,
  - category,
  - exercise type,
  - difficulty level,
  - number of questions.

- the application builds an exercise session,
- questions are selected with preference for:
  - new questions,
  - questions with low masteryLevel,
  - questions due for review,
  - questions recently answered incorrectly.

During the exercise:

- show the question,
- show image/audio if available,
- allow the user to answer,
- check the answer,
- show feedback,
- show explanation,
- show a grammar link if available,
- after an incorrect answer, add the question to the repeat queue in the same session,
- after a few questions, show the incorrect question again.

At the end:

- show the result,
- show incorrect questions,
- show mastered questions,
- show a recommendation:
  - “Review Present Perfect”
  - “Practice vocabulary: travel”
  - “You have 12 questions to review tomorrow.”

────────────────────────────────────
7. TEST MODE
────────────────────────────────────

Test mode should:

- allow scope selection,
- have an optional time limit,
- not show hints,
- not show the result immediately unless the user configures it,
- show a report at the end:
  - percentage score,
  - number of correct answers,
  - number of incorrect answers,
  - time,
  - list of questions and answers,
  - suggested reviews.

TestSession and TestSessionAnswer must be stored in the database.

────────────────────────────────────
8. REVIEW ALGORITHM
────────────────────────────────────

Implement a simple review algorithm.

Each question has:

- masteryLevel from 0 to 5,
- easeFactor,
- intervalDays,
- nextReviewAt.

After a correct answer:

- increase masteryLevel up to a maximum of 5,
- increase intervalDays:
  - mastery 0 → 1 day,
  - mastery 1 → 2 days,
  - mastery 2 → 4 days,
  - mastery 3 → 7 days,
  - mastery 4 → 14 days,
  - mastery 5 → 30 days.

After an incorrect answer:

- decrease masteryLevel,
- set nextReviewAt to today or tomorrow,
- add the question to the “repeat in session” queue.

Learning intensity:

- 1 = easy, the question is credited after one correct answer,
- 2 = standard, the question must be answered correctly 2 times,
- 3 = intensive, the question must be answered correctly 3 times in different sessions.

────────────────────────────────────
9. EXERCISE EDITOR
────────────────────────────────────

Create an admin/content editor module.

Features:

- list exercise sets,
- create an exercise set,
- edit an exercise set,
- delete an exercise set,
- add an exercise,
- preview an exercise,
- test answer checking,
- upload an image,
- upload audio,
- edit alternative answers,
- import JSON,
- export JSON.

The editor should have a convenient form that depends on the exercise type.

For multiple_choice:

- question,
- answers,
- marking correct answers.

For fill_gap:

- sentence with a gap, for example:
  "I ____ to school every day."
- correct answers:
  "go"

For order_words:

- target sentence,
- automatic split into tiles,
- ability to add distractor words.

For match_pairs:

- list of pairs.

For listening/dictation:

- audio upload,
- reference text,
- answer variants.

────────────────────────────────────
10. JSON IMPORT/EXPORT
────────────────────────────────────

Design a readable JSON format for exercise sets.

Example:

{
  "title": "English Basics - Present Simple",
  "description": "Basic Present Simple exercises",
  "targetLanguage": "en",
  "nativeLanguage": "pl",
  "level": "A1",
  "category": "grammar",
  "exercises": [
    {
      "type": "fill_gap",
      "questionText": "Complete the sentence",
      "promptText": "She ____ coffee every morning.",
      "correctAnswers": ["drinks"],
      "acceptableAnswers": ["has"],
      "explanation": "For he/she/it in Present Simple we add -s.",
      "tags": ["present-simple", "verbs"],
      "difficulty": 1
    },
    {
      "type": "sentence_translation",
      "questionText": "Translate into English",
      "promptText": "Ona codziennie pije kawę.",
      "correctAnswers": [
        "She drinks coffee every day.",
        "She has coffee every day."
      ],
      "acceptableAnswers": [
        "She drinks a coffee every day."
      ],
      "explanation": "Present Simple is used for routines."
    }
  ]
}

Add import validation:

- required fields,
- supported exercise types,
- correct answer format,
- import error report.

────────────────────────────────────
11. SAMPLE DATA
────────────────────────────────────

Generate a sample data package for English.

It should include:

- at least 5 exercise sets:
  1. Basic vocabulary: home
  2. Basic vocabulary: travel
  3. Present Simple
  4. Past Simple
  5. Questions and negatives

Each set:

- at least 20 exercises,
- mixed exercise types,
- A1/A2 level,
- Polish instructions,
- English answers,
- sample explanations.

Also add several grammar notes:

- Present Simple,
- Past Simple,
- Articles: a/an/the,
- Questions with do/does/did,
- There is / There are.

────────────────────────────────────
12. UI / UX
────────────────────────────────────

Application style:

- modern, but with a slight retro feel inspired by educational programs from the 1990s,
- readable cards,
- large buttons,
- simple layout,
- minimal distractions,
- light and dark mode.

Application views:

1. Profile selection

   - profile list,
   - add profile,
   - most recently used profile at the top.

2. Dashboard

   - progress,
   - quick actions,
   - today’s reviews,
   - recent results.

3. Exercise library

   - filtering by language,
   - level,
   - category,
   - exercise type,
   - tags.

4. Learning session

   - question,
   - answer,
   - audio/image,
   - feedback,
   - buttons:
     - Check,
     - Hint,
     - Show rule,
     - Next.

5. Session result

   - percentage score,
   - incorrect questions,
   - recommendations,
   - “Repeat mistakes” button.

6. Test mode

   - similar to learning mode, but without hints.

7. Exercise editor

   - CRUD for sets and questions.

8. Grammar

   - topic list,
   - Markdown note view,
   - examples.

9. Statistics

   - charts:
     - accuracy over time,
     - number of exercises per day,
     - strongest topics,
     - weakest topics,
     - questions due for review.

────────────────────────────────────
13. BACKEND API
────────────────────────────────────

Design a REST API.

Example endpoints:

Profiles:

- GET /api/profiles
- POST /api/profiles
- GET /api/profiles/:id
- PATCH /api/profiles/:id
- DELETE /api/profiles/:id

Exercise sets:

- GET /api/exercise-sets
- POST /api/exercise-sets
- GET /api/exercise-sets/:id
- PATCH /api/exercise-sets/:id
- DELETE /api/exercise-sets/:id

Exercises:

- GET /api/exercises
- POST /api/exercises
- GET /api/exercises/:id
- PATCH /api/exercises/:id
- DELETE /api/exercises/:id

Sessions:

- POST /api/sessions/learning/start
- POST /api/sessions/test/start
- POST /api/sessions/:id/answer
- POST /api/sessions/:id/finish
- GET /api/sessions/:id/report

Progress:

- GET /api/profiles/:id/progress
- GET /api/profiles/:id/reviews
- POST /api/profiles/:id/reviews/start

Grammar:

- GET /api/grammar-notes
- POST /api/grammar-notes
- GET /api/grammar-notes/:id
- PATCH /api/grammar-notes/:id
- DELETE /api/grammar-notes/:id

Import/export:

- POST /api/import/exercise-set
- GET /api/export/exercise-set/:id

Uploads:

- POST /api/uploads/image
- POST /api/uploads/audio

────────────────────────────────────
14. SECURITY AND VALIDATION
────────────────────────────────────

Take care of:

- input validation using Zod,
- restricting uploaded file types:
  - images: png, jpg, jpeg, gif, webp,
  - audio: mp3, wav, ogg,
- file size limits,
- safe filename generation,
- no execution of arbitrary code from imported JSON,
- sensible error messages.

────────────────────────────────────
15. TESTS
────────────────────────────────────

Add unit tests for:

- checkAnswer,
- answer normalization,
- handling answer alternatives,
- handling optional words,
- review algorithm,
- JSON import,
- learning session generation.

Use Vitest or Jest.

Add example tests:

1. "I have got a car" accepts:

   - "I have got a car"
   - "I've got a car"
   - "I have a car"

2. "She drinks coffee every day" rejects:

   - "She drink coffee every day"

3. Fill gap:

   - "drinks" is correct,
   - "drink" is incorrect for he/she/it.

────────────────────────────────────
16. DOCUMENTATION
────────────────────────────────────

Generate a README.md with instructions:

- requirements,
- local installation,
- running frontend/backend,
- running with Docker Compose,
- seeding sample data,
- how to create custom exercises,
- how to import/export JSON,
- how the review algorithm works.

Add technical documentation in the `/docs` directory:

- architecture.md
- database-schema.md
- answer-checking.md
- exercise-json-format.md
- development-roadmap.md

────────────────────────────────────
17. EXPECTED WORKFLOW
────────────────────────────────────

Work iteratively.

First generate:

1. project structure,
2. Prisma database schema,
3. basic backend,
4. basic frontend,
5. sample data seed,
6. working learning mode for several exercise types,
7. then the editor,
8. then statistics,
9. then import/export,
10. then Docker.

Do not try to put everything in one file.

The code should be readable, modular and ready for further development.

────────────────────────────────────
18. MINIMAL MVP
────────────────────────────────────

If you need to start with an MVP, implement first:

- user profiles,
- MySQL + Prisma,
- exercise set list,
- sample exercise seed,
- learning mode,
- text answer checking,
- multiple choice,
- fill gap,
- sentence translation,
- user progress,
- repeating incorrect answers,
- simple dashboard.

Only then extend with:

- audio,
- images,
- exercise editor,
- import/export,
- statistics,
- test mode,
- grammar notes.

────────────────────────────────────
19. IMPORTANT QUALITY REQUIREMENTS
────────────────────────────────────

- Do not use mocks where MySQL can be used immediately.
- Do not store progress only in localStorage.
- Do not create only a static frontend.
- Backend, database and frontend must actually work together.
- Every endpoint should have error handling.
- Every form should have validation.
- UI should be simple, fast and convenient.
- The application should be easy to run locally.
- The project should have a sensible README.

────────────────────────────────────
20. FINAL GOAL
────────────────────────────────────

The final result should be a modern equivalent of the classic eTeacher program:

- local/self-hosted,
- multimedia-based,
- multilingual,
- with custom exercise sets,
- with learning mode and test mode,
- with mistake reviews,
- with saved progress,
- with grammar as help,
- with the possibility of further development toward an AI assistant.

Start by generating the project structure and the first working MVP version.