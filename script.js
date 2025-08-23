document.getElementById("menu-cat").style["border"] = "2px solid #5cb85c"
document.getElementById("puzzle-game").style["display"] = "none";
document.getElementById("vote-stars").style["display"] = "none";

// Variables para el control del tiempo y el conteo de clics
let lastKeyPressTime = 0;
let keyPressCount = 0;

// Tiempo en milisegundos durante el cual se bloquearán las acciones después de un evento
const timeThreshold = 1000; // 1 segundo

// Número máximo de acciones permitidas en el tiempoThreshold
const maxActionsAllowed = 3; // Puedes ajustar esto según tus necesidades

// Función para manejar la detección de spam
function handleSpamDetection(event) {
  const currentTime = Date.now();

  // Bloquear eventos de teclas (espacio y Enter) si se pulsan con demasiada frecuencia
  if (event.type === 'keydown' && (event.key === ' ' || event.key === 'Enter')) {
    if (currentTime - lastKeyPressTime < timeThreshold) {
      event.preventDefault();
      return;
    }
  }

  // Bloquear autoclickers detectando clics excesivos en un corto período de tiempo
  if (event.type === 'click') {
    keyPressCount++;
    if (keyPressCount >= maxActionsAllowed) {
      event.preventDefault();
      return;
    }

    // Reiniciar el contador después de un período de tiempo
    setTimeout(() => {
      keyPressCount = 0;
    }, timeThreshold);
  }

  lastKeyPressTime = currentTime;
}

// Agregar detectores de eventos para teclas y clics
document.addEventListener('keydown', handleSpamDetection);
document.addEventListener('click', handleSpamDetection);

function ajax_get(url, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        try {
          var data = JSON.parse(xmlhttp.responseText);
          localStorage.setItem("viewed_cats", Number(localStorage.getItem("viewed_cats"))+1);
          document.getElementById("viewed_cats").innerHTML = localStorage.getItem("viewed_cats");
          const randomNumber = Math.floor(Math.random() * 200); // Genera un número aleatorio entre 0 y 199
          if (randomNumber === 199) { // Ejecuta el código cuando el número aleatorio es igual a 199
            document.getElementById("vote-stars").style["display"] = "inline-block";
          }
          updateEmojis();
        } catch (err) {
          console.log(err.message + " in " + xmlhttp.responseText);
          return;
        }
        callback(data);
      }
    };
  
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

ajax_get('https://api.thecatapi.com/v1/images/search?size=full', function(data) {
        var html = '<img src="' + data[0]["url"] + '" width="100%" height="100%" style="object-fit: cover;">';
        document.getElementById("cats").innerHTML = html;
});

document.getElementById("next").addEventListener("click", function() {
    ajax_get('https://api.thecatapi.com/v1/images/search?size=full', function(data) {
        var html = '<img src="' + data[0]["url"] + '" width="100%" height="100%" style="object-fit: cover;">';
        document.getElementById("cats").innerHTML = html;
    });
});

document.getElementById("close-vote-button").addEventListener("click", function() {
  document.getElementById("vote-stars").style["display"] = "none";
});


var emojis = document.getElementsByClassName("emoji-button");

for(var i=0; i<emojis.length; i++) {
    emojis[i].addEventListener("click", emojisClick);
}


function emojisClick(e){
    let emoji = this;
    emoji.classList.add("fade-out");
    ajax_get('https://api.thecatapi.com/v1/images/search?size=full', function(data) {
        var html = '<img src="' + data[0]["url"] + '" width="100%" height="100%" style="object-fit: cover;">';
        document.getElementById("cats").innerHTML = html;
        emoji.classList.remove("fade-out");
    });
}

updateEmojis();

function updateEmojis(){
  let views = Number(localStorage.getItem("viewed_cats"));
  if(views >= 50){
    document.getElementById('emoji1').disabled = false;
  }else{
    document.getElementById('emoji1').disabled = true;
    document.getElementById('emoji1').title = "Watch 50 cats to unlock this reaction.";
  }

  if(views >= 100){
    document.getElementById('emoji2').disabled = false;
  }else{
    document.getElementById('emoji2').disabled = true;
    document.getElementById('emoji2').title = "Watch 100 cats to unlock this reaction.";
  }

  if(views >= 200){
    document.getElementById('emoji3').disabled = false;
  }else{
    document.getElementById('emoji3').disabled = true;
    document.getElementById('emoji3').title = "Watch 200 cats to unlock this reaction.";
  }

  if(views >= 400){
    document.getElementById('emoji4').disabled = false;
  }else{
    document.getElementById('emoji4').disabled = true;
    document.getElementById('emoji4').title = "Watch 400 cats to unlock this reaction.";
  }

  if(views >= 500){
    document.getElementById('emoji5').disabled = false;
  }else{
    document.getElementById('emoji5').disabled = true;
    document.getElementById('emoji5').title = "Watch 500 cats to unlock this reaction.";
  }
}

document.getElementById("menu-puzzle").addEventListener("click", function() {
  document.getElementById("menu-cat").style["border"] = "1px solid #b2b2b2";
  document.getElementById("menu-puzzle").style["border"] = "2px solid #5cb85c";
  document.getElementById("cats").style["display"] = "none";
  document.getElementById("cats-info").style["display"] = "none";
  document.getElementById("puzzle-game").style["display"] = "block";
  puzzle();
});

document.getElementById("menu-cat").addEventListener("click", function() {
  document.getElementById("menu-puzzle").style["border"] = "1px solid #b2b2b2";
  document.getElementById("menu-cat").style["border"] = "2px solid #5cb85c";
  document.getElementById("puzzle-game").style["display"] = "none";
  document.getElementById("cats").style["display"] = "block";
  document.getElementById("cats-info").style["display"] = "block";
});
var response;
var imageURL;
async function puzzle(){
  var shuffle_ask = false;
  if(imageURL == "" || imageURL == null || imageURL == undefined){
    showLoader();
    response = await fetch('https://api.thecatapi.com/v1/images/search?size=full'); // Reemplaza la URL con la API real
    imageURL = await response.json();
    imageURL = imageURL[0]["url"];
    shuffle_ask = true;
  }
  let gridSize = 3; // Tamaño del rompecabezas (filas x columnas)
  let imageWidth = 200; // Ancho de cada pieza del rompecabezas
  let imageHeight = 200; // Alto de cada pieza del rompecabezas
  let pieces = [];
  let emptyIndex;

  function startGame() {
  
    /*const difficulty = parseInt(document.getElementById('difficulty').value);

    if (isNaN(difficulty)) {
        alert('Por favor, seleccione un nivel de dificultad válido.');
        return;
    }

    gridSize = difficulty;*/
    if(shuffle_ask){
      loadImage(imageURL, () => {
        hideLoader();
        createPuzzle(imageURL);
        shufflePuzzle();
    });
    }else{
      hideLoader();
    }
  }
  function showLoader() {
    const loaderContainer = document.getElementById('loader-container');
    loaderContainer.style.display = 'block';
}

function hideLoader() {
    const loaderContainer = document.getElementById('loader-container');
    loaderContainer.style.display = 'none';
}
  function loadImage(url, callback) {
    const img = new Image();
    img.src = url;
    img.onload = callback;
}


function createPuzzle(imageURL) {
  const puzzleContainer = document.getElementById('puzzle');
  puzzleContainer.innerHTML = '';
  puzzleContainer.style.width = `${imageWidth}px`;
  puzzleContainer.style.height = `${imageHeight}px`;

  const pieceWidth = imageWidth / gridSize;
  const pieceHeight = imageHeight / gridSize;

  pieces = [];
  for (let i = 0; i < gridSize * gridSize; i++) {
      const piece = document.createElement('div');
      piece.className = 'puzzle-piece';
      piece.style.width = `${pieceWidth}px`;
      piece.style.height = `${pieceHeight}px`;
      piece.style.backgroundSize = `${imageWidth}px ${imageHeight}px`;

      // Clonar la imagen de fondo
      const backgroundImage = document.createElement('div');
      backgroundImage.className = 'background-image';
      backgroundImage.style.backgroundImage = `url(${imageURL})`;
      backgroundImage.style.backgroundSize = `${imageWidth}px ${imageHeight}px`;
      backgroundImage.style.width = `${pieceWidth}px`;
      backgroundImage.style.height = `${pieceHeight}px`;
      backgroundImage.style.backgroundPosition = `-${(i % gridSize) * pieceWidth}px -${Math.floor(i / gridSize) * pieceHeight}px`;

      // Agregar identificador numérico a la pieza
      const pieceNumber = document.createElement('div');
      pieceNumber.className = 'piece-number';
      pieceNumber.textContent = i + 1;
      piece.appendChild(backgroundImage);
      piece.appendChild(pieceNumber);
  

      piece.addEventListener('click', () => {
          movePiece(i);
      });

      puzzleContainer.appendChild(piece);
      pieces.push(piece);
  }
  emptyIndex = pieces.length - 1;
  pieces[emptyIndex].classList.add('empty');
}

function shufflePuzzle() {
  do {
      for (let i = pieces.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          if (i !== emptyIndex && j !== emptyIndex) {
              swapPieces(i, j);
          }
      }
  } while (!isSolvable());
}

function isSolvable() {
  // Contar el número de inversiones
  let inversions = 0;
  for (let i = 0; i < pieces.length; i++) {
      for (let j = i + 1; j < pieces.length; j++) {
          if (
              pieces[i].querySelector('.piece-number').textContent > pieces[j].querySelector('.piece-number').textContent &&
              pieces[i] !== emptyIndex && pieces[j] !== emptyIndex
          ) {
              inversions++;
          }
      }
  }

  // Comprobar si la paridad es la misma que en un rompecabezas resuelto
  if (gridSize % 2 === 1) {
      return inversions % 2 === 0;
  } else {
      const emptyRow = Math.floor(emptyIndex / gridSize);
      if (emptyRow % 2 === 0) {
          return inversions % 2 === 1;
      } else {
          return inversions % 2 === 0;
      }
  }
}

function movePiece(index) {
  if (canMove(index)) {
    swapPieces(index, emptyIndex, true);
    emptyIndex = index;
    if (checkWin()) {
        return; // Detener el juego si se ha completado el rompecabezas
    }
}
}

function canMove(index) {
  const row = Math.floor(index / gridSize);
  const col = index % gridSize;
  const emptyRow = Math.floor(emptyIndex / gridSize);
  const emptyCol = emptyIndex % gridSize;

  return (Math.abs(row - emptyRow) === 1 && col === emptyCol) || (Math.abs(col - emptyCol) === 1 && row === emptyRow);
}

function swapPieces(i, j, vol) {
  if(vol){
    const pieceI = pieces[i];
    const pieceJ = pieces[j];

    // Obtener las posiciones originales
    const positionI = getPiecePosition(pieceI);
    const positionJ = getPiecePosition(pieceJ);

    // Calcular la diferencia entre las posiciones
    const dx = positionJ.x - positionI.x;
    const dy = positionJ.y - positionI.y;

    
  }
  pieces[i].classList.remove('empty');
  pieces[j].classList.add('empty');

  const tempBackground = pieces[i].querySelector('.background-image').style.backgroundPosition;
  pieces[i].querySelector('.background-image').style.backgroundPosition = pieces[j].querySelector('.background-image').style.backgroundPosition;
  pieces[j].querySelector('.background-image').style.backgroundPosition = tempBackground;

  // Intercambiar números identificadores
  const tempNumber = pieces[i].querySelector('.piece-number').textContent;
  pieces[i].querySelector('.piece-number').textContent = pieces[j].querySelector('.piece-number').textContent;
  pieces[j].querySelector('.piece-number').textContent = tempNumber;
}
function getPiecePosition(piece) {
  const rect = piece.getBoundingClientRect();
  return {
      x: rect.left - document.getElementById("puzzle").getBoundingClientRect().left,
      y: rect.top - document.getElementById("puzzle").getBoundingClientRect().top,
  };
}
function checkWin() {
  for (let i = 0; i < pieces.length; i++) {
      const piece = pieces[i];
      const currentBackgroundPosition = piece.querySelector('.background-image').style.backgroundPosition;
      const currentLeft = parseInt(currentBackgroundPosition.split(' ')[0]);
      const currentTop = parseInt(currentBackgroundPosition.split(' ')[1]);
      const correctX = i % gridSize * (imageWidth / gridSize);
      const correctY = Math.floor(i / gridSize) * (imageHeight / gridSize);
      // Comparamos las coordenadas de la pieza con las coordenadas correctas
      if (currentLeft !== correctX || currentTop !== correctY) {
          return false;
      }
  }

  alert('¡Felicidades! Has resuelto el rompecabezas.');
  return true;
}



// Iniciar el juego por defecto
startGame();}