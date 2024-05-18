const MAX_UNDO = 50;
let changes = [];
let currentIndex = 0;

function appInstance() {
  return $('#app');
}

function handleEventListeners() {
  $('.color').on('click', handleColorChange);
  $('#undo').on('click', undo);
  $('#redo').on('click', redo);
}

function handleColorChange() {
  const colorCode = $(this).data('value');
  const jsonData = getJsonData();
  jsonData.color = colorCode;
  const copied = {
    ...jsonData
  };

  setJsonData(copied);
  updateUI();
}

function applyChange(index) {
  const data = changes[index];
  setJsonData(data, true);
  updateUI();
}

function undo() {
  if (currentIndex >= 1) currentIndex -= 1;
  applyChange(currentIndex);
}

function redo() {
  if (currentIndex < changes.length - 1) {
    currentIndex++;
  }

  applyChange(currentIndex);
}

function getJsonData() {
  const app = $('#app');
  return app.data('json');
}

function setJsonData(data, undoRedo = false) {
  const app = appInstance();

  const copiedData = JSON.parse(JSON.stringify(data));

  if (!undoRedo) {
    if (changes.length <= MAX_UNDO) {
      currentIndex++;
      changes.push(copiedData);
    } else {
      changes.shift();
      changes.push(copiedData);
    }
  }

  app.data('json', data);
}

function updateUI(init = false) {
  const json = getJsonData();

  if (init) changes = [JSON.parse(JSON.stringify(json))];

  appInstance().css({
    'width': '100px',
    'height': '100px',
    'background-color': json.color
  });

  toggleButtons();
}

function toggleButtons() {
  if (currentIndex == 0) {
    $('#undo').attr('disabled', 'disabled');
  } else {
    $('#undo').removeAttr('disabled');
  }

  if (currentIndex == changes.length - 1) {
    $('#redo').attr('disabled', 'disabled');
  } else {
    $('#redo').removeAttr('disabled');
  }
}

function handleKeyboardShortcuts() {
  $(document).on('keydown', function (event) {
    event.preventDefault();

    if (event.ctrlKey && event.key == 'z') {
      undo();
    }

    if (event.ctrlKey && event.key == 'y') {
      redo();
    }
  });
}

function initApp() {
  updateUI(true);
  handleEventListeners();
  handleKeyboardShortcuts();
}

$(document).ready(initApp);