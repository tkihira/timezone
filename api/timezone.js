const { createCanvas, registerFont } = require('canvas')

const fontSize = 50;
const margin = 5;
const width = 1000;
const separater = 400;

const timeZoneList = [
    ['東京', 'Asia/Tokyo'],
    ['San Francisco', 'America/Los_Angeles'],
    ['New York', 'America/New_York'],
    ['上海', 'Asia/Shanghai'],
    ['London', 'Europe/London'],
    ['Hawaii', 'Pacific/Honolulu']
];

module.exports = (req, res) => {
    const date = new Date();
    let currentTimeList = [];
    for(const [cityName, ianaDatabaseName] of timeZoneList) {
        currentTimeList.push([cityName, date.toLocaleString('ja-JP', {hour12:false, timeZone: ianaDatabaseName})])
    }
    const baseDate = currentTimeList[0][1].split(', ')[0];

    registerFont('./assets/japanese.otf', {family: 'Sans-serif'});
    const canvas = createCanvas(width, (fontSize + margin) * currentTimeList.length);
    const ctx = canvas.getContext('2d');
    ctx.font = `${fontSize}px Sans-serif`;
    ctx.textBaseline = 'bottom';
    for(let i = 0; i < currentTimeList.length; i++) {
        ctx.fillStyle = '#000';
        const [nameStr, timeStr] = currentTimeList[i];
        ctx.textAlign = 'right';
        ctx.fillText(nameStr + ": ", separater, margin + (i + 1) * (fontSize + margin));
        ctx.textAlign = 'left';
        ctx.fillText(timeStr, separater,  margin + (i + 1) * (fontSize + margin));
        if(timeStr.indexOf(baseDate) === -1) {
            ctx.fillStyle = '#800';
            ctx.fillText(timeStr.split(', ')[0], separater,  margin + (i + 1) * (fontSize + margin));
        }
    }
    const contextType = 'image/png';
    const buffer = canvas.toBuffer(contextType);

    res.statusCode = 200;
    res.setHeader('Content-Type', contextType);

    res.end(buffer);

};
