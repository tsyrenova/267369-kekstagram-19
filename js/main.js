'use strict';

var ADD_MESSAGE = ['В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Всё отлично!'];

var ADD_NAME = ['Артем', 'Валерия', 'Игорь', 'Даниил', 'Анна', 'Александра', 'Мария', 'Валентин'];

var containerForPicture = document.querySelector('.pictures');
var pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getMessage() {
  return ADD_MESSAGE [getRandomNumber(0, ADD_MESSAGE.length - 1)];
}

function getName() {
  return ADD_NAME [getRandomNumber(0, ADD_NAME.length - 1)];
}

function getComments() {
  var data = [];
  for (var i = 0; i < getRandomNumber(3, 10); i++) {
    data.push({
      avatar: 'img/avatar-' + i + '.svg',
      message: getMessage(),
      name: getName()
    });
  }
  return data;
}

function getObjects(countObjects) {
  var arr = [];
  for (var i = 1; i <= countObjects; i++) {
    arr.push({
      url: 'photos/' + i + '.jpg',
      description: 'красиво',
      likes: getRandomNumber(15, 200),
      comments: getComments()
    });
  }
  return arr;
}

var pictures = getObjects(25);

var renderPictures = function (picture) {
  var pictureElement = pictureTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = picture.url;
  pictureElement.querySelector('.picture__likes').textContent = picture.likes;
  pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;

  return pictureElement;
};

var fragment = document.createDocumentFragment();
for (var i = 0; i < pictures.length; i++) {
  fragment.appendChild(renderPictures(pictures[i]));
}
containerForPicture.appendChild(fragment);
