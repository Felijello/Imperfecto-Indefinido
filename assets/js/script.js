const persons = [
  "yo",
  "tú",
  "él/ella/usted",
  "nosotros/as",
  "vosotros/as",
  "ellos/ellas/ustedes",
];

const regularVerbs = ["hablar", "estudiar", "comer", "beber", "vivir", "escribir"];

const imperfectIrregulars = {
  ir: ["iba", "ibas", "iba", "íbamos", "ibais", "iban"],
  ser: ["era", "eras", "era", "éramos", "erais", "eran"],
  ver: ["veía", "veías", "veía", "veíamos", "veíais", "veían"],
};

const indefinidoIrregulars = {
  ser: ["fui", "fuiste", "fue", "fuimos", "fuisteis", "fueron"],
  ir: ["fui", "fuiste", "fue", "fuimos", "fuisteis", "fueron"],
  hacer: ["hice", "hiciste", "hizo", "hicimos", "hicisteis", "hicieron"],
  tener: ["tuve", "tuviste", "tuvo", "tuvimos", "tuvisteis", "tuvieron"],
  estar: ["estuve", "estuviste", "estuvo", "estuvimos", "estuvisteis", "estuvieron"],
  poder: ["pude", "pudiste", "pudo", "pudimos", "pudisteis", "pudieron"],
  poner: ["puse", "pusiste", "puso", "pusimos", "pusisteis", "pusieron"],
  venir: ["vine", "viniste", "vino", "vinimos", "vinisteis", "vinieron"],
  querer: ["quise", "quisiste", "quiso", "quisimos", "quisisteis", "quisieron"],
  saber: ["supe", "supiste", "supo", "supimos", "supisteis", "supieron"],
  decir: ["dije", "dijiste", "dijo", "dijimos", "dijisteis", "dijeron"],
  traer: ["traje", "trajiste", "trajo", "trajimos", "trajisteis", "trajeron"],
  dar: ["di", "diste", "dio", "dimos", "disteis", "dieron"],
  ver: ["vi", "viste", "vio", "vimos", "visteis", "vieron"],
  andar: ["anduve", "anduviste", "anduvo", "anduvimos", "anduvisteis", "anduvieron"],
  morir: ["morí", "moriste", "murió", "morimos", "moristeis", "murieron"],
};

const perfectAuxiliaries = ["he", "has", "ha", "hemos", "habéis", "han"];

const irregularParticiples = {
  hacer: "hecho",
  decir: "dicho",
  ver: "visto",
  escribir: "escrito",
  romper: "roto",
  volver: "vuelto",
  poner: "puesto",
  abrir: "abierto",
  morir: "muerto",
};

const tenseLabels = {
  imperfect: "Imperfecto",
  indefinido: "Indefinido",
  perfecto: "Perfecto",
};

const allTenses = ["imperfect", "indefinido", "perfecto"];

const allVerbs = [
  ...regularVerbs,
  ...Object.keys(imperfectIrregulars),
  ...Object.keys(indefinidoIrregulars),
  ...Object.keys(irregularParticiples),
].filter((verb, index, list) => list.indexOf(verb) === index);

const irregularVerbs = [
  ...Object.keys(imperfectIrregulars),
  ...Object.keys(indefinidoIrregulars),
  ...Object.keys(irregularParticiples),
].filter((verb, index, list) => list.indexOf(verb) === index);

const stemHints = {
  tener: "tener → tuv-",
  estar: "estar → estuv-",
  poder: "poder → pud-",
  poner: "poner → pus-",
  saber: "saber → sup-",
  hacer: "hacer → hic-/hiz-",
  venir: "venir → vin-",
  querer: "querer → quis-",
  decir: "decir → dij-",
  traer: "traer → traj-",
  andar: "andar → anduv-",
  escribir: "Partizip: escrito",
  romper: "Partizip: roto",
  volver: "Partizip: vuelto",
  abrir: "Partizip: abierto",
  morir: "Partizip: muerto",
};

const endings = {
  imperfect: {
    ar: ["aba", "abas", "aba", "ábamos", "abais", "aban"],
    erir: ["ía", "ías", "ía", "íamos", "íais", "ían"],
  },
  indefinido: {
    ar: ["é", "aste", "ó", "amos", "asteis", "aron"],
    erir: ["í", "iste", "ió", "imos", "isteis", "ieron"],
  },
};

const taskModes = [
  {
    id: "infinitiveOnly",
    label: "Nur Infinitiv",
    title: "Infinitiv gegeben",
    hint: "Fülle alle Formen für beide Zeiten aus.",
  },
  {
    id: "threeForms",
    label: "3 Formen",
    title: "Drei Formen gegeben",
    hint: "Nutze die gesperrten Formen als Hinweis und ergänze den Rest.",
  },
  {
    id: "infinitiveAndOne",
    label: "Infinitiv + Form",
    title: "Infinitiv und eine Form",
    hint: "Eine Form ist bereits eingetragen. Ergänze alle übrigen Felder.",
  },
];

const markedStorageKey = "modoPasado.markedVerbs";

const state = {
  currentVerb: "",
  sessionCount: 0,
  lockedCells: [],
  autoFilledCells: [],
  activeTenses: [...allTenses],
  tenseFilter: "all",
  taskMode: taskModes[0],
  irregularOnly: false,
  markedOnly: false,
  markedVerbs: loadMarkedVerbs(),
};

function getParticiple(verb) {
  if (irregularParticiples[verb]) return irregularParticiples[verb];
  const group = getGroup(verb);
  return `${getStem(verb)}${group === "ar" ? "ado" : "ido"}`;
}

const form = document.querySelector("#practiceForm");
const formsBody = document.querySelector("#formsBody");
const practiceForm = document.querySelector("#practiceForm");
const verbTitle = document.querySelector("#verbTitle");
const verbGroup = document.querySelector("#verbGroup");
const promptType = document.querySelector("#promptType");
const promptHint = document.querySelector("#promptHint");
const practiceSubtitle = document.querySelector("#practiceSubtitle");
const givenForm = document.querySelector("#givenForm");
const strictAccents = document.querySelector("#strictAccents");
const irregularOnly = document.querySelector("#irregularOnly");
const markedOnly = document.querySelector("#markedOnly");
const starVerb = document.querySelector("#starVerb");
const resultSummary = document.querySelector("#resultSummary");
const sessionCount = document.querySelector("#sessionCount");
const lockedCount = document.querySelector("#lockedCount");
const verbKind = document.querySelector("#verbKind");
const stemHint = document.querySelector("#stemHint");
const trainingNotice = document.querySelector("#trainingNotice");
const markedNotice = document.querySelector("#markedNotice");
const relevantTenses = document.querySelector("#relevantTenses");
const imperfectHead = document.querySelector("#imperfectHead");
const indefinidoHead = document.querySelector("#indefinidoHead");
const perfectoHead = document.querySelector("#perfectoHead");
const tenseFilterInputs = document.querySelectorAll('input[name="tenseFilter"]');
const showSolutionButton = document.querySelector("#showSolution");
const nextButton = document.querySelector("#nextVerb");
const markedList = document.querySelector("#markedList");
const markedOverviewText = document.querySelector("#markedOverviewText");
const clearMarked = document.querySelector("#clearMarked");
const sentenceType = document.querySelector("#sentenceType");
const sentencePrompt = document.querySelector("#sentencePrompt");
const sentenceOptions = document.querySelector("#sentenceOptions");
const sentenceInput = document.querySelector("#sentenceInput");
const sentenceFeedback = document.querySelector("#sentenceFeedback");
const sentenceResult = document.querySelector("#sentenceResult");
const checkSentenceButton = document.querySelector("#checkSentence");
const nextSentenceButton = document.querySelector("#nextSentence");

const sentenceExercises = [
  {
    type: "choice",
    prompt: "Ayer yo ___ al cine.",
    answer: "indefinido",
    form: "fui",
    options: ["iba", "fui", "he ido"],
    explanation: "Indefinido passt hier, weil „ayer“ einen abgeschlossenen Zeitpunkt in der Vergangenheit nennt.",
  },
  {
    type: "choice",
    prompt: "Cuando era niño, siempre ___ fútbol.",
    answer: "imperfect",
    form: "jugaba",
    options: ["jugué", "jugaba", "he jugado"],
    explanation: "Imperfecto passt hier, weil es um eine wiederholte Gewohnheit in der Kindheit geht.",
  },
  {
    type: "fill",
    prompt: "Esta semana yo ___ mucho.",
    answer: "perfecto",
    form: "he estudiado",
    explanation: "Perfecto passt hier, weil „esta semana“ ein Zeitraum ist, der noch mit der Gegenwart verbunden ist.",
  },
  {
    type: "tense",
    prompt: "Mientras ella estudiaba, yo hice la tarea.",
    answer: "imperfect",
    form: "estudiaba",
    explanation: "Imperfecto beschreibt hier die laufende Hintergrundhandlung, während eine abgeschlossene Handlung passiert.",
  },
  {
    type: "choice",
    prompt: "Anoche nosotros ___ en casa.",
    answer: "indefinido",
    form: "comimos",
    options: ["comíamos", "comimos", "hemos comido"],
    explanation: "Indefinido passt, weil „anoche“ einen klar abgeschlossenen Zeitpunkt markiert.",
  },
  {
    type: "fill",
    prompt: "Todavía no ___ el libro.",
    answer: "perfecto",
    form: "he leído",
    explanation: "Perfecto passt, weil „todavía no“ beschreibt, was bis jetzt noch nicht passiert ist.",
  },
  {
    type: "tense",
    prompt: "De niño, mi hermano siempre veía dibujos.",
    answer: "imperfect",
    form: "veía",
    explanation: "Imperfecto passt, weil der Satz eine frühere Gewohnheit beschreibt.",
  },
  {
    type: "choice",
    prompt: "Entonces ella ___ la puerta y entró.",
    answer: "indefinido",
    form: "abrió",
    options: ["abría", "abrió", "ha abierto"],
    explanation: "Indefinido passt, weil mehrere abgeschlossene Ereignisse nacheinander erzählt werden.",
  },
  {
    type: "fill",
    prompt: "Nunca nosotros ___ en Valencia.",
    answer: "perfecto",
    form: "hemos vivido",
    explanation: "Perfecto passt, weil „nunca“ hier eine Erfahrung bis heute ausdrückt.",
  },
];

const sentenceState = {
  current: null,
  selected: "",
};

function loadMarkedVerbs() {
  try {
    const saved = JSON.parse(localStorage.getItem(markedStorageKey) || "[]");
    return saved.filter((verb) => allVerbs.includes(verb));
  } catch {
    return [];
  }
}

function saveMarkedVerbs() {
  localStorage.setItem(markedStorageKey, JSON.stringify(state.markedVerbs));
}

function isMarkedVerb(verb) {
  return state.markedVerbs.includes(verb);
}

function toggleMarkedVerb(verb) {
  if (!verb || !allVerbs.includes(verb)) return;

  if (isMarkedVerb(verb)) {
    state.markedVerbs = state.markedVerbs.filter((item) => item !== verb);
  } else {
    state.markedVerbs = [...state.markedVerbs, verb].sort((a, b) => a.localeCompare(b));
  }

  saveMarkedVerbs();
  renderStarButton();
  renderMarkedList();

  if (state.markedOnly && !getVerbPool().includes(state.currentVerb)) {
    setExercise();
  } else {
    updateMarkedNotice();
  }
}

function getStem(verb) {
  return verb.slice(0, -2);
}

function getGroup(verb) {
  if (verb.endsWith("ar")) return "ar";
  if (verb.endsWith("er")) return "er";
  return "ir";
}

function conjugateRegular(verb, tense) {
  const group = getGroup(verb);
  const endingSet = group === "ar" ? endings[tense].ar : endings[tense].erir;
  return endingSet.map((ending) => `${getStem(verb)}${ending}`);
}

function getForms(verb) {
  const participle = getParticiple(verb);
  return {
    imperfect: imperfectIrregulars[verb] || conjugateRegular(verb, "imperfect"),
    indefinido: indefinidoIrregulars[verb] || conjugateRegular(verb, "indefinido"),
    perfecto: perfectAuxiliaries.map((auxiliary) => `${auxiliary} ${participle}`),
  };
}

function normalizeAnswer(value) {
  const basic = value.trim().toLowerCase().replace(/\s+/g, " ");
  if (strictAccents.checked) return basic;
  return basic.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function isCorrect(input, expected) {
  return normalizeAnswer(input) === normalizeAnswer(expected);
}

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function getSelectedTenses() {
  if (state.tenseFilter === "imperfect") return ["imperfect"];
  if (state.tenseFilter === "indefinido") return ["indefinido"];
  if (state.tenseFilter === "perfecto") return ["perfecto"];
  return [...allTenses];
}

function getVerbPool() {
  const selectedTenses = getSelectedTenses();
  let pool = state.irregularOnly
    ? irregularVerbs.filter((verb) =>
        getIrregularTenses(verb).some((tense) => selectedTenses.includes(tense))
      )
    : [...allVerbs];

  if (state.markedOnly) {
    const markedSet = new Set(state.markedVerbs);
    pool = pool.filter((verb) => markedSet.has(verb));
  }

  return pool;
}

function isIrregularVerb(verb) {
  return irregularVerbs.includes(verb);
}

function getIrregularTenses(verb) {
  return [
    imperfectIrregulars[verb] ? "imperfect" : null,
    indefinidoIrregulars[verb] ? "indefinido" : null,
    irregularParticiples[verb] ? "perfecto" : null,
  ].filter(Boolean);
}

function cellId(tense, personIndex) {
  return `${tense}-${personIndex}`;
}

function getCellsForTenses(tenses) {
  return tenses.flatMap((tense) =>
    persons.map((_, personIndex) => ({ tense, personIndex }))
  );
}

function makeLockedCells(forms, mode, activeTenses) {
  if (mode.id === "infinitiveOnly") return [];

  const amount = mode.id === "threeForms" ? 3 : 1;
  const pool = getCellsForTenses(activeTenses);
  const locked = [];

  while (locked.length < Math.min(amount, pool.length) && pool.length > 0) {
    const pickedIndex = Math.floor(Math.random() * pool.length);
    const [picked] = pool.splice(pickedIndex, 1);
    locked.push({
      ...picked,
      answer: forms[picked.tense][picked.personIndex],
    });
  }

  return locked;
}

function makeAutoFilledCells(forms, activeTenses) {
  if (!state.irregularOnly || state.tenseFilter !== "all") return [];

  const inactiveTenses = allTenses.filter((tense) => !activeTenses.includes(tense));

  return getCellsForTenses(inactiveTenses).map(({ tense, personIndex }) => ({
    tense,
    personIndex,
    answer: forms[tense][personIndex],
  }));
}

function renderRows() {
  formsBody.innerHTML = "";
  persons.forEach((person, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="person-cell">${person}</td>
      <td class="input-cell tense-cell" data-tense-cell="imperfect" data-label="Imperfecto">
        <label class="sr-only" for="imperfect-${index}">Imperfecto ${person}</label>
        <input class="verb-input" id="imperfect-${index}" data-tense="imperfect" data-index="${index}" type="text" inputmode="text" autocapitalize="none" spellcheck="false">
        <span class="answer-note" id="note-imperfect-${index}"></span>
      </td>
      <td class="input-cell tense-cell" data-tense-cell="indefinido" data-label="Indefinido">
        <label class="sr-only" for="indefinido-${index}">Indefinido ${person}</label>
        <input class="verb-input" id="indefinido-${index}" data-tense="indefinido" data-index="${index}" type="text" inputmode="text" autocapitalize="none" spellcheck="false">
        <span class="answer-note" id="note-indefinido-${index}"></span>
      </td>
      <td class="input-cell tense-cell" data-tense-cell="perfecto" data-label="Perfecto">
        <label class="sr-only" for="perfecto-${index}">Perfecto ${person}</label>
        <input class="verb-input" id="perfecto-${index}" data-tense="perfecto" data-index="${index}" type="text" inputmode="text" autocapitalize="none" spellcheck="false">
        <span class="answer-note" id="note-perfecto-${index}"></span>
      </td>
    `;
    formsBody.append(row);
  });
}

function clearFeedback() {
  document.querySelectorAll(".verb-input").forEach((input) => {
    input.classList.remove("correct", "incorrect");
    if (
      !input.classList.contains("prefilled") &&
      !input.classList.contains("auto-filled")
    ) {
      input.readOnly = false;
    }
  });
  document.querySelectorAll(".answer-note").forEach((note) => {
    note.textContent = "";
    note.classList.remove("is-error");
  });
  resultSummary.className = "result-summary";
  resultSummary.textContent = "Bereit";
}

function tenseLabel(tense) {
  return tenseLabels[tense] || tense;
}

function tenseScopeText() {
  if (state.activeTenses.length === 1) {
    return tenseLabel(state.activeTenses[0]);
  }
  return "alle Vergangenheitszeiten";
}

function updatePracticeCopy() {
  const scope = tenseScopeText();
  practiceSubtitle.textContent = `Ergänze ${scope} für alle Personen.`;

  if (state.taskMode.id === "infinitiveOnly") {
    promptHint.textContent = `Fülle die Formen für ${scope} aus.`;
  } else if (state.taskMode.id === "threeForms") {
    promptHint.textContent = "Nutze die gesperrten Formen als Hinweis und ergänze den Rest.";
  } else {
    promptHint.textContent = "Eine Form ist bereits eingetragen. Ergänze alle übrigen Felder.";
  }
}

function renderGivenForms() {
  givenForm.innerHTML = "";
  if (state.lockedCells.length === 0) {
    givenForm.hidden = true;
    return;
  }

  state.lockedCells.forEach(({ tense, personIndex, answer }) => {
    const chip = document.createElement("div");
    chip.className = "given-chip";
    chip.innerHTML = `${persons[personIndex]} · ${tenseLabel(tense)}<strong>${answer}</strong>`;
    givenForm.append(chip);
  });
  givenForm.hidden = false;
}

function applyLockedCells() {
  state.lockedCells.forEach(({ tense, personIndex, answer }) => {
    const input = document.querySelector(`#${cellId(tense, personIndex)}`);
    const note = document.querySelector(`#note-${cellId(tense, personIndex)}`);
    input.value = answer;
    input.readOnly = true;
    input.classList.add("prefilled");
    note.textContent = "Vorgegeben";
  });
}

function applyAutoFilledCells() {
  state.autoFilledCells.forEach(({ tense, personIndex, answer }) => {
    const input = document.querySelector(`#${cellId(tense, personIndex)}`);
    const note = document.querySelector(`#note-${cellId(tense, personIndex)}`);
    input.value = answer;
    input.readOnly = true;
    input.disabled = true;
    input.classList.add("auto-filled");
    note.textContent = "Regelmäßig";
  });
}

function updateActiveColumns() {
  const activeSet = new Set(state.activeTenses);
  practiceForm.dataset.activeTenses = state.activeTenses.join("-");

  document.querySelectorAll(".verb-input").forEach((input) => {
    if (activeSet.has(input.dataset.tense)) {
      input.classList.add("is-active");
    } else {
      input.classList.remove("is-active");
    }
  });

  document.querySelectorAll(".tense-cell").forEach((cell) => {
    const active = activeSet.has(cell.dataset.tenseCell);
    cell.classList.toggle("is-active-column", active && state.irregularOnly);
    cell.classList.toggle("is-collapsed", !active);
  });

  imperfectHead.classList.toggle("is-active", activeSet.has("imperfect"));
  imperfectHead.classList.toggle("is-inactive", !activeSet.has("imperfect"));
  indefinidoHead.classList.toggle("is-active", activeSet.has("indefinido"));
  indefinidoHead.classList.toggle("is-inactive", !activeSet.has("indefinido"));
  perfectoHead.classList.toggle("is-active", activeSet.has("perfecto"));
  perfectoHead.classList.toggle("is-inactive", !activeSet.has("perfecto"));
}

function updateTrainingNotice() {
  if (!state.irregularOnly) {
    trainingNotice.hidden = true;
    relevantTenses.textContent = "";
    return;
  }

  trainingNotice.hidden = false;
  relevantTenses.textContent =
    state.activeTenses.length === 1
      ? `Nur ${tenseLabel(state.activeTenses[0])} unregelmäßig`
      : `${state.activeTenses.map(tenseLabel).join(" + ")} unregelmäßig`;
}

function getMarkedNoticeText() {
  if (state.markedVerbs.length === 0) {
    return {
      title: "Du hast noch keine Verben markiert.",
      detail: "Markiere schwere Verben mit dem Stern, um sie gezielt zu üben.",
    };
  }

  return {
    title: "Keine markierten Verben passen zu diesen Filtern.",
    detail: "Ändere den Zeitform-Filter oder deaktiviere „Nur unregelmäßige Verben“.",
  };
}

function updateMarkedNotice(forceShow = false) {
  if (!state.markedOnly && !forceShow) {
    markedNotice.hidden = true;
    return;
  }

  const poolIsEmpty = state.markedOnly && getVerbPool().length === 0;
  markedNotice.hidden = !forceShow && !poolIsEmpty;

  if (!markedNotice.hidden) {
    const text = getMarkedNoticeText();
    markedNotice.querySelector("strong").textContent = text.title;
    markedNotice.querySelector("span").textContent = text.detail;
  }
}

function renderStarButton() {
  const active = isMarkedVerb(state.currentVerb);
  starVerb.disabled = !state.currentVerb || !allVerbs.includes(state.currentVerb);
  starVerb.setAttribute("aria-pressed", String(active));
  starVerb.setAttribute(
    "aria-label",
    active ? "Markierung für dieses schwere Verb entfernen" : "Verb als schwer markieren"
  );
  starVerb.querySelector("span").textContent = active ? "★" : "☆";
}

function renderMarkedList() {
  markedList.innerHTML = "";

  if (state.markedVerbs.length === 0) {
    markedOverviewText.textContent =
      "Du hast noch keine Verben markiert. Nutze den Stern beim aktuellen Verb.";
    clearMarked.hidden = true;
    const empty = document.createElement("p");
    empty.className = "marked-empty";
    empty.textContent = "Noch keine schweren Verben gespeichert.";
    markedList.append(empty);
    return;
  }

  markedOverviewText.textContent = `${state.markedVerbs.length} Verb${
    state.markedVerbs.length === 1 ? "" : "en"
  } in deiner Merkliste.`;
  clearMarked.hidden = false;

  state.markedVerbs.forEach((verb) => {
    const item = document.createElement("div");
    item.className = "marked-item";
    item.innerHTML = `
      <span>${verb}</span>
      <button type="button" data-remove-marked="${verb}" aria-label="${verb} aus der Merkliste entfernen">Entfernen</button>
    `;
    markedList.append(item);
  });
}

function updateVerbStatus() {
  const irregular = isIrregularVerb(state.currentVerb);
  verbKind.textContent = irregular ? "unregelmäßig" : "regelmäßig";

  const hint = stemHints[state.currentVerb];
  if (irregular && hint) {
    stemHint.textContent = `Stamm: ${hint}`;
    stemHint.hidden = false;
  } else {
    stemHint.textContent = "";
    stemHint.hidden = true;
  }
}

function renderEmptyExercise() {
  state.currentVerb = "";
  state.lockedCells = [];
  state.autoFilledCells = [];
  state.activeTenses = getSelectedTenses();

  renderRows();
  clearFeedback();
  updateActiveColumns();
  document.querySelectorAll(".verb-input").forEach((input) => {
    input.disabled = true;
    input.readOnly = true;
  });
  givenForm.hidden = true;
  updateTrainingNotice();
  updateMarkedNotice(true);
  renderStarButton();
  renderMarkedList();

  const text = getMarkedNoticeText();
  verbTitle.textContent = "Merkliste leer";
  verbGroup.textContent = "Merkliste";
  promptType.textContent = "Schwere Verben";
  promptHint.textContent = text.detail;
  practiceSubtitle.textContent = "Markiere schwere Verben, um sie gezielt zu üben.";
  lockedCount.textContent = "0 Vorgaben";
  resultSummary.className = "result-summary";
  resultSummary.textContent = "Keine Verben";
  verbKind.textContent = "Merkliste";
  stemHint.hidden = true;
  stemHint.textContent = "";
}

function setExercise() {
  const verbPool = getVerbPool();
  if (verbPool.length === 0) {
    renderEmptyExercise();
    return;
  }

  state.currentVerb = randomFrom(verbPool);
  state.sessionCount += 1;
  state.taskMode = randomFrom(taskModes);

  const forms = getForms(state.currentVerb);
  const selectedTenses = getSelectedTenses();
  state.activeTenses = state.irregularOnly
    ? getIrregularTenses(state.currentVerb).filter((tense) =>
        selectedTenses.includes(tense)
      )
    : selectedTenses;
  state.autoFilledCells = makeAutoFilledCells(forms, state.activeTenses);
  state.lockedCells = makeLockedCells(forms, state.taskMode, state.activeTenses);

  renderRows();
  clearFeedback();
  updateActiveColumns();
  applyAutoFilledCells();
  applyLockedCells();
  renderGivenForms();
  updateTrainingNotice();
  updateMarkedNotice();
  renderStarButton();
  renderMarkedList();

  const showInfinitive = state.taskMode.id !== "threeForms";
  verbTitle.textContent = showInfinitive ? state.currentVerb : "Formen erkennen";
  verbGroup.textContent = showInfinitive ? `-${getGroup(state.currentVerb)}` : "Hinweis";
  promptType.textContent = state.taskMode.title;
  updatePracticeCopy();
  sessionCount.textContent = state.sessionCount;
  lockedCount.textContent = `${state.lockedCells.length} Vorgabe${state.lockedCells.length === 1 ? "" : "n"}`;
  updateVerbStatus();

  const firstEditable = document.querySelector(".verb-input:not([readonly])");
  if (firstEditable) firstEditable.focus({ preventScroll: true });
}

function checkAnswers(showAnswers = false) {
  if (!state.currentVerb) {
    updateMarkedNotice(true);
    resultSummary.className = "result-summary";
    resultSummary.textContent = "Keine Verben";
    return;
  }

  const forms = getForms(state.currentVerb);
  const activeSet = new Set(state.activeTenses);
  let correct = 0;
  let total = 0;

  document.querySelectorAll(".verb-input").forEach((input) => {
    const tense = input.dataset.tense;
    const index = Number(input.dataset.index);
    const expected = forms[tense][index];
    const note = document.querySelector(`#note-${cellId(tense, index)}`);
    const answerIsCorrect = isCorrect(input.value, expected);
    const isActive = activeSet.has(tense);

    input.classList.remove("correct", "incorrect");
    note.classList.remove("is-error");

    if (!isActive) {
      input.value = expected;
      note.textContent = "Regelmäßig";
      return;
    }

    total += 1;

    if (showAnswers) {
      input.value = expected;
      input.classList.add("correct");
      note.textContent = input.classList.contains("prefilled") ? "Vorgegeben" : "Lösung";
      correct += 1;
      return;
    }

    if (answerIsCorrect) {
      input.classList.add("correct");
      note.textContent = input.classList.contains("prefilled") ? "Vorgegeben" : "Richtig";
      correct += 1;
    } else {
      input.classList.add("incorrect");
      note.classList.add("is-error");
      note.textContent = input.value.trim() ? `Erwartet: ${expected}` : "Noch leer";
    }
  });

  resultSummary.className = `result-summary ${correct === total ? "is-success" : "has-errors"}`;
  resultSummary.textContent = `${correct}/${total} richtig`;
}

function renderSentenceExercise() {
  const exercise = randomFrom(sentenceExercises);
  sentenceState.current = exercise;
  sentenceState.selected = "";

  sentenceType.textContent =
    exercise.type === "fill"
      ? "Lücke ausfüllen"
      : exercise.type === "tense"
        ? "Zeitform auswählen"
        : "Multiple Choice";
  sentencePrompt.textContent = exercise.prompt;
  sentenceOptions.innerHTML = "";
  sentenceFeedback.textContent = "";
  sentenceFeedback.className = "sentence-feedback";
  sentenceResult.className = "result-summary";
  sentenceResult.textContent = "Bereit";
  sentenceInput.value = "";
  sentenceInput.hidden = exercise.type !== "fill";

  if (exercise.type === "fill") {
    sentenceInput.placeholder = "z. B. he estudiado";
    return;
  }

  const options =
    exercise.type === "tense"
      ? ["imperfect", "indefinido", "perfecto"]
      : exercise.options;

  options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "sentence-option";
    button.dataset.value = option;
    button.textContent = exercise.type === "tense" ? tenseLabel(option) : option;
    sentenceOptions.append(button);
  });
}

function checkSentenceExercise() {
  const exercise = sentenceState.current;
  if (!exercise) return;

  const rawAnswer = exercise.type === "fill" ? sentenceInput.value : sentenceState.selected;
  const expected = exercise.type === "fill" ? exercise.form : exercise.type === "tense" ? exercise.answer : exercise.form;
  const correct = exercise.type === "tense"
    ? rawAnswer === exercise.answer
    : isCorrect(rawAnswer, expected);

  sentenceOptions.querySelectorAll(".sentence-option").forEach((button) => {
    const expectedValue = exercise.type === "tense" ? exercise.answer : exercise.form;
    button.classList.toggle("correct", button.dataset.value === expectedValue);
    button.classList.toggle(
      "incorrect",
      button.dataset.value === sentenceState.selected && button.dataset.value !== expectedValue
    );
  });

  if (exercise.type === "fill") {
    sentenceInput.classList.toggle("correct", correct);
    sentenceInput.classList.toggle("incorrect", !correct);
  }

  sentenceResult.className = `result-summary ${correct ? "is-success" : "has-errors"}`;
  sentenceResult.textContent = correct ? "Richtig" : "Nochmal anschauen";
  sentenceFeedback.className = `sentence-feedback ${correct ? "is-success" : "has-errors"}`;
  sentenceFeedback.textContent = correct
    ? exercise.explanation
    : `${exercise.explanation} Richtige Antwort: ${exercise.type === "tense" ? tenseLabel(exercise.answer) : exercise.form}.`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  checkAnswers(false);
});

showSolutionButton.addEventListener("click", () => checkAnswers(true));
nextButton.addEventListener("click", setExercise);
strictAccents.addEventListener("change", clearFeedback);
irregularOnly.addEventListener("change", () => {
  state.irregularOnly = irregularOnly.checked;
  setExercise();
});
markedOnly.addEventListener("change", () => {
  state.markedOnly = markedOnly.checked;
  setExercise();
});
starVerb.addEventListener("click", () => toggleMarkedVerb(state.currentVerb));
markedList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-marked]");
  if (!button) return;
  toggleMarkedVerb(button.dataset.removeMarked);
});
clearMarked.addEventListener("click", () => {
  state.markedVerbs = [];
  saveMarkedVerbs();
  renderMarkedList();
  renderStarButton();
  if (state.markedOnly) {
    setExercise();
  } else {
    updateMarkedNotice();
  }
});
sentenceOptions.addEventListener("click", (event) => {
  const button = event.target.closest(".sentence-option");
  if (!button) return;
  sentenceState.selected = button.dataset.value;
  sentenceOptions.querySelectorAll(".sentence-option").forEach((option) => {
    option.classList.toggle("is-selected", option === button);
    option.classList.remove("correct", "incorrect");
  });
  sentenceFeedback.textContent = "";
  sentenceFeedback.className = "sentence-feedback";
  sentenceResult.className = "result-summary";
  sentenceResult.textContent = "Ausgewählt";
});
sentenceInput.addEventListener("input", () => {
  sentenceInput.classList.remove("correct", "incorrect");
  sentenceFeedback.textContent = "";
  sentenceFeedback.className = "sentence-feedback";
});
checkSentenceButton.addEventListener("click", checkSentenceExercise);
nextSentenceButton.addEventListener("click", renderSentenceExercise);
tenseFilterInputs.forEach((input) => {
  input.addEventListener("change", () => {
    state.tenseFilter = input.value;
    setExercise();
  });
});

setExercise();
renderSentenceExercise();
