
const WORDS_URL = "./data/cet4_core_words_batch01_500.json";

const wordElement = document.getElementById("word");
const phoneticElement = document.getElementById("phonetic");
const posElement = document.getElementById("pos");
const meaningElement = document.getElementById("meaning");
const exampleElement = document.getElementById("example");
const translationElement = document.getElementById("translation");
const categoryElement = document.getElementById("category");
const progressElement = document.getElementById("progress");

const TARGET = 20;
const today = new Date().toLocaleDateString("en-CA");
const STORAGE_KEY = "cet4_progress_" + today;

let words = [];
let currentIndex = 0;
let progress = loadProgress();

// 读取本地学习记录
function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
      completed: 0,
      known: [],
      unknown: []
    };
  } catch {
    return {
      completed: 0,
      known: [],
      unknown: []
    };
  }
}

// 保存学习记录
function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

// 更新进度
function updateProgress() {
  progressElement.textContent =
    `${progress.completed} / ${TARGET}`;

  saveProgress();
}

// 显示单词
function showWord() {
  if (words.length === 0) return;

  const word = words[currentIndex];

  wordElement.textContent = word.word || "";
  phoneticElement.textContent = word.phonetic || "";
  posElement.textContent = word.pos || "";
  meaningElement.textContent = word.meaning || "";
  exampleElement.textContent = word.example || "";
  translationElement.textContent = word.translation || "";
  categoryElement.textContent = word.category || "CET-4 高频词汇";
}

// 切换到下一个单词
function nextWord() {
  currentIndex++;

  if (currentIndex >= words.length) {
    currentIndex = 0;
  }

  showWord();
}

// 记录学习结果
function markWord(isKnown) {
  const word = words[currentIndex];

  if (!word) return;

  const list = isKnown ? progress.known : progress.unknown;

  if (!list.includes(word.word)) {
    list.push(word.word);
  }

  progress.completed++;
  updateProgress();
  nextWord();
}

// 加载词库
async function loadWords() {
  try {
    const response = await fetch(WORDS_URL);

    if (!response.ok) {
      throw new Error("词库文件读取失败：" + response.status);
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("词库格式不正确或没有单词");
    }

    words = data;
    currentIndex = 0;

    showWord();
    updateProgress();

  } catch (error) {
    wordElement.textContent = "词库加载失败";
    meaningElement.textContent = error.message;
    console.error(error);
  }
}

// 绑定按钮
document.getElementById("known").addEventListener("click", () => {
  markWord(true);
});

document.getElementById("unknown").addEventListener("click", () => {
  markWord(false);
});

document.getElementById("next").addEventListener("click", () => {
  nextWord();
});

// 启动网站
loadWords();
