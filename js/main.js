'use strict';

var ADD_MESSAGES = ['В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Всё отлично!'];

var ADD_NAMES = ['Артем', 'Валерия', 'Игорь', 'Даниил', 'Анна', 'Александра', 'Мария', 'Валентин'];
var COUNT_OBJECT = 25;
var ESCAPE = 'Escape';
var STEP_SCALE = 25;
var MIN_SCALE_VALUE = 0;
var MAX_SCALE_VALUE = 100;
var SEPARATOR = ' ';
var REG_EXP = /^#[а-яё,a-z,0-9]{1,19}$/i;

var containerForPicture = document.querySelector('.pictures');
var pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomMessage() {
  return ADD_MESSAGES [getRandomNumber(0, ADD_MESSAGES.length - 1)];
}

function getRandomName() {
  return ADD_NAMES [getRandomNumber(0, ADD_NAMES.length - 1)];
}

function getRandomComments() {
  var data = [];
  var numberRandom = getRandomNumber(3, 10);
  for (var i = 0; i < numberRandom; i++) {
    data.push({
      avatar: 'img/avatar-' + i + '.svg',
      message: getRandomMessage(),
      name: getRandomName()
    });
  }
  return data;
}

function getMessages(countMessages) {
  var arr = [];
  for (var i = 1; i <= countMessages; i++) {
    arr.push({
      url: 'photos/' + i + '.jpg',
      description: 'красиво',
      likes: getRandomNumber(15, 200),
      comments: getRandomComments()
    });
  }
  return arr;
}

var pictures = getMessages(COUNT_OBJECT);

var renderOnePicture = function (picture) {
  var pictureElement = pictureTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = picture.url;
  pictureElement.querySelector('.picture__likes').textContent = picture.likes;
  pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;

  return pictureElement;
};

var renderPictures = function () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < pictures.length; i++) {
    fragment.appendChild(renderOnePicture(pictures[i]));
  }
  containerForPicture.appendChild(fragment);
};

renderPictures();

var uploadFile = document.querySelector('#upload-file');
var uploadOverlay = document.querySelector('.img-upload__overlay');
var uploadCancel = document.querySelector('#upload-cancel');
var modalOpen = document.querySelector('body');

function onEscapePass(evt) {
  if (evt.key === ESCAPE && evt.target.className !== 'text__hashtags') {
    uploadOverlay.classList.add('hidden');
    modalOpen.classList.remove('modal-open');
    uploadFile.value = '';
  }
}

function onUploadOverlayChange() {
  uploadOverlay.classList.remove('hidden');
  modalOpen.classList.add('modal-open');
  document.addEventListener('keydown', onEscapePass);
}

uploadFile.addEventListener('change', onUploadOverlayChange);

uploadCancel.addEventListener('click', function () {
  uploadOverlay.classList.add('hidden');
});

var controlSmaller = document.querySelector('.scale__control--smaller');
var controlBigger = document.querySelector('.scale__control--bigger');
var controlValue = document.querySelector('.scale__control--value');
var imgUploadPreview = document.querySelector('.img-upload__preview img');
var effectsList = document.querySelector('.effects__list');
var effectCurrent = 'effects__preview--none';
var effectLevelPin = document.querySelector('.effect-level__pin');
var effectLevelLine = document.querySelector('.effect-level__line');
var effectLevelValue = document.querySelector('.effect-level__value');
var imgUploadEffectLevel = document.querySelector('.img-upload__effect-level');
imgUploadEffectLevel.classList.add('hidden');

var COLOR_EFFECTS = {
  'effect-none': {
    className: 'effects__preview--none'
  },
  'effect-chrome': {
    className: 'effects__preview--chrome',
    filterName: 'grayscale',
    maxLevelIntensity: 1
  },
  'effect-sepia': {
    className: 'effects__preview--sepia',
    filterName: 'sepia',
    maxLevelIntensity: 1
  },
  'effect-marvin': {
    className: 'effects__preview--marvin',
    filterName: 'invert',
    maxLevelIntensity: 100,
    unitMeasurement: '%'
  },
  'effect-phobos': {
    className: 'effects__preview--phobos',
    filterName: 'blur',
    maxLevelIntensity: 3,
    unitMeasurement: 'px'
  },
  'effect-heat': {
    className: 'effects__preview--heat',
    filterName: 'brightness',
    maxLevelIntensity: 3,
  }
};

controlValue.value = '100%';
var resultControlValue = parseInt(controlValue.value, 10);

function changeTransformScale(value) {
  imgUploadPreview.style.transform = 'scale(' + value / 100 + ')';
}

function onControlSmallerClick() {
  if (resultControlValue > MIN_SCALE_VALUE) {
    resultControlValue = resultControlValue - STEP_SCALE;
    controlValue.value = resultControlValue + '%';
    changeTransformScale(resultControlValue);
  }
}

function onControlBiggerClick() {
  if (resultControlValue < MAX_SCALE_VALUE) {
    resultControlValue = resultControlValue + STEP_SCALE;
    controlValue.value = resultControlValue + '%';
    changeTransformScale(resultControlValue);
  }
}

controlSmaller.addEventListener('click', onControlSmallerClick);

controlBigger.addEventListener('click', onControlBiggerClick);

function addEffect(nameEffect) {
  imgUploadEffectLevel.classList.remove('hidden');
  imgUploadPreview.classList.remove(effectCurrent);
  imgUploadPreview.style.filter = '';
  imgUploadPreview.classList.add(COLOR_EFFECTS[nameEffect].className);
  effectCurrent = COLOR_EFFECTS[nameEffect].className;

  effectLevelPin.addEventListener('mouseup', function () {
    setValueFilter(nameEffect);
  });
}

function setValueFilter(nameFilter) {
  var effectOptions;
  effectOptions = COLOR_EFFECTS[nameFilter];
  var coordsPin = effectLevelPin.getBoundingClientRect();
  var coordsLine = effectLevelLine.getBoundingClientRect();
  var positionPin = coordsPin.x - coordsLine.x - coordsPin.width / 2;
  var valueIntensity = (positionPin * effectOptions.maxLevelIntensity / coordsLine.width).toFixed(2);
  effectLevelValue.value = valueIntensity + '';
  if (effectOptions['unitMeasurement']) {
    imgUploadPreview.style.filter = effectOptions.filterName + '(' + valueIntensity + effectOptions.unitMeasurement + ')';
  } else {
    imgUploadPreview.style.filter = effectOptions.filterName + '(' + valueIntensity + ')';
  }
}

effectsList.addEventListener('click', function () {
  var inputRadioId = document.activeElement.id;
  switch (inputRadioId) {
    case 'effect-chrome':
      addEffect(inputRadioId);
      break;
    case 'effect-sepia':
      addEffect(inputRadioId);
      break;
    case 'effect-marvin':
      addEffect(inputRadioId);
      break;
    case 'effect-phobos':
      addEffect(inputRadioId);
      break;
    case 'effect-heat':
      addEffect(inputRadioId);

      break;
    case 'effect-none':
      addEffect(inputRadioId);
      imgUploadEffectLevel.classList.add('hidden');
      break;
  }
});

function isRepeatingElements(array, query) {
  var filteredItems = array.filter(function (el) {
    return el === query;
  });
  return filteredItems.length !== 1;
}

function onTextHashtagInput() {
  var arrayHashtags = textHashtags.value.split(SEPARATOR);
  for (var i = 0; i < arrayHashtags.length; i++) {
    if (arrayHashtags[i].search(REG_EXP) !== 0 || isRepeatingElements(arrayHashtags, arrayHashtags[i]) || arrayHashtags.length > 5) {
      textHashtags.setCustomValidity('хэштег введен неверно');
    } else {
      textHashtags.setCustomValidity('');
    }
  }
}

var textHashtags = document.querySelector('.text__hashtags');
textHashtags.addEventListener('input', onTextHashtagInput);
