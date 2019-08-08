const handleSocketAPIRoute = require('utils/socketAPI/handleSocketAPIRoute');
const appCategories = require('utils/freedesktop.org/appCategories');

const requestAppCategories = async (options = {}, ack) => {
  return /*await*/ handleSocketAPIRoute(/*async*/ () => {
    return appCategories;
  }, ack);
};

module.exports = requestAppCategories;