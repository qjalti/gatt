/**
 * Блок подключения модулей
 */
const express = require('express');
const CONFIG = require('config');
const BODY_PARSER = require('body-parser');
const PATH = require('path');

/**
 * Блок определения констант
 */
const APP = express();

if (process.env.NODE_ENV === 'production') {
  APP.use('/', express.static(PATH.join(__dirname, 'react-ta', 'build')));
  APP.get('*', (req, res) => {
    res.sendFile(PATH.resolve(__dirname, 'react-ta', 'build', 'index.html'));
  });
}

const PORT = CONFIG.get('port');

/**
 * Блок алгоритма работы приложения
 */

/**
 * Настройки Express
 */
APP.use(BODY_PARSER.json());

/**
 * Запуск сервера
 */
APP.listen(PORT, () => {
  console.log(`App backend successful started on port ${PORT}...`);
});