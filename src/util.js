const dayjs = require('dayjs');
var customParseFormat = require('dayjs/plugin/customParseFormat');

dayjs.extend(customParseFormat);

function range_date(stringDate){
    let listDate = []
    stringDate.split(",").map(                    
      function(e) {
        let between = e.split("-");
        if( between.length > 1) {
            let openTime = dayjs(between[0], 'DD/MM/YYYY');
            let closeTime = dayjs(between[1], 'DD/MM/YYYY');
            console.log(openTime.format('DD/MM/YYYY'));
            console.log(closeTime.format('DD/MM/YYYY'));
            let currentDate = openTime;
            let arrTime = [];
            while (currentDate.isBefore(closeTime) || currentDate.isSame(closeTime)) {
                arrTime.push(currentDate.format('DD/MM/YYYY'));
                currentDate = currentDate.add(1, 'day');
            }
            e = arrTime;
        };
        listDate = listDate.concat(e);
      }
    );
    return listDate.map(String);
}

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

module.exports.range_date = range_date;
module.exports.delay = delay;