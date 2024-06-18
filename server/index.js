import express from "express"
import mysql from "mysql";
import cors from "cors";
import * as deepl from 'deepl-node';
import {createClient} from 'pexels';
import {python} from "pythonia";
import {parseEpub} from '@gxl/epub-parser'
import fileUpload from 'express-fileupload';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import fs, {promises as fsAsync} from 'fs';

function loadConfig() {
    const configPath = './config.json';
    const configData = fs.readFileSync(configPath);
    return JSON.parse(configData);
}

const app = express();
const config = loadConfig();
const TRANSLATION_KEY = config.deepl;
const IMAGES_KEY = config.pexels;

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "P@ssw0rd1234",
    database: "wiktionary_en"
})

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
// app.use(express.json())
app.use(cors());
app.use(fileUpload());


const stanza = await python('stanza')
const pdf2docx = await python('pdf2docx')
await stanza.download('en')
const nlp = await stanza.Pipeline$({lang: 'en', processors: 'tokenize,pos,lemma'});

app.get("/lemmatize/:words/:sentence", async (req, res) => {
    const text = req.params.sentence;
    let highlighted = req.params.words;
    const doc = await nlp(text);
    const sentences = await doc.sentences;
    for await (let sentence of sentences) {
        for await (let word of await sentence.words) {
            for await (let i of highlighted.split(' ')) {
                if(i === await word.text) {
                    highlighted = highlighted.replaceAll(i, await word.lemma);
                }
            }
        }
    }
    res.send(highlighted);
})

async function basicPDFParse1(file) {
    try {
        const result = await pdfParse(file);
        return result.text.replaceAll("\n", "")
    } catch(err) {
        return err
    }
}

app.get("/dict", (req, res) => {
    const q = "SELECT * FROM dictionary"
    db.query(q, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})

//TODO: GET BY LANGUAGE
app.get("/dict/:word/:lang", (req, res) => {
    const words = req.params.word;
    const language = req.params.lang;
    const q = "SELECT * FROM dictionary WHERE word = ? AND lang = ?";
    db.query(q, [words, language], (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.get("/translate/:text/:lang", (req, res) => {
    const translator = new deepl.Translator(TRANSLATION_KEY);
    const text = req.params.text;
    const lang = req.params.lang;

    (async () => {
        const result = await translator.translateText(text, null, lang);
        res.send(result.text);
    })();
})

app.get("/images/:search", async (req, res) => {
    // const client = createClient('563492ad6f91700001000001cacd2a32bf954375bdc192dc6d56e12e');
    const client = createClient(IMAGES_KEY);
    const query = req.params.search;

    const result = await client.photos.search({ query, per_page: 12 });
    res.send(result.photos);
})

app.get("/books/:lang", async(req, res) => {
    const language = req.params.lang
    const q = "SELECT * FROM book WHERE lang = ?";
    db.query(q, [language], (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.get("/sections/:bookId", async(req, res) => {
    const q = "SELECT * FROM book_section WHERE book_id IN (?)";
    const values = [req.params.bookId];
    db.query(q, [values], (err, data) => {
        if(err) return res.json(err);
        return res.send(data);
    })
})

app.get("/text/:sectionId", async(req, res) => {
    const q = "SELECT * FROM sentences WHERE section_id = ?";
    const secId = req.params.sectionId;
    db.query(q, [secId], (err, data) => {
        if(err) return res.json(err);
        return res.send(data.map(sentence => sentence['sentence']))
    })
})

//TODO: GET BY LANGUAGE AS WELL
app.get("/audio/:word/:lang", async(req, res) => {
    const q = "SELECT * FROM audio WHERE word = ? AND lang = ?";
    const target = req.params.word;
    const language = req.params.lang;
    db.query(q, [target, language], (err, data) => {
        if(err) return res.json(err);
        return res.send(data)
    })
})

app.get("/find-flashcard/:word/:lang", (req, res) => {
    const q = "SELECT flashcard_id FROM flashcard_main WHERE flashcard_word = ? AND flashcard_lang = ? LIMIT 1";
    const target = req.params.word;
    const language = req.params.lang;
    db.query(q, [target, language], (err, data) => {
        if(err) return res.json(err);
        return res.send(data);
    })
})

app.get("/get-flashcard-defs/:id", (req, res) => {
    const q = "SELECT flashcard_def FROM flashcard_definitions WHERE flashcard_id = ?";
    const target = req.params.id;
    db.query(q, [target], (err, data) => {
        if(err) return res.json(err);
        return res.send(data);
    })
})

app.get("/get-flashcard-imgs/:id", (req, res) => {
    const q = "SELECT flashcard_image FROM flashcard_images WHERE flashcard_id = ?";
    const target = req.params.id;
    db.query(q, [target], (err, data) => {
        if(err) return res.json(err);
        return res.send(data);
    })
})

app.get("/all-learning-words/:lang", (req, res) => {
    const language = req.params.lang;
    const q = "SELECT flashcard_word FROM flashcard_main WHERE flashcard_lang = ?";
    db.query(q, [language], (err, data) => {
        if(err) return res.json(err);
        return res.send(data);
    })
})

app.get("/all-learning", (req, res) => {
    const q = "SELECT fm.flashcard_id, fm.flashcard_word, fm.flashcard_lemma, fm.flashcard_context, fm.flashcard_lang, fm.status, fd.flashcard_def, fd.flashcard_pos FROM flashcard_main fm LEFT JOIN flashcard_definitions fd ON fm.flashcard_id = fd.flashcard_id ORDER BY fm.flashcard_id ASC";
    db.query(q, (err, data) => {
        if(err) return res.json(err);
        return res.send(data);
    })
})

app.get("/all-flashcard-imgs", (req, res) => {
    const q = "SELECT * FROM flashcard_main fm INNER JOIN flashcard_images fi ON fm.flashcard_id = fi.flashcard_id ORDER BY fm.flashcard_id ASC";
    db.query(q, (err, data) => {
        if(err) return res.json(err);
        return res.send(data);
    })
})

app.get("/due-reviews", (req, res) => {
    const q = "SELECT * FROM review r INNER JOIN flashcard_main fm ON fm.flashcard_id = r.flashcard_id WHERE r.review_due <= (SELECT CONVERT_TZ(NOW(), '+00:00', '-08:00')) AND r.review_quality IS NULL AND r.review_completed IS NULL ORDER BY r.review_due ASC";
    db.query(q, (err, data) => {
        if(err) return res.json(err);
        return res.send(data);
    })
})

app.get("/due-images", (req, res) => {
    const values = req.query.values;
    const q = "SELECT * FROM flashcard_images fi WHERE fi.flashcard_id IN (?)";
    db.query(q, [values], (err, data) => {
        if(err) return res.json(err);
        return res.send(data);
    })
})

app.get("/due-definitions", (req, res) => {
    const values = req.query.values;
    const q = "SELECT * FROM flashcard_definitions fd WHERE fd.flashcard_id IN (?)";
    db.query(q, [values], (err, data) => {
        if(err) return res.json(err);
        return res.send(data);
    })
})

app.get("/answer-buttons", (req, res) => {
    const q = "SELECT r.status, r.review_quality, COUNT(*) as num_rows FROM review r WHERE r.review_quality IS NOT NULL GROUP BY r.status, r.review_quality"
    db.query(q, (err, data) => {
        if(err) return res.json(err);
        return res.send(data);
    })
})

app.get("/review-time/:duration", (req, res) => {
    const days = req.params.duration;
    const q = "SELECT DATEDIFF(NOW(), DATE(r.review_completed)) AS `interval`, r.status, SUM(r.time_taken) / 60 AS minutes FROM review r WHERE r.review_completed >= DATE_SUB(NOW(), INTERVAL ? DAY) GROUP BY DATEDIFF(NOW(), DATE(r.review_completed)), r.status"
    db.query(q, [[days]], (err, data) => {
        if(err) return res.json(err);
        return res.send(data);
    })
})

app.get("/review-count/:duration", (req, res) => {
    const days = req.params.duration;
    const q = "SELECT DATEDIFF(NOW(), DATE(r.review_completed)) AS `interval`, r.status, COUNT(r.review_quality) AS sum FROM review r WHERE r.review_completed >= DATE_SUB(NOW(), INTERVAL ? DAY) AND r.review_quality IS NOT NULL GROUP BY DATEDIFF(NOW(), DATE(r.review_completed)), r.status"
    db.query(q, [[days]], (err, data) => {
        if(err) return res.json(err);
        return res.send(data);
    })
})

app.get("/intervals/:duration", (req, res) => {
    const days = req.params.duration;
    const q = "SELECT r.`interval`, COUNT(*) AS num_reviews FROM review r WHERE r.`interval` <= ? GROUP BY r.`interval`"
    db.query(q, [[days]], (err, data) => {
        if(err) return res.json(err);
        return res.send(data);
    })
})

app.get("/hourly-breakdown", (req, res) => {
    const q = "SELECT HOUR(CONVERT_TZ(r.review_completed, '+00:00', '+08:00')) AS hour, SUM(CASE WHEN r.review_quality >= 3 THEN 1 ELSE 0 END) / COUNT(*) * 100 AS percentage FROM review r WHERE r.review_quality IS NOT NULL GROUP BY HOUR(CONVERT_TZ(r.review_completed, '+00:00', '+08:00')) "
    db.query(q, (err, data) => {
        if(err) return res.json(err);
        return res.send(data);
    })
})

app.get("/card-count", (req, res) => {
    const q = "SELECT fm.status AS name, COUNT(fm.status) AS num_cards FROM flashcard_main fm GROUP BY fm.status"
    db.query(q, (err, data) => {
        if(err) return res.json(err);
        return res.send(data);
    })
})

app.get("/total-minutes/:duration", (req, res) => {
    const days = req.params.duration;
    const q = "SELECT SUM(r.time_taken) / 60 AS minutes FROM review r WHERE r.review_completed >= DATE_SUB(NOW(), INTERVAL ? DAY)"
    db.query(q, [[days]], (err, data) => {
        if(err) return res.json(err);
        return res.send(data);
    })
})

app.get("/total-days/:duration", (req, res) => {
    const days = req.params.duration;
    const q = "SELECT COUNT(DISTINCT DATE(r.review_completed)) as days FROM review r WHERE r.review_completed >= DATE_SUB(NOW(), INTERVAL ? DAY)"
    db.query(q, [[days]], (err, data) => {
        if(err) return res.json(err);
        return res.send(data);
    })
})

app.get("/total-reviews/:duration", (req, res) => {
    const days = req.params.duration;
    const q = "SELECT COUNT(r.review_quality) AS reviews FROM review r WHERE r.review_completed >= DATE_SUB(NOW(), INTERVAL ? DAY)"
    db.query(q, [[days]], (err, data) => {
        if(err) return res.json(err);
        return res.send(data);
    })
})

app.get("/average-interval", (req, res) => {
    const q = "SELECT AVG(r.`interval`) AS `interval` FROM review r WHERE r.review_quality IS NULL"
    db.query(q, (err, data) => {
        if(err) return res.json(err);
        return res.send(data);
    })
})

app.get("/max-interval", (req, res) => {
    const q = "SELECT MAX(r.`interval`) AS `max_interval` FROM review r WHERE r.review_quality IS NULL"
    db.query(q, (err, data) => {
        if(err) return res.json(err);
        return res.send(data);
    })
})

app.get("/correct-buttons", (req, res) => {
    const q = "SELECT r.status, COUNT(CASE WHEN r.review_quality >= 3 THEN 1 END) AS num_correct, COUNT(*) AS num_rows FROM review r WHERE r.review_quality IS NOT NULL GROUP BY r.status"
    db.query(q, (err, data) => {
        if(err) return res.json(err);
        return res.send(data);
    })
})

app.get("/reader-flashcard/:word/:lang", (req, res) => {
    const target = req.params.word;
    const language = req.params.lang;
    const q = "SELECT fm.flashcard_id, fm.flashcard_word, fm.status, fd.flashcard_def, fd.flashcard_pos, fi.flashcard_image FROM flashcard_main fm LEFT JOIN flashcard_definitions fd ON fm.flashcard_id = fd.flashcard_id LEFT JOIN flashcard_images fi ON fm.flashcard_id = fi.flashcard_id WHERE fm.flashcard_word = ? AND fm.flashcard_lang = ?"
    db.query(q, [target, language], (err, data) => {
        if(err) return res.json(err);
        return res.send(data);
    })
})

app.post("/epub", async (req, res) => {
    if(!req.files) res.status(400);
    const epubObj = await parseEpub(req.files.file.data, {
        type: 'buffer',
    })
    res.send(epubObj)
})

app.post("/pdf", async (req, res) => {
    if(!req.files) res.status(400);
    await fsAsync.writeFile('./temp/source.pdf', req.files.file.data, function (err) {
        if (err) throw err;
        console.log('PDF saved');
    })
    const pdf_file = "./temp/source.pdf";
    const docx_file = './temp/target.docx'
    const cv = await pdf2docx.Converter(pdf_file);
    await cv.convert(docx_file);
    await cv.close();
    if(fs.existsSync(docx_file)) {
        console.log("PDF to docx conversion successful");
        // parse docx file
        const result = await mammoth.convertToHtml({path: docx_file})
        let html = result.value;
        res.status(200).send(html)
    } else {
        console.log("PDF to docx conversion failed");
        res.status(417).send(await basicPDFParse1(req.files.file));
    }
})

app.post("/pdf-fallback", async (req, res) => {
    if(!req.files) res.status(400);
    res.send(await basicPDFParse1(req.files.file));
})

app.post("/docx", async(req, res) => {
    if(!req.files) res.status(400);
    const result = await mammoth.convertToHtml({buffer: req.files.file.data})
    let html = result.value;
    res.send(html)
})

app.post("/book", async(req, res) => {
    const q = "INSERT INTO book SET `title` = ?, `author` = ?, `description` = ?, `lang` = ?, `cover_url` = ?, `date_added` = ?";
    db.query(q, Object.values(req.body), (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.post("/section", async(req, res) => {
    const q = "INSERT INTO book_section (section_name, book_id) VALUES ?";
    const {sectionName, bookId} = req.body;
    let values = [];
    if(Array.isArray(sectionName)) {
        for(let section of sectionName) {
            values.push([section, bookId]);
        }
    } else {
        values.push([sectionName, bookId]);
    }
    db.query(q, [values], (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.post("/sentence", async(req, res) => {
    const q = "INSERT INTO sentences (section_id, sentence) VALUES ?";
    const {i: sectionId} = req.body;
    const sentences = req.body[Object.keys(req.body)[1]];
    let values = [];
    for(let sentence of sentences) {
        values.push([sectionId, sentence]);
    }
    db.query(q, [values], (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.post("/flashcard-def", (req, res) => {
    const {pos, def, currentFlashcardId} = req.body;
    const q = "INSERT INTO flashcard_definitions SET `flashcard_def` = ?, `flashcard_pos` = ?, `flashcard_id` = ?";
    const values = [def, pos, currentFlashcardId];
    db.query(q, values, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.post("/flashcard-img", (req, res) => {
    const {img, currentFlashcardId} = req.body;
    const q = "INSERT INTO flashcard_images SET `flashcard_image` = ?, `flashcard_id` = ?";
    const values = [img, currentFlashcardId];
    db.query(q, values, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.post("/flashcard", (req, res) => {
    const {word, currentLemma, currentSentence, language} = req.body;
    const q = `INSERT INTO flashcard_main (flashcard_word, flashcard_lemma, flashcard_context, flashcard_lang) SELECT ? FROM DUAL WHERE NOT EXISTS (SELECT * FROM flashcard_main WHERE flashcard_word = '${word}' AND flashcard_lang = '${language}' LIMIT 1)`;
    const values = [word, currentLemma, currentSentence, language];
    db.query(q, [values], (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.post("/add-review", (req, res) => {
    const {flashcard_id, interval, repetition, efactor, dueDate, prevRep, status} = req.body;
    const q = "INSERT INTO review SET `flashcard_id` = ?, `interval` = ?, `repetition` = ?, `efactor` = ?, `review_due` = STR_TO_DATE(?, \'%Y-%m-%dT%H:%i:%sZ\'), `prev_rep` = ?, `status` = ?";
    const values = [flashcard_id, interval, repetition, efactor, dueDate, prevRep, status];
    db.query(q, values, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.put("/update-review/:id", (req, res) => {
    const id = req.params.id;
    const {quality, completed, timeTaken} = req.body;
    const q = 'UPDATE review r SET r.review_quality = ?, r.review_completed = STR_TO_DATE(?, \'%Y-%m-%dT%H:%i:%sZ\'), r.time_taken = ? WHERE review_id = ?';
    db.query(q, [quality, completed, timeTaken, id], (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.put("/update-flashcard/:id", (req, res) => {
    const id = req.params.id;
    const {status} = req.body;
    const q = 'UPDATE flashcard_main fm SET fm.status = ? WHERE fm.flashcard_id = ?';
    db.query(q, [status, id], (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})

// app.put("/flashcard/:id", (req, res) => {
//     const cardId = req.params.id;
//     const q = "UPDATE flashcards SET `pos` = ?, `definitions` = ? WHERE id = ?";
//
//     const values = [
//         req.body.pos,
//         req.body.definitions
//     ]
//
//     db.query(q, [...values, cardId], (err, data) => {
//         if(err) return res.json(err);
//         return res.json(data);
//     })
// })


app.listen(8800, () => {
    console.log("Connected to backend!")
})