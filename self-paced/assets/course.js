const moduleIds = ["m01", "m02", "m03", "m04", "m05", "m06", "m07", "m08"];
const storageKey = "cld-uf-101-progress";

function getProgress() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch (error) {
    return {};
  }
}

function saveProgress(progress) {
  localStorage.setItem(storageKey, JSON.stringify(progress));
}

function updateUi() {
  const progress = getProgress();
  const completed = moduleIds.filter((id) => progress[id]).length;
  const percent = Math.round((completed / moduleIds.length) * 100);

  const progressText = document.getElementById("progressText");
  const progressFill = document.getElementById("progressFill");

  if (progressText) progressText.textContent = `${percent}% complete · ${completed}/${moduleIds.length} modules`;
  if (progressFill) progressFill.style.width = `${percent}%`;

  document.querySelectorAll(".module-card").forEach((card) => {
    const id = card.dataset.module;
    const button = card.querySelector(".complete-btn");
    const isComplete = Boolean(progress[id]);
    card.classList.toggle("is-complete", isComplete);
    if (button) button.textContent = isComplete ? "Completed" : "Mark complete";
  });
}

function toggleModule(id) {
  const progress = getProgress();
  progress[id] = !progress[id];
  saveProgress(progress);
  updateUi();
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-complete]").forEach((button) => {
    button.addEventListener("click", () => toggleModule(button.dataset.complete));
  });

  updateUi();
});
