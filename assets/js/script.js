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

const state = {
  currentVerb: "",
  sessionCount: 0,
  prefilled: null,
};

const form = document.querySelector("#practiceForm");
const formsBody = document.querySelector("#formsBody");
const verbTitle = document.querySelector("#verbTitle");
const verbGroup = document.querySelector("#verbGroup");
const promptType = document.querySelector("#promptType");
const promptHint = document.querySelector("#promptHint");
const givenForm = document.querySelector("#givenForm");
const strictAccents = document.querySelector("#strictAccents");
const resultSummary = document.querySelector("#resultSummary");
const sessionCount = document.querySelector("#sessionCount");
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

function makePrefill(forms) {
  if (Math.random() < 0.5) return null;
  const tense = randomFrom(["imperfect", "indefinido"]);
  const personIndex = Math.floor(Math.random() * persons.length);
  return {
    tense,
    personIndex,
    answer: forms[tense][personIndex],
  };
}

function renderRows() {
  formsBody.innerHTML = "";
  persons.forEach((person, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="person-cell">${person}</td>
      <td class="input-cell">
        <label class="sr-only" for="imperfect-${index}">Imperfecto ${person}</label>
        <input class="verb-input" id="imperfect-${index}" data-tense="imperfect" data-index="${index}" type="text" inputmode="text" autocapitalize="none" spellcheck="false">
        <span class="answer-note" id="note-imperfect-${index}"></span>
      </td>
      <td class="input-cell">
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
    if (!input.classList.contains("prefilled")) input.readOnly = false;
  });
  document.querySelectorAll(".answer-note").forEach((note) => {
    note.textContent = "";
    note.classList.remove("is-error");
  });
  resultSummary.className = "result-summary";
  resultSummary.textContent = "Bereit";
}

function setExercise() {
  state.currentVerb = randomFrom(allVerbs);
  state.sessionCount += 1;
  const forms = getForms(state.currentVerb);
  state.prefilled = makePrefill(forms);

  renderRows();
  clearFeedback();

  verbTitle.textContent = state.currentVerb;
  verbGroup.textContent = `-${getGroup(state.currentVerb)}`;
  sessionCount.textContent = state.sessionCount;

  if (state.prefilled) {
    const { tense, personIndex, answer } = state.prefilled;
    const input = document.querySelector(`#${tense}-${personIndex}`);
    input.value = answer;
    input.readOnly = true;
    input.classList.add("prefilled");
    promptType.textContent = "Form vorgegeben";
    promptHint.textContent = "Eine Form ist schon eingetragen. Ergänze alle übrigen Formen.";
    givenForm.hidden = false;
    givenForm.innerHTML = `${persons[personIndex]} · ${tense === "imperfect" ? "Imperfecto" : "Indefinido"}<strong>${answer}</strong>`;
  } else {
    promptType.textContent = "Infinitiv";
    promptHint.textContent = "Nur der Infinitiv ist gegeben. Fülle beide Tabellen vollständig aus.";
    givenForm.hidden = true;
    givenForm.textContent = "";
  }

  const firstEditable = document.querySelector(".verb-input:not([readonly])");
  if (firstEditable) firstEditable.focus({ preventScroll: true });
}

function checkAnswers(showAnswers = false) {
  const forms = getForms(state.currentVerb);
  let correct = 0;
  let total = 0;

  document.querySelectorAll(".verb-input").forEach((input) => {
    const tense = input.dataset.tense;
    const index = Number(input.dataset.index);
    const expected = forms[tense][index];
    const note = document.querySelector(`#note-${tense}-${index}`);
    const answerIsCorrect = isCorrect(input.value, expected);

    total += 1;
    input.classList.remove("correct", "incorrect");
    note.classList.remove("is-error");

    if (showAnswers) {
      input.value = expected;
      input.classList.add("correct");
      note.textContent = "Lösung";
      correct += 1;
      return;
    }

    if (answerIsCorrect) {
      input.classList.add("correct");
      note.textContent = "Richtig";
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

setExercise();
