Chcę zbudować od zera aplikację do nauki języków obcych inspirowaną klasycznym programem eTeacher z lat 90., ale w nowoczesnej formie.

Napisz kompletną aplikację webową typu single-page app z backendem i bazą danych. Aplikacja ma działać lokalnie lub self-hosted, bez konieczności korzystania z usług chmurowych. Celem jest stworzenie multimedialnego trenażera językowego, a nie pełnego kursu „lekcja po lekcji”.

Najważniejsza idea programu:
- użytkownik ćwiczy słownictwo, gramatykę, tłumaczenia i rozumienie zdań,
- program sprawdza odpowiedzi,
- zapamiętuje wyniki,
- powtarza błędne lub słabo opanowane pytania,
- pozwala tworzyć własne ćwiczenia,
- obsługuje różne języki, początkowo angielski,
- działa jak lokalne „laboratorium ćwiczeń językowych”.

Nazwa aplikacji: NeoTeacher.

────────────────────────────────────
1. GŁÓWNE ZAŁOŻENIA
────────────────────────────────────

Aplikacja ma zawierać:

1. System użytkowników/profili ucznia
   - użytkownik wybiera istniejący profil lub tworzy nowy,
   - każdy profil ma osobne postępy, ustawienia i statystyki,
   - nie musi być pełnego systemu logowania online; wystarczy lokalny system profili,
   - opcjonalnie można dodać prosty login/hasło.

2. Panel główny ucznia
   - widok ostatnich ćwiczeń,
   - poziom zaawansowania,
   - liczba wykonanych ćwiczeń,
   - procent poprawnych odpowiedzi,
   - lista tematów do powtórki,
   - szybki przycisk „Kontynuuj naukę”,
   - szybki przycisk „Powtórz błędy”.

3. Moduły nauki:
   - Słownictwo,
   - Gramatyka,
   - Tłumaczenia,
   - Testy mieszane,
   - Ćwiczenia obrazkowe,
   - Ćwiczenia audio,
   - Powtórki błędów,
   - Tryb egzaminacyjny.

4. Dwa podstawowe tryby:
   - Tryb nauki:
     - można używać podpowiedzi,
     - program może pokazywać wyjaśnienia,
     - błędne odpowiedzi wracają po kilku pytaniach,
     - po poprawce pytanie może zostać częściowo zaliczone.
   - Tryb testu:
     - brak podpowiedzi,
     - ograniczony czas opcjonalnie,
     - wynik liczony bardziej rygorystycznie,
     - po zakończeniu pokazuje raport.

5. System powtórek:
   - pytania, na które użytkownik odpowiedział źle, trafiają do kolejki powtórek,
   - pytania trudne wracają częściej,
   - pytania łatwe wracają rzadziej,
   - zaimplementuj prosty algorytm spaced repetition,
   - każde pytanie ma poziom opanowania od 0 do 5,
   - poziom rośnie po poprawnych odpowiedziach,
   - poziom spada po błędnych odpowiedziach.

6. Edytor ćwiczeń:
   - użytkownik może tworzyć własne zestawy ćwiczeń,
   - może dodawać pytania, odpowiedzi, warianty odpowiedzi,
   - może dodawać obrazki,
   - może dodawać pliki audio,
   - może oznaczać poziom trudności,
   - może przypisać kategorię, temat, język i typ ćwiczenia,
   - może importować/exportować zestawy ćwiczeń jako JSON.

7. Multimedialność:
   - obsługa obrazków dla pytań obrazkowych,
   - obsługa plików audio dla wymowy,
   - przycisk odtworzenia nagrania,
   - możliwość automatycznego odtworzenia audio po wyświetleniu pytania,
   - obrazki i audio mogą być lokalnymi plikami przechowywanymi w katalogu aplikacji lub jako upload.

8. Pomoc gramatyczna:
   - osobny moduł „Gramatyka” z krótkimi opisami zagadnień,
   - możliwość powiązania pytania z konkretną notatką gramatyczną,
   - w trybie nauki można kliknąć „Wyjaśnij regułę”,
   - w trybie testu ta opcja może być wyłączona.

────────────────────────────────────
2. TECHNOLOGIA
────────────────────────────────────

Zaproponuj i zaimplementuj aplikację w następującym stacku:

Frontend:
- React,
- TypeScript,
- Vite,
- Tailwind CSS,
- shadcn/ui lub własne proste komponenty,
- responsywny layout,
- ciemny/jasny motyw.

Backend:
- Node.js,
- Express lub Fastify,
- TypeScript,
- REST API.

Baza danych:
- MySQL,
- Prisma ORM.

Przechowywanie plików:
- lokalny folder `uploads/`,
- osobne podfoldery:
  - `uploads/images/`,
  - `uploads/audio/`.

Uruchamianie:
- aplikacja ma działać lokalnie przez `npm install` i `npm run dev`,
- przygotuj też Dockerfile i docker-compose.yml,
- backend i frontend mogą być osobnymi usługami albo jednym monorepo.

Struktura projektu:
- użyj monorepo:

/neoteacher
  /frontend
  /backend
  /docs
  /sample-data
  docker-compose.yml
  README.md

────────────────────────────────────
3. MODEL DANYCH
────────────────────────────────────

Zaprojektuj bazę danych z następującymi encjami:

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

ExerciseType powinien obsługiwać:
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
4. SPRAWDZANIE ODPOWIEDZI
────────────────────────────────────

Zaimplementuj inteligentne, ale proste sprawdzanie odpowiedzi.

Wymagania:
- ignorowanie wielkości liter,
- ignorowanie nadmiarowych spacji,
- opcjonalne ignorowanie interpunkcji,
- możliwość wielu poprawnych odpowiedzi,
- możliwość akceptowalnych wariantów odpowiedzi,
- możliwość oznaczenia elementów opcjonalnych.

Przykład:
Poprawna odpowiedź:
"I have got a car"

Akceptowane warianty:
"I've got a car"
"I have a car"
"I have got one car"

Zaprojektuj format zapisu wariantów odpowiedzi.

Możesz użyć na przykład:
- tablicy `correctAnswers`,
- tablicy `acceptableAnswers`,
- prostego mini-syntaxu:
  - `[word]` oznacza słowo opcjonalne,
  - `word1/word2` oznacza alternatywę,
  - `(formal)` jako komentarz ignorowany przez sprawdzarkę.

Przykład:
"I have [got] a car"
"I have got a car/I've got a car"

Zaimplementuj funkcję:

checkAnswer(userAnswer, exercise): AnswerCheckResult

AnswerCheckResult:
- isCorrect: boolean
- normalizedUserAnswer: string
- matchedAnswer: string | null
- score: number
- feedback: string
- almostCorrect: boolean

Dodaj obsługę odpowiedzi „prawie poprawnej”:
- jeżeli różnica Levenshteina jest niewielka,
- jeżeli brakuje tylko interpunkcji,
- jeżeli literówka jest mała,
- wtedy pokaż komunikat „Prawie dobrze, sprawdź pisownię”.

Nie akceptuj jednak błędnych tłumaczeń tylko dlatego, że są podobne znakowo.

────────────────────────────────────
5. RODZAJE ĆWICZEŃ
────────────────────────────────────

Zaimplementuj komponenty frontendowe dla każdego typu ćwiczeń.

1. Multiple choice
   - pytanie tekstowe,
   - kilka odpowiedzi,
   - jedna lub wiele poprawnych,
   - natychmiastowy feedback w trybie nauki.

2. Picture choice
   - pytanie tekstowe lub audio,
   - odpowiedzi jako obrazki,
   - kliknięcie obrazka wybiera odpowiedź.

3. Text translation
   - użytkownik wpisuje tłumaczenie pojedynczego słowa lub frazy,
   - sprawdzane są warianty.

4. Sentence translation
   - użytkownik tłumaczy całe zdanie,
   - sprawdzane są warianty,
   - po błędzie pokazuje się wzorcowa odpowiedź.

5. Fill gap
   - zdanie z luką,
   - użytkownik wpisuje brakujące słowo,
   - możliwość kilku luk.

6. Transform sentence
   - np. zamień zdanie twierdzące na pytanie,
   - zamień czas Present Simple na Past Simple,
   - zamień stronę czynną na bierną.

7. Build question
   - z podanego zdania użytkownik układa pytanie.

8. Order words
   - użytkownik układa zdanie z rozsypanych słów,
   - drag & drop albo klikane kafelki.

9. Match pairs
   - łączenie par:
     - słowo - tłumaczenie,
     - obrazek - słowo,
     - zdanie - tłumaczenie.

10. Listening
   - użytkownik słucha audio i wybiera odpowiedź.

11. Dictation
   - użytkownik słucha audio i wpisuje usłyszane zdanie.

────────────────────────────────────
6. TRYB NAUKI
────────────────────────────────────

Tryb nauki powinien działać tak:

- użytkownik wybiera:
  - język,
  - zestaw ćwiczeń,
  - kategorię,
  - typ ćwiczenia,
  - poziom trudności,
  - liczbę pytań.

- aplikacja buduje sesję ćwiczeń,
- pytania są losowane z preferencją:
  - nowych pytań,
  - pytań z niskim masteryLevel,
  - pytań po terminie powtórki,
  - pytań ostatnio błędnych.

W trakcie ćwiczenia:
- pokaż pytanie,
- pokaż obrazek/audio, jeśli istnieje,
- pozwól odpowiedzieć,
- sprawdź odpowiedź,
- pokaż feedback,
- pokaż wyjaśnienie,
- pokaż link do gramatyki, jeśli istnieje,
- przy błędzie dodaj pytanie do kolejki powtórki w tej samej sesji,
- po kilku pytaniach pokaż błędne pytanie ponownie.

Na końcu:
- pokaż wynik,
- pokaż pytania błędne,
- pokaż pytania opanowane,
- pokaż rekomendację:
  - „Powtórz czas Present Perfect”
  - „Poćwicz słownictwo: podróże”
  - „Masz 12 pytań do powtórki jutro”.

────────────────────────────────────
7. TRYB TESTU
────────────────────────────────────

Tryb testu powinien:

- umożliwiać wybór zakresu,
- mieć opcjonalny limit czasu,
- nie pokazywać podpowiedzi,
- nie pokazywać wyniku natychmiast, chyba że użytkownik tak ustawi,
- na końcu pokazywać raport:
  - wynik procentowy,
  - liczba poprawnych,
  - liczba błędnych,
  - czas,
  - lista pytań i odpowiedzi,
  - sugerowane powtórki.

TestSession i TestSessionAnswer muszą być zapisane w bazie.

────────────────────────────────────
8. ALGORYTM POWTÓREK
────────────────────────────────────

Zaimplementuj prosty algorytm powtórek.

Każde pytanie ma:
- masteryLevel od 0 do 5,
- easeFactor,
- intervalDays,
- nextReviewAt.

Po poprawnej odpowiedzi:
- zwiększ masteryLevel maksymalnie do 5,
- zwiększ intervalDays:
  - mastery 0 → 1 dzień,
  - mastery 1 → 2 dni,
  - mastery 2 → 4 dni,
  - mastery 3 → 7 dni,
  - mastery 4 → 14 dni,
  - mastery 5 → 30 dni.

Po błędnej odpowiedzi:
- zmniejsz masteryLevel,
- ustaw nextReviewAt na dzisiaj albo jutro,
- dodaj pytanie do kolejki „repeat in session”.

Learning intensity:
- 1 = łagodnie, pytanie zaliczone po jednej dobrej odpowiedzi,
- 2 = standard, pytanie musi być poprawne 2 razy,
- 3 = intensywnie, pytanie musi być poprawne 3 razy w różnych sesjach.

────────────────────────────────────
9. EDYTOR ĆWICZEŃ
────────────────────────────────────

Stwórz moduł administracyjny / edytor treści.

Funkcje:
- lista zestawów ćwiczeń,
- tworzenie zestawu,
- edycja zestawu,
- usuwanie zestawu,
- dodawanie ćwiczenia,
- podgląd ćwiczenia,
- testowe sprawdzenie odpowiedzi,
- upload obrazka,
- upload audio,
- edycja odpowiedzi alternatywnych,
- import JSON,
- export JSON.

Edytor powinien mieć wygodny formularz zależny od typu ćwiczenia.

Dla multiple_choice:
- pytanie,
- odpowiedzi,
- oznaczenie poprawnych.

Dla fill_gap:
- zdanie z luką, np.:
  "I ____ to school every day."
- poprawne odpowiedzi:
  "go"

Dla order_words:
- zdanie docelowe,
- automatyczne rozbicie na kafelki,
- możliwość dodania fałszywych słów.

Dla match_pairs:
- lista par.

Dla listening/dictation:
- upload audio,
- tekst referencyjny,
- warianty odpowiedzi.

────────────────────────────────────
10. IMPORT/EXPORT JSON
────────────────────────────────────

Zaprojektuj czytelny format JSON dla zestawów ćwiczeń.

Przykład:

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

Dodaj walidację importu:
- wymagane pola,
- obsługiwane typy ćwiczeń,
- poprawny format odpowiedzi,
- raport błędów importu.

────────────────────────────────────
11. PRZYKŁADOWE DANE
────────────────────────────────────

Wygeneruj przykładowy pakiet danych dla języka angielskiego.

Ma zawierać:
- minimum 5 zestawów ćwiczeń:
  1. Basic vocabulary: home
  2. Basic vocabulary: travel
  3. Present Simple
  4. Past Simple
  5. Questions and negatives

Każdy zestaw:
- minimum 20 ćwiczeń,
- mieszane typy ćwiczeń,
- poziom A1/A2,
- polskie polecenia,
- angielskie odpowiedzi,
- przykładowe wyjaśnienia.

Dodaj też kilka notatek gramatycznych:
- Present Simple,
- Past Simple,
- Articles: a/an/the,
- Questions with do/does/did,
- There is / There are.

────────────────────────────────────
12. UI / UX
────────────────────────────────────

Styl aplikacji:
- nowoczesny, ale z lekkim retro-klimatem edukacyjnych programów z lat 90.,
- czytelne karty,
- duże przyciski,
- prosty layout,
- mało rozpraszaczy,
- tryb jasny i ciemny.

Widoki aplikacji:

1. Wybór profilu
   - lista profili,
   - dodaj profil,
   - ostatnio używany profil na górze.

2. Dashboard
   - postęp,
   - szybkie akcje,
   - dzisiejsze powtórki,
   - ostatnie wyniki.

3. Biblioteka ćwiczeń
   - filtrowanie po języku,
   - poziomie,
   - kategorii,
   - typie ćwiczenia,
   - tagach.

4. Sesja nauki
   - pytanie,
   - odpowiedź,
   - audio/obrazek,
   - feedback,
   - przyciski:
     - Sprawdź,
     - Podpowiedź,
     - Pokaż regułę,
     - Następne.

5. Wynik sesji
   - wynik procentowy,
   - pytania błędne,
   - rekomendacje,
   - przycisk „Powtórz błędy”.

6. Tryb testu
   - podobny do trybu nauki, ale bez podpowiedzi.

7. Edytor ćwiczeń
   - CRUD zestawów i pytań.

8. Gramatyka
   - lista tematów,
   - widok notatki Markdown,
   - przykłady.

9. Statystyki
   - wykresy:
     - poprawność w czasie,
     - liczba ćwiczeń dziennie,
     - najmocniejsze tematy,
     - najsłabsze tematy,
     - pytania do powtórki.

────────────────────────────────────
13. API BACKENDU
────────────────────────────────────

Zaprojektuj REST API.

Endpointy przykładowe:

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
14. BEZPIECZEŃSTWO I WALIDACJA
────────────────────────────────────

Zadbaj o:
- walidację danych wejściowych przy pomocy Zod,
- ograniczenie typów uploadowanych plików:
  - obrazki: png, jpg, jpeg, gif, webp,
  - audio: mp3, wav, ogg,
- limit wielkości pliku,
- bezpieczne generowanie nazw plików,
- brak wykonywania dowolnego kodu z importowanego JSON,
- sensowne komunikaty błędów.

────────────────────────────────────
15. TESTY
────────────────────────────────────

Dodaj testy jednostkowe dla:

- checkAnswer,
- normalizacji odpowiedzi,
- obsługi alternatywnych odpowiedzi,
- obsługi słów opcjonalnych,
- algorytmu powtórek,
- importu JSON,
- generowania sesji nauki.

Użyj Vitest albo Jest.

Dodaj przykładowe testy:

1. "I have got a car" akceptuje:
   - "I have got a car"
   - "I've got a car"
   - "I have a car"

2. "She drinks coffee every day" odrzuca:
   - "She drink coffee every day"

3. Fill gap:
   - "drinks" poprawne,
   - "drink" błędne dla he/she/it.

────────────────────────────────────
16. DOKUMENTACJA
────────────────────────────────────

Wygeneruj README.md z instrukcją:

- wymagania,
- instalacja lokalna,
- uruchomienie frontend/backend,
- uruchomienie przez Docker Compose,
- seedowanie przykładowych danych,
- jak tworzyć własne ćwiczenia,
- jak importować/exportować JSON,
- jak działa algorytm powtórek.

Dodaj dokumentację techniczną w katalogu `/docs`:

- architecture.md
- database-schema.md
- answer-checking.md
- exercise-json-format.md
- development-roadmap.md

────────────────────────────────────
17. OCZEKIWANY SPOSÓB PRACY
────────────────────────────────────

Pracuj iteracyjnie.

Najpierw wygeneruj:
1. strukturę projektu,
2. schemat bazy Prisma,
3. podstawowy backend,
4. podstawowy frontend,
5. seed przykładowych danych,
6. działający tryb nauki dla kilku typów ćwiczeń,
7. potem edytor,
8. potem statystyki,
9. potem import/export,
10. potem Docker.

Nie próbuj robić wszystkiego w jednym pliku.

Kod ma być czytelny, modularny i gotowy do dalszego rozwijania.

────────────────────────────────────
18. MINIMALNY MVP
────────────────────────────────────

Jeśli trzeba zacząć od MVP, zaimplementuj najpierw:

- profile użytkowników,
- MySQL + Prisma,
- lista zestawów ćwiczeń,
- seed przykładowych ćwiczeń,
- tryb nauki,
- sprawdzanie odpowiedzi tekstowych,
- multiple choice,
- fill gap,
- sentence translation,
- progress użytkownika,
- powtarzanie błędnych odpowiedzi,
- prosty dashboard.

Dopiero potem rozszerzaj o:
- audio,
- obrazki,
- edytor ćwiczeń,
- import/export,
- statystyki,
- tryb testu,
- notatki gramatyczne.

────────────────────────────────────
19. WAŻNE WYMAGANIA JAKOŚCIOWE
────────────────────────────────────

- Nie używaj mocków tam, gdzie można od razu użyć MySQL.
- Nie zapisuj postępów tylko w localStorage.
- Nie twórz wyłącznie statycznego frontendu.
- Backend, baza i frontend mają realnie działać razem.
- Każdy endpoint powinien mieć obsługę błędów.
- Każdy formularz powinien mieć walidację.
- UI ma być prosty, szybki i wygodny.
- Aplikacja ma być łatwa do uruchomienia lokalnie.
- Projekt ma mieć sensowny README.

────────────────────────────────────
20. FINALNY CEL
────────────────────────────────────

Końcowy efekt ma być nowoczesnym odpowiednikiem klasycznego programu eTeacher:

- lokalny/self-hosted,
- multimedialny,
- wielojęzyczny,
- z własnymi zestawami ćwiczeń,
- z trybem nauki i testu,
- z powtórkami błędów,
- z zapisem postępów,
- z gramatyką jako pomocą,
- z możliwością dalszego rozwoju w kierunku AI-asystenta.

Rozpocznij od wygenerowania struktury projektu i pierwszej działającej wersji MVP.