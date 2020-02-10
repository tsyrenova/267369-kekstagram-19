'use strict';

var ADD_MESSAGES = ['В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Всё отлично!'];

var ADD_NAMES = ['Артем', 'Валерия', 'Игорь', 'Даниил', 'Анна', 'Александра', 'Мария', 'Валентин'];
var COUNT_OBJECT = 25;

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

console.log(pictures);
