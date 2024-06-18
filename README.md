# LinguaReader: An All-in-One Foreign Language Reading Tool
LinguaReader is designed to cater to the needs of foreign language learners by offering a comprehensive suite of features. From building a personal library to utilizing powerful word lookup tools and incorporating a spaced repetition flashcard system, LinguaReader aims to enhance the language learning experience.

## Navigation and Interface
Upon launching the application, the Navigation drawer on the left provides easy access to various features, each represented by an icon. These icons direct users to different sections of the application, housing a range of functionalities described below.

## Importing Texts
The first core feature revolves around importing texts into the application's Library. By clicking on the 'Import New Text' card within the Library menu, users can seamlessly add new books or reading materials. The application guides users through entering essential details such as title, author, description, language, and contents. Texts can be uploaded manually or through files in formats like .pdf, .epub, .txt, .docx, or .html.

## Word Lookup Tools
The second core feature offers word lookup tools in seven different languages, including English, Chinese, Malay, Japanese, French, Korean, and Italian. These tools encompass e-dictionaries, word lemmatizer (limited to English), machine translation across 28 languages (excluding Korean), 3rd-party dictionary search, and image search. Users can initiate lookup by highlighting text within the Reader.

## Vocabulary Collection
Building upon the previous feature, LinguaReader allows users to mark and save words in their Vocabulary List. Whenever users save a definition or image using the word lookup tools, new vocabulary items are automatically generated. Each item in the vocabulary list is categorized based on the user's familiarity level, offering a comprehensive review flashcard system.

## Spaced Repetition Flashcards
The fourth core feature introduces a spaced repetition flashcard system powered by the SM-2 algorithm. Users are relieved from manual efforts as the algorithm automatically schedules flashcard reviews based on metrics such as interval, repetition count, and ease factor. These metrics adapt based on the user's performance during previous reviews, ensuring efficient and personalized learning.

## Progress Tracker
Finally, LinguaReader provides a progress tracker that visualizes statistical insights on the user's review performance over the last 1 to 3 months. Through charts and metrics, users can assess their review performance, time taken, number of reviews completed, intervals, success rate, and the status of flashcards.

## How to Run
To set up and run LinguaReader:

1. Navigate to the LinguaReader folder in your terminal and run 'npm install' to install dependencies.
2. Within the client folder (lingua-reader/client), run 'npm install' to install client app dependencies.
3. Similarly, navigate to the server folder (lingua-reader/server) and run 'npm install' to install server app dependencies.
4. Activate the Python virtual environment for the server by navigating to the server folder in the terminal and running 'source ./env/bin/activate'.
5. Start the server application by typing 'npm start' in the server folder.
6. Finally, navigate to the client folder and run 'npm start' to launch the client application.