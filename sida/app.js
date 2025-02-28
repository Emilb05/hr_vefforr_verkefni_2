document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const replayBtn = document.getElementById('replay-btn');
    const resetBtn = document.getElementById('reset-btn');
    const failureModal = document.getElementById('failure-modal');
    const levelIndicator = document.getElementById('level-indicator');
    const highScore = document.getElementById('high-score');
    const pads = document.querySelectorAll('.pad');
  
    pads.forEach(pad => {
      pad.disabled = true;
    });
    replayBtn.disabled = true;
  
    let gameActive = false;
    let isSequencePlaying = false;
    let sequence = [];
    let currentStep = 0;
    let level = 1;
  
    const padToToneFunction = {
      "pad-red": playRTune,
      "pad-yellow": playYTune,
      "pad-green": playGTune,
      "pad-blue": playBTune,
    };

    const keyToPadId = {
        "q": "pad-red",
        "w": "pad-yellow",
        "a": "pad-green",
        "s": "pad-blue",
    };
  
    function getRandomPad() {
      const padIds = ["pad-red", "pad-yellow", "pad-green", "pad-blue"];
      return padIds[Math.floor(Math.random() * padIds.length)];
    }
  
    function addRandomPad() {
      sequence.push(getRandomPad());
    }
  
    function highlightPad(pad, duration) {
      pad.classList.add('active');
      setTimeout(() => {
        pad.classList.remove('active');
      }, duration);
    }
  
    function playSequence() {
      isSequencePlaying = true;
      currentStep = 0;
      sequence.forEach((padId, index) => {
        const pad = document.getElementById(padId);
        setTimeout(() => {
          highlightPad(pad, 500);
          padToToneFunction[padId]();
          if (index === sequence.length - 1) {
            setTimeout(() => {
              isSequencePlaying = false;
            }, 500);
          }
        }, index * 1000);
      });
    }
  
    function startGame() {
      sequence = [];
      level = 1;
      currentStep = 0;
      levelIndicator.textContent = level;
      if (level > highScore.textContent) {
        highScore.textContent = level;
    }
      addRandomPad();
      playSequence();
    }
  
    startBtn.addEventListener('click', () => {
      gameActive = true;
      pads.forEach(pad => {
        pad.disabled = false;
      });
      replayBtn.disabled = false;
      failureModal.style.display = "none";
      console.log("Game started! All pads are now active.");
      startGame();
    });
  
    pads.forEach(pad => {
      pad.addEventListener('click', () => {
        if (!gameActive || isSequencePlaying) return;
        highlightPad(pad, 300);
        const clickedPadId = pad.id;
        console.log(`Pad ${clickedPadId} clicked.`);
  
        if (clickedPadId === sequence[currentStep]) {
          currentStep++;
          if (currentStep === sequence.length) {
            level++;
            levelIndicator.textContent = level;
            if (level > highScore.textContent) {
                highScore.textContent = level;
            }
            addRandomPad();
            setTimeout(() => {
              playSequence();
            }, 1000);
          }
        } else {
          console.log("Wrong button clicked!");
          failureModal.style.display = "flex";
          gameActive = false;
          pads.forEach(p => p.disabled = true);
        }
      });
    });
    resetBtn.addEventListener('click', () => {
      failureModal.style.display = "none";
      gameActive = true;
      pads.forEach(pad => pad.disabled = false);
      startGame();
    });

  document.addEventListener('keydown', (event) => {
    if (!gameActive || isSequencePlaying) return;
    const key = event.key.toLowerCase();
    if (keyToPadId.hasOwnProperty(key)) {
      const padId = keyToPadId[key];
      const pad = document.getElementById(padId);
      pad.click();
    }
  });
  
    replayBtn.addEventListener('click', () => {
      if (!gameActive || isSequencePlaying) return;
      playSequence();
    });
  });
  const synth = new Tone.Synth().toDestination();
  
  const playRTune = () => {
    const now = Tone.now();
    synth.triggerAttackRelease("c4", "8n", now);
  };
  
  const playYTune = () => {
    const now = Tone.now();
    synth.triggerAttackRelease("d#4", "4n", now);
  };
  
  const playGTune = () => {
    const now = Tone.now();
    synth.triggerAttackRelease("e#4", "2n", now);
  };
  
  const playBTune = () => {
    const now = Tone.now();
    synth.triggerAttackRelease("f#4", "2n", now);
  };
  