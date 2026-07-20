// download-covers.js
//
// Downloads book cover images from Open Library Covers API
// and saves them using the exact filenames used in bookSeed.js
//
// Run:
// node download-covers.js

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const books = [
  { title: "The Great Gatsby", ISBN: "9780743273565", image: "gatsby.jpg" },

  { title: "Atomic Habits", ISBN: "9780735211292", image: "atomic.jpg" },

  { title: "Clean Code", ISBN: "9780132350884", image: "clean-code.jpg" },

  { title: "Rich Dad Poor Dad", ISBN: "9781612680194", image: "rich-dad.jpg" },

  {
    title: "The Lean Startup",
    ISBN: "9780307887894",
    image: "lean-startup.jpg",
  },

  {
    title: "You Don't Know JS",
    ISBN: "9781491904244",
    image: "you-dont-know-js.jpg",
  },

  {
    title: "JavaScript: The Good Parts",
    ISBN: "9780596517748",
    image: "javascript-good-parts.jpg",
  },

  { title: "The Alchemist", ISBN: "9780061122415", image: "alchemist.jpg" },

  {
    title: "Harry Potter and the Philosopher's Stone",
    ISBN: "9780747532699",
    image: "harry-potter.jpg",
  },

  {
    title: "The Psychology of Money",
    ISBN: "9780857197689",
    image: "psychology-money.jpg",
  },

  { title: "Deep Work", ISBN: "9781455586691", image: "deep-work.jpg" },

  { title: "Steve Jobs", ISBN: "9781451648546", image: "steve-jobs.jpg" },

  {
    title: "Long Walk to Freedom",
    ISBN: "9780316548182",
    image: "mandela.jpg",
  },

  {
    title: "The 7 Habits of Highly Effective People",
    ISBN: "9781982137274",
    image: "7-habits.jpg",
  },

  {
    title: "Python Crash Course",
    ISBN: "9781593279288",
    image: "python-crash-course.jpg",
  },

  {
    title: "Design Patterns",
    ISBN: "9780201633610",
    image: "design-patterns.jpg",
  },

  {
    title: "The 48 Laws of Power",
    ISBN: "9780140280197",
    image: "48-laws.jpg",
  },

  {
    title: "Think and Grow Rich",
    ISBN: "9781585424337",
    image: "think-grow-rich.jpg",
  },

  { title: "The Hobbit", ISBN: "9780261102217", image: "hobbit.jpg" },

  { title: "Zero to One", ISBN: "9780804139298", image: "zero-to-one.jpg" },
];

// IMPORTANT:
// Your seed expects:
// server/seeds/images/

const OUTPUT_DIR = path.join(__dirname, "seeds", "images");

async function downloadCover(book) {
  const url = `https://covers.openlibrary.org/b/isbn/${book.ISBN}-L.jpg`;

  const output = path.join(OUTPUT_DIR, book.image);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.log(`❌ ${book.title}: HTTP ${response.status}`);

      return;
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    // Ignore missing covers
    if (buffer.length < 3000) {
      console.log(`⚠️ ${book.title}: cover not available`);

      return;
    }

    fs.writeFileSync(output, buffer);

    console.log(`✅ ${book.image} downloaded`);
  } catch (error) {
    console.log(`❌ ${book.title}: ${error.message}`);
  }
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, {
      recursive: true,
    });
  }

  console.log("Downloading book covers...");

  for (const book of books) {
    await downloadCover(book);

    // avoid hammering Open Library
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log("\n✅ Download complete");

  console.log(`Images saved in: ${OUTPUT_DIR}`);
}

main();
