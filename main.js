const MAX_UNDO     = 50;
let   changes      = [];
let   currentIndex = 0;

function appInstance() {
  return $('#app');
}

function undo() {
  if (currentIndex >= 1) currentIndex -= 1;

  const object = changes[currentIndex];
  setJsonData(object, true);
  updateUI();
}

function redo() {
  if(currentIndex < changes.length - 1) {
    currentIndex++;
  }

  const object = changes[currentIndex];
  setJsonData(object, true);
  updateUI();
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


  if(init) changes = [JSON.parse(JSON.stringify(json))];

  appInstance().css({
    'width': '100px',
    'height': '100px',
    'background-color': json.color
  });

  if(currentIndex == 0) {
    $('#undo').attr('disabled', 'disabled');
  } else {
    $('#undo').removeAttr('disabled');
  }
  
  if(currentIndex == changes.length - 1) {
    $('#redo').attr('disabled', 'disabled');
  } else {
    $('#redo').removeAttr('disabled');
  }
}

updateUI(true);

$('.color').on('click', function () {
  const colorCode = $(this).data('value');
  const jsonData = getJsonData();
  jsonData.color = colorCode;
  const copied = {
    ...jsonData
  };

  setJsonData(copied);
  updateUI();
});

$('#undo').on('click', undo);
$('#redo').on('click', redo);
