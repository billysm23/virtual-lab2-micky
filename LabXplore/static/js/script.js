const newtonLab = document.getElementById("newtonLab");
const massSlider = document.getElementById("mass");
const forceSlider = document.getElementById("force");
const massValue = document.getElementById("massValue");
const forceValue = document.getElementById("forceValue");
const staticFrictionSlider = document.getElementById("staticFriction");
const staticFrictionValue = document.getElementById("staticFrictionValue");
const accelerationOutput = document.getElementById("acceleration");
const kineticFrictionSlider = document.getElementById("kineticFriction");
const kineticFrictionValue = document.getElementById("kineticFrictionValue");
const velocityOutput = document.getElementById("velocity");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const canvas = document.getElementById("simulationCanvas");
const ctx = canvas.getContext("2d");

let mass = parseFloat(massSlider.value);
let force = parseFloat(forceSlider.value);
let staticFriction = parseFloat(staticFrictionSlider.value);
let kineticFriction = parseFloat(kineticFrictionSlider.value);
let velocity = 0;
let position = 0;
let acceleration = 0;
let interval;
let simulationStarted = false;
let positionDots = [];
let dotInterval;

let updatedMass = mass;
let updatedForce = force;
let updatedStaticFriction = staticFriction;
let updatedKineticFriction = kineticFriction;

const allInputs = [
  massSlider,
  forceSlider,
  massValue,
  forceValue,
  staticFrictionSlider,
  staticFrictionValue,
  kineticFrictionSlider,
  kineticFrictionValue,
];

function disableInputs() {
  allInputs.forEach((input) => (input.disabled = true));
}

function enableInputs() {
  allInputs.forEach((input) => (input.disabled = false));
}

function synchronizeSliderAndInput(slider, input, min, max) {
  slider.addEventListener("input", () => {
    input.value = slider.value;
    storePhysicsParameters();
  });

  input.addEventListener("blur", () => {
    validateInput(slider, input, min, max);
    storePhysicsParameters();
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      validateInput(slider, input, min, max);
      storePhysicsParameters();
    }
  });
}

function validateInput(slider, input, min, max) {
  let value = parseFloat(input.value);
  if (value < min) {
    alert(`Nilai tidak boleh kurang dari ${min}`);
    input.value = min;
    slider.value = min;
  } else if (value > max) {
    alert(`Nilai tidak boleh lebih dari ${max}`);
    input.value = max;
    slider.value = max;
  } else {
    slider.value = value;
  }
}

synchronizeSliderAndInput(massSlider, massValue, 1, 100);
synchronizeSliderAndInput(forceSlider, forceValue, 0, 1000);
synchronizeSliderAndInput(staticFrictionSlider, staticFrictionValue, 0, 0.99);
synchronizeSliderAndInput(kineticFrictionSlider, kineticFrictionValue, 0, 0.98);

function storePhysicsParameters() {
  updatedMass = parseFloat(massSlider.value);
  updatedForce = parseFloat(forceSlider.value);
  updatedStaticFriction = parseFloat(staticFrictionSlider.value);
  updatedKineticFriction = parseFloat(kineticFrictionSlider.value);
}

function applyStoredParameters() {
  mass = updatedMass;
  force = updatedForce;
  staticFriction = updatedStaticFriction;
  kineticFriction = updatedKineticFriction;
}

function updatePhysics() {
  const normalForce = mass * 9.8;

  const maxStaticFriction = staticFriction * normalForce;
  const kineticFrictionForce = kineticFriction * normalForce;

  if (force <= maxStaticFriction) {
    acceleration = 0;
    velocity = 0;
  } else {
    const netForce = force - kineticFrictionForce;
    acceleration = netForce / mass;
  }

  if (acceleration < 0) {
    acceleration = 0;
  }

  velocity += acceleration * 0.1;
  position += velocity * 0.1;

  accelerationOutput.innerText = acceleration.toFixed(2);
  velocityOutput.innerText = velocity.toFixed(2);

  drawSimulation();
}

function drawSimulation() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(0, canvas.height - 50);
  ctx.lineTo(canvas.width, canvas.height - 50);
  ctx.stroke();

  ctx.fillStyle = "#006d77";
  ctx.fillRect(position, canvas.height - 80, 50, 50);

  ctx.fillStyle = "#ffddd2";
  positionDots.forEach((dot, index) => {
    ctx.beginPath();
    ctx.arc(dot.x, canvas.height - 50, 5, 0, Math.PI * 2);
    ctx.fill();

    const textYPosition =
      index % 2 === 0 ? canvas.height - 60 : canvas.height - 40;
    ctx.fillStyle = "#000";
    ctx.font = "12px Arial";
    ctx.fillText(`${Math.round(dot.distance)} m`, dot.x - 10, textYPosition);
    ctx.fillStyle = "#ffddd2";
  });

  ctx.fillStyle = "#000";
  ctx.font = "16px Arial";
  ctx.fillText(`Kecepatan: ${velocity.toFixed(2)} m/s`, 10, 20);
}

function addPositionDot() {
  const distanceTravelled = Math.round(position);
  positionDots.push({ x: position, distance: distanceTravelled });
  if (positionDots.length > 100) positionDots.shift();
}

startBtn.onclick = () => {
  if (updatedKineticFriction > updatedStaticFriction) {
    alert(
      "Koefisien gaya gesek kinetik tidak boleh lebih besar dari koefisien gaya gesek statik!"
    );
    return;
  }

  if (!simulationStarted) {
    applyStoredParameters();
    simulationStarted = true;
    interval = setInterval(updatePhysics, 100);
    dotInterval = setInterval(addPositionDot, 1000);
    disableInputs();
    startBtn.disabled = true;
    startBtn.innerText = "Simulasi Berjalan";
  }
};

resetBtn.onclick = () => {
  clearInterval(interval);
  clearInterval(dotInterval);
  interval = null;
  simulationStarted = false;
  velocity = 0;
  position = 0;
  acceleration = 0;
  positionDots = [];
  accelerationOutput.innerText = "0";
  velocityOutput.innerText = "0";
  drawSimulation();
  enableInputs();
  startBtn.disabled = false;
  startBtn.innerText = "Mulai";
};

drawSimulation();

function checkAnswers() {
  const correctAnswers = {
    q1a: "Ya",
    q1b: "0.25",
    q2a: "1.25",
    q2b: "0.25",
    q3a: "Ya",
    q3b: "0.45",
  };

  let score = 0;

  for (let question in correctAnswers) {
    const userAnswer = document.querySelector(
      `select[name="${question}"], input[name="${question}"]`
    ).value;
    if (userAnswer.toLowerCase() === correctAnswers[question].toLowerCase()) {
      score++;
    }
  }

  const scoreDisplay = document.getElementById("scoreDisplay");
  scoreDisplay.innerHTML = `Kamu menjawab dengan benar ${score} dari ${
    Object.keys(correctAnswers).length
  } pertanyaan.`;
}

const saveBtn = document.getElementById("saveBtn");
let saveInProgress = false;

saveBtn.addEventListener("click", function () {
  if (saveInProgress) {
    console.log("Save in progress, please wait...");
    return;
  }

  saveInProgress = true;

  const simulationData = {
    mass: parseFloat(document.getElementById("mass").value),
    force: parseFloat(document.getElementById("force").value),
    staticFriction: parseFloat(document.getElementById("staticFriction").value),
    kineticFriction: parseFloat(
      document.getElementById("kineticFriction").value
    ),
    acceleration: parseFloat(document.getElementById("acceleration").innerText),
  };

  fetch(saveSimulationUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value,
    },
    body: JSON.stringify(simulationData),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((data) => {
      saveInProgress = false;
      if (data.success) {
        alert("Simulasi disimpan!");
      } else {
        alert("Gagal menyimpan simulasi.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      saveInProgress = false;
    });
});

const deleteHistoryBtn = document.getElementById("deleteHistoryBtn");

deleteHistoryBtn.addEventListener("click", function () {
  const deleteUrl = deleteHistoryBtn.getAttribute("data-url");
  fetch(deleteUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value,
    },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        alert("History deleted successfully!");
        document.querySelector("tbody").innerHTML = ""; // Clear the table
      } else {
        alert("Failed to delete history.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error deleting history.");
    });
});
