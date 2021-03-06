const fetch = require('node-fetch');
const parser = require('node-html-parser');
const lodash = require('lodash');

let arrowUrl = 'https://en.wikipedia.org/wiki/Arrow_(season_8)';
let theFlashUrl = 'https://en.wikipedia.org/wiki/The_Flash_(season_6)';
let supergirlUrl = 'https://en.wikipedia.org/wiki/Supergirl_(season_5)';
let legendsOfTomorrowUrl = 'https://en.wikipedia.org/wiki/Legends_of_Tomorrow_(season_5)';
let agentsOfShieldUrl = 'https://en.wikipedia.org/wiki/Agents_of_S.H.I.E.L.D._(season_7)';

function getListOfEpisodes(seriesName, seriesUrl) {
    let episodes = [];
    let season = seriesUrl.substring(seriesUrl.lastIndexOf('_') + 1, seriesUrl.lastIndexOf(')'));
    return new Promise(function (resolve, reject) {
        fetch(seriesUrl)
            .then(res => res.text())
            .then(body => {
                const dom = parser.parse(body);
                var nodeList = dom.querySelectorAll('tr.vevent td');
                let episode = {
                    'Series Name': seriesName,
                    'Season': season
                };
                let counter = 0;
                nodeList.forEach(function (node) {
                    counter++;
                    if (counter === 1) {
                        episode['Episode No.'] = node.rawText;
                        // console.log('1 - ' + node.rawText);
                    } else if (counter === 2) {
                        episode['Episode Name'] = node.rawText.substring(node.rawText.indexOf('"') + 1, node.rawText.lastIndexOf('"'));
                        // console.log('2 - ' + node.rawText);
                    } else if (counter === 5) {
                        let date = node.rawText;
                        episode['Original Air Date'] = date.substring(date.indexOf('(') + 1, date.lastIndexOf(')'));
                        if (episode['Original Air Date'].length < 10) {
                            episode['Original Air Date'] = '';
                        }
                        // console.log('5 - ' + node.rawText);
                    } else if ((seriesName === 'Agents of S.H.I.E.L.D.' && counter === 6) || counter === 7) {
                        episodes.push(episode);
                        counter = 0;
                        episode = {
                            'Series Name': seriesName,
                            'Season': season
                        };
                        // console.log('7 - ' + node.rawText);
                        // console.log('\n');
                    }
                });
                resolve(episodes);
            });
    });
}

let getEpisodes = async function getEpisodesInChronologicalOrder() {
    arrowResult = getListOfEpisodes('Arrow', arrowUrl);
    theFlashResult = getListOfEpisodes('The Flash', theFlashUrl);
    supergirlResult = getListOfEpisodes('Supergirl', supergirlUrl);
    legendsOfTomorrowResult = getListOfEpisodes('Legends of Tomorrow', legendsOfTomorrowUrl);
    agentsOfShieldResult = getListOfEpisodes('Agents of S.H.I.E.L.D.', agentsOfShieldUrl);

    return Promise.all([arrowResult, theFlashResult, supergirlResult, legendsOfTomorrowResult, agentsOfShieldResult]).then(function (values) {
        let episodes = lodash.flatten(values);
        episodes.sort(function (obj1, obj2) {

            let compareVal = 0;

            // Hacky logic to push episodes with no defined date to the end of the list.
            // Needs to be improved.
            if (obj1['Original Air Date'] === "" || obj1['Original Air Date'] === null || obj1['Original Air Date'].length < 10)
                compareVal = 1;
            if (obj2['Original Air Date'] === "" || obj2['Original Air Date'] === null || obj2['Original Air Date'].length < 10)
                compareVal = -1;
            if (obj1['Original Air Date'] === obj2['Original Air Date'])
                compareVal = 0;

            if (compareVal !== 0)
                return compareVal;

            if (obj1['Original Air Date'] > obj2['Original Air Date'])
                compareVal = 1;
            if (obj1['Original Air Date'] < obj2['Original Air Date'])
                compareVal = -1;

            if (compareVal !== 0)
                return compareVal;

            if (obj1['Series Name'] > obj2['Series Name'])
                compareVal = 1;
            if (obj1['Series Name'] < obj2['Series Name'])
                compareVal = -1;

            if (compareVal !== 0)
                return compareVal;

            if (parseInt(obj1['Episode No.']) > parseInt(obj2['Episode No.']))
                compareVal = 1;
            if (parseInt(obj1['Episode No.']) < parseInt(obj2['Episode No.']))
                compareVal = -1;

            return compareVal;
        });

        return episodes;
    });
}

// Function for running locally
async function printEpisodeList() {
    let episodeList = await getEpisodes();
    // Print all epsiodes
    console.table(episodeList);

    // Print only the episodes with a decided Airing Date
    // console.table(episodeList.filter(e => e['Original Air Date'] !== ''));
}

// Uncomment to run locally (useful for debugging)
// printEpisodeList();

module.exports.getEpisodesInChronologicalOrder = getEpisodes;