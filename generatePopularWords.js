const fs = require('fs')

const generatePopularWords = () => {
    return fs.readFile('sumber-bacaan.txt', 'utf-8', (err, data) => {
        if (err) console.log(err)
        let occurances = {};
        const dataArr = data.match(/\w{5,5}/g)


        for (let word of dataArr) {
            if (occurances[word.toLocaleLowerCase()]) {
            occurances[word.toLocaleLowerCase()]++;
            } else {
            occurances[word.toLocaleLowerCase()] = 1;
            }
        }

        let max = 0;
        let mostRepeatedWord = '';

        for (let word of dataArr) {
            if (occurances[word.toLocaleLowerCase()] > max) {
            max = occurances[word.toLocaleLowerCase()];
            mostRepeatedWord = word;
            }
        }
    
        return fs.writeFileSync('popular-words.json', JSON.stringify(occurances, null, "\t"))
    })
}

generatePopularWords()