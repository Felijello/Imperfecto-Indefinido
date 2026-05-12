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
};

const allVerbs = [
  ...regularVerbs,
  ...Object.keys(imperfectIrregulars),
  ...Object.keys(indefinidoIrregulars),
].filter((verb, index, list) => list.indexOf(verb) === index);

const irregularVerbs = [
  ...Object.keys(imperfectIrregulars),
  ...Object.keys(indefinidoIrregulars),
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

const state = {
  currentVerb: "",
  sessionCount: 0,
  lockedCells: [],
  autoFilledCells: [],
  activeTenses: ["imperfect", "indefinido"],
  taskMode: taskModes[0],
  irregularOnly: false,
};

const form = document.querySelector("#practiceForm");
const formsBody = document.querySelector("#formsBody");
const practiceForm = document.querySelector("#practiceForm");
const verbTitle = document.querySelector("#verbTitle");
const verbGroup = document.querySelector("#verbGroup");
const promptType = document.querySelector("#promptType");
const promptHint = document.querySelector("#promptHint");
const givenForm = document.querySelector("#givenForm");
const strictAccents = document.querySelector("#strictAccents");
const irregularOnly = document.querySelector("#irregularOnly");
const resultSummary = document.querySelector("#resultSummary");
const sessionCount = document.querySelector("#sessionCount");
const lockedCount = document.querySelector("#lockedCount");
const verbKind = document.querySelector("#verbKind");
const stemHint = document.querySelector("#stemHint");
const trainingNotice = document.querySelector("#trainingNotice");
const relevantTenses = document.querySelector("#relevantTenses");
const imperfectHead = document.querySelector("#imperfectHead");
const indefinidoHead = document.querySelector("#indefinidoHead");
const showSolutionButton = document.querySelector("#showSolution");
const nextButton = document.querySelector("#nextVerb");

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
  return {
    imperfect: imperfectIrregulars[verb] || conjugateRegular(verb, "imperfect"),
    indefinido: indefinidoIrregulars[verb] || conjugateRegular(verb, "indefinido"),
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

function getVerbPool() {
  return state.irregularOnly ? irregularVerbs : allVerbs;
}

function isIrregularVerb(verb) {
  return irregularVerbs.includes(verb);
}

function getIrregularTenses(verb) {
  return [
    imperfectIrregulars[verb] ? "imperfect" : null,
    indefinidoIrregulars[verb] ? "indefinido" : null,
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
  if (!state.irregularOnly) return [];

  const inactiveTenses = ["imperfect", "indefinido"].filter(
    (tense) => !activeTenses.includes(tense)
  );

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
  return tense === "imperfect" ? "Imperfecto" : "Indefinido";
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
    cell.classList.toggle("is-collapsed", state.irregularOnly && !active);
  });

  imperfectHead.classList.toggle("is-active", activeSet.has("imperfect"));
  imperfectHead.classList.toggle("is-inactive", !activeSet.has("imperfect"));
  indefinidoHead.classList.toggle("is-active", activeSet.has("indefinido"));
  indefinidoHead.classList.toggle("is-inactive", !activeSet.has("indefinido"));
}

function updateTrainingNotice() {
  if (!state.irregularOnly) {
    trainingNotice.hidden = true;
    relevantTenses.textContent = "";
    return;
  }

  trainingNotice.hidden = false;
  if (state.activeTenses.length === 2) {
    relevantTenses.textContent = "Imperfecto + Indefinido unregelmäßig";
  } else if (state.activeTenses[0] === "imperfect") {
    relevantTenses.textContent = "Nur Imperfecto unregelmäßig";
  } else {
    relevantTenses.textContent = "Nur Indefinido unregelmäßig";
  }
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

function setExercise() {
  state.currentVerb = randomFrom(getVerbPool());
  state.sessionCount += 1;
  state.taskMode = randomFrom(taskModes);

  const forms = getForms(state.currentVerb);
  state.activeTenses = state.irregularOnly
    ? getIrregularTenses(state.currentVerb)
    : ["imperfect", "indefinido"];
  state.autoFilledCells = makeAutoFilledCells(forms, state.activeTenses);
  state.lockedCells = makeLockedCells(forms, state.taskMode, state.activeTenses);

  renderRows();
  clearFeedback();
  updateActiveColumns();
  applyAutoFilledCells();
  applyLockedCells();
  renderGivenForms();
  updateTrainingNotice();

  const showInfinitive = state.taskMode.id !== "threeForms";
  verbTitle.textContent = showInfinitive ? state.currentVerb : "Formen erkennen";
  verbGroup.textContent = showInfinitive ? `-${getGroup(state.currentVerb)}` : "Hinweis";
  promptType.textContent = state.taskMode.title;
  promptHint.textContent = state.taskMode.hint;
  sessionCount.textContent = state.sessionCount;
  lockedCount.textContent = `${state.lockedCells.length} Vorgabe${state.lockedCells.length === 1 ? "" : "n"}`;
  updateVerbStatus();

  const firstEditable = document.querySelector(".verb-input:not([readonly])");
  if (firstEditable) firstEditable.focus({ preventScroll: true });
}

function checkAnswers(showAnswers = false) {
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

setExercise();
