# neoteacher
NeoTeacher – aplikacja do nauki języków obcych inspirowana klasycznymi trenażerami z lat 90. Obsługuje profile uczniów, ćwiczenia, testy, powtórki błędów, statystyki postępów, własne zestawy zadań oraz multimedia. 


---

```markdown
# NeoTeacher Product Specification

## 1. Overview

NeoTeacher is a self-hosted web application for learning foreign languages through interactive exercises, tests, repetition and progress tracking.

The application is inspired by classic multimedia language trainers from the 1990s, especially tools that focused on practical exercises rather than linear courses.

NeoTeacher is not intended to be a full textbook replacement. It is a training environment where learners practice vocabulary, grammar, translations, listening and sentence construction.

The first target language is English, but the system should be designed as multilingual from the beginning.

---

## 2. Product vision

NeoTeacher should become a modern, local-first language training platform with:

- learner profiles,
- exercise libraries,
- learning mode,
- test mode,
- repeated mistakes,
- spaced repetition,
- progress tracking,
- grammar notes,
- multimedia exercises,
- editable exercise sets,
- import/export of content,
- self-hosted deployment.

The application should feel simple, fast and focused. It should avoid unnecessary gamification and instead emphasize repeated, measurable practice.

---

## 3. Target users

### 3.1 Individual learner

A person who wants to practice a foreign language independently.

Needs:

- quick access to exercises,
- visible progress,
- repeat mistakes,
- practice weak areas,
- use custom exercise sets.

### 3.2 Teacher or tutor

A person who prepares exercises for students.

Needs:

- create custom exercise sets,
- edit questions,
- import/export content,
- use images and audio,
- track results per profile.

### 3.3 Parent or home user

A person who wants a local tool for children or family members.

Needs:

- multiple profiles,
- easy interface,
- local data storage,
- no mandatory cloud account.

### 3.4 Self-hosting enthusiast

A technical user who wants to run the application on a home server or small VPS.

Needs:

- Docker support,
- MySQL database,
- local media storage,
- clear documentation.

---

## 4. Core principles

### 4.1 Local-first

The application should work without external cloud services.

Data should be stored locally in MySQL.

Uploaded images and audio should be stored in local folders.

### 4.2 Real learning logic

The application must not be only a static quiz UI.

It must track:

- attempts,
- correct answers,
- wrong answers,
- mastery level,
- next review date,
- test sessions,
- learning history.

### 4.3 Editable content

Users should be able to create and modify their own exercise sets.

Built-in content is useful, but custom content is a core feature.

### 4.4 Simple multimedia

NeoTeacher should support images and audio, but the application should still work without them.

Multimedia should improve exercises, not complicate the core workflow.

### 4.5 Clear feedback

The learner should always understand:

- whether the answer was correct,
- what the correct answer was,
- why the answer was wrong,
- what should be repeated.

---

## 5. Functional scope

## 5.1 User profiles

The application should support multiple learner profiles.

Each profile has:

- name,
- native language,
- target language,
- settings,
- progress,
- test history,
- review queue.

The user should choose a profile when opening the application.

A profile is not necessarily an online account. For MVP, local profiles are enough.

---

## 5.2 Dashboard

The dashboard should show:

- current learner profile,
- recent activity,
- number of completed exercises,
- accuracy percentage,
- due reviews,
- weak topics,
- quick action to continue learning,
- quick action to repeat mistakes,
- quick action to start a test.

The dashboard should help the learner decide what to do next.

---

## 5.3 Exercise library

The exercise library should allow browsing and filtering exercise sets.

Filters:

- language,
- level,
- category,
- topic,
- exercise type,
- tags,
- built-in/custom.

Each exercise set should show:

- title,
- description,
- target language,
- native language,
- level,
- category,
- number of exercises,
- last practiced date,
- average mastery.

---

## 5.4 Exercise sets

An exercise set is a group of related exercises.

Examples:

- Basic vocabulary: home,
- Basic vocabulary: travel,
- Present Simple,
- Past Simple,
- Questions and negatives.

Each set should contain metadata:

- title,
- description,
- target language,
- native language,
- level,
- category,
- tags,
- author/creator,
- created date,
- updated date.

---

## 5.5 Exercise types

NeoTeacher should eventually support the following exercise types.

### 5.5.1 Multiple choice

The learner chooses one or more correct answers from a list.

Used for:

- vocabulary,
- grammar,
- listening comprehension,
- translation recognition.

### 5.5.2 Picture choice

The learner chooses an image matching a word, phrase or audio prompt.

Used for:

- vocabulary,
- beginner exercises,
- visual association.

### 5.5.3 Text translation

The learner translates a word or short phrase.

Used for:

- vocabulary,
- idioms,
- collocations.

### 5.5.4 Sentence translation

The learner translates a full sentence.

Used for:

- grammar,
- word order,
- practical usage.

### 5.5.5 Fill gap

The learner fills one or more missing words in a sentence.

Used for:

- verb forms,
- articles,
- prepositions,
- grammar structures.

### 5.5.6 Transform sentence

The learner transforms a sentence according to an instruction.

Examples:

- change positive sentence into question,
- change present tense to past tense,
- change active voice to passive voice.

### 5.5.7 Build question

The learner builds a question from a statement or prompt.

Used for:

- auxiliary verbs,
- word order,
- question formation.

### 5.5.8 Order words

The learner orders shuffled words into a correct sentence.

Used for:

- syntax,
- word order,
- sentence construction.

### 5.5.9 Match pairs

The learner connects matching items.

Examples:

- word and translation,
- image and word,
- sentence and translation.

### 5.5.10 Listening

The learner listens to audio and chooses or writes an answer.

Used for:

- listening comprehension,
- pronunciation recognition.

### 5.5.11 Dictation

The learner listens to audio and types what was heard.

Used for:

- spelling,
- listening accuracy,
- sentence recognition.

---

## 5.6 Learning mode

Learning mode is the main practice mode.

It should be friendly and interactive.

Features:

- hints allowed,
- immediate feedback,
- explanations visible,
- grammar help available,
- wrong answers repeated,
- progress updated after every answer.

The learner should be able to choose:

- exercise set,
- category,
- level,
- exercise type,
- number of questions,
- whether to include due reviews,
- whether to repeat mistakes.

Learning mode should prefer:

- new exercises,
- weak exercises,
- due reviews,
- recently failed exercises.

At the end of a learning session, the learner should see:

- score,
- number of correct answers,
- number of wrong answers,
- repeated mistakes,
- improved items,
- recommended next topic.

---

## 5.7 Test mode

Test mode is stricter than learning mode.

Features:

- hints disabled,
- optional time limit,
- no immediate explanations by default,
- final report after completion,
- answers stored in test history.

The final report should include:

- score percentage,
- correct answers,
- wrong answers,
- skipped questions,
- time spent,
- list of answers,
- recommended reviews.

Test mode should be useful for measuring knowledge, not only practicing.

---

## 5.8 Repetition system

NeoTeacher should include a simple spaced repetition system.

Each exercise has profile-specific progress:

- attempts,
- correct attempts,
- wrong attempts,
- mastery level,
- last answer,
- last answered date,
- next review date,
- interval in days,
- ease factor.

Mastery level range:

```text
0 = unknown
1 = weak
2 = familiar
3 = improving
4 = strong
5 = mastered