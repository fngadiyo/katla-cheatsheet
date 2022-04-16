const fs = require('fs')
const prompt = require('prompt-sync')()
const katlaList = 'katla-list.txt'

const mulaiProgram = () => {
    const hasil = 'hasil.txt'
    const input = prompt('huruf spasi warna: ')
    // contoh input: kuali bbgob
    // kuali merupakan kata yg ditulis di katla, bbogb adalah black black orange green black sesuai hasil katla
    if (input === 'done') return fs.unlinkSync(hasil)

    const splittedInput = input.split(' ')
    const semuaHuruf = splittedInput[0].split('')
    const semuaWarna = splittedInput[1].split('')

    semuaWarna.map((warna, i) => {
        const isHasilExist = fs.existsSync(hasil)
        const fileUntukLoop = fs.readFileSync(isHasilExist ? hasil : katlaList)
        const kumpulanKata = fileUntukLoop.toString().split(' ').map((line) => line.trim()).filter(Boolean)
        if (isHasilExist) fs.writeFileSync(hasil, '')

        if (warna === 'b') {
            kumpulanKata.map((kata) => {
                const subKata = kata.split('')
                const kataDihapus = subKata.includes(semuaHuruf[i])
                if (!kataDihapus) return fs.appendFileSync(hasil, `${kata} `)
            })
        }

        if (warna === 'g') {
            kumpulanKata.map((kata) => {
                const subKata = kata.split('')
                const posisiHurufBenar =  subKata[i].includes(semuaHuruf[i])
                if (posisiHurufBenar) return fs.appendFileSync(hasil, `${kata} `)
            })
        }

        if (warna === 'o') {
            kumpulanKata.map((kata) => {
                const subKata = kata.split('')
                const posisiHurufSalah = subKata[i].includes(semuaHuruf[i])
                const kemungkinanKataJawaban =  subKata.includes(semuaHuruf[i])
                if (kemungkinanKataJawaban && !posisiHurufSalah) return fs.appendFileSync(hasil, `${kata} `)
            })
        }

        if (i === semuaWarna.length - 1) {
            const hasilAkhir = fs.readFileSync('hasil.txt').toString().split(' ').map((line) => line.trim()).filter(Boolean)
            const kataPopuler = require('./popular-words.json')
            let hasilPopuler = {}
            hasilAkhir.map((hasil, i) => {
                const kata = kataPopuler[hasil]
                if (!!kata) {
                    hasilPopuler[hasil] = kata
                }
            })
            
            const isEmptyHasilPopuler = hasilPopuler && Object.keys(hasilPopuler).length === 0 && Object.getPrototypeOf(hasilPopuler) === Object.prototype
            let saranJawaban = ''
            let persenKemungkinan = 0
            if (!isEmptyHasilPopuler) {
                const semuaNilai = Object.values(hasilPopuler).sort((prev, next) => next - prev) // array
                const totalNilai = semuaNilai.reduce((prevValue, currValue) => prevValue+currValue)
                const kataHasilTerpopuler = Object.entries(hasilPopuler).reduce((max, entry) => entry[1] >= max[1] ? entry : max, [0, -Infinity]) // array
                saranJawaban = kataHasilTerpopuler[0]
                persenKemungkinan = kataHasilTerpopuler[1]/totalNilai*100
            }
            if (isEmptyHasilPopuler) {
                const randomisasiHasil = hasilAkhir.map(x => [Math.random(), x]).sort(([a], [b]) => a - b).map(([_, x]) => x)
                saranJawaban = randomisasiHasil[0] !== '' ? randomisasiHasil[0] : randomisasiHasil[1]
                persenKemungkinan = 1/hasilAkhir.length*100
            }
            console.log(`${saranJawaban}, kemungkinan benar ${persenKemungkinan.toFixed(2)}%`)
        }
    })
}

mulaiProgram()
