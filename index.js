const buffer = new ArrayBuffer(8)
const view_uint8 = new Uint8Array(buffer)
const view_float64 = new Float64Array(buffer)

const btnEl = document.querySelector('#btn')
const inputEl = document.querySelector('#input')
const bufferViewEl = document.querySelector('#buffer_view')
const bitmapEl = document.querySelector('#bitmap')
const diagramEl = document.querySelector('#diagram')
const typeEl = document.querySelector('#type')
const sEl = document.querySelector('#s')
const eEl = document.querySelector('#e')
const expEl = document.querySelector('#exp')
const fEl = document.querySelector('#f')
const mEl = document.querySelector('#m')
const actualEl = document.querySelector('#actual')


btnEl.addEventListener('click', function (e) {
    e.preventDefault()
    const value = parseFloat(inputEl.value)
    parse(value)
}, false)

const formatter = {
    toHex(num) {
        return '0x' + num
    },
    toHex16(num) {
        return `${num}<sub>16</sub>`
    },
    toBin(num) {
        return '0b' + num
    },
    toBin2(num) {
        return `${num}<sub>2</sub>`
    }
}

function parse(value) {
    view_float64[0] = value

    const hex = uint8ArrayToHex(view_uint8)
    const bitmap = hex2bin(hex)

    bufferViewEl.textContent = formatter.toHex(hex)
    bitmapEl.textContent = formatter.toBin(bitmap)

    drawDiagramCell(bitmap)

    const s = bitmap.slice(0, 1)
    const e = bitmap.slice(1, 12)
    const f = bitmap.slice(12)

    let type
    if (!e.includes('0')) {
        // 指数位全为1
        if (f.includes('1')) {
            type = 'NaN'
        } else {
            type = 'Infinity'
        }
    } else if (!e.includes('1')) {
        // 指数位全为0
        type = 'denormalized'
    } else {
        type = 'normalized'
    }

    typeEl.textContent = type
    if (type === 'NaN') {
        typeEl.innerHTML = `${type} <span style="color:red;">(NaN并不对应唯一的位模式，当前这个位模式取决于具体实现)</span>`
    }
    sEl.textContent = s + (s === '0' ? ' (+)' : ' (-)')
    eEl.innerHTML = `${formatter.toBin2(e)} = ${bin2dec(e)}`
    fEl.innerHTML = formatter.toBin2(f)

    let M, E
    if (type === 'normalized') {
        M = `1.${f}`
        E = bin2dec(e) - 1023
        expEl.textContent = `e - Bias = ${bin2dec(e)} - 1023 = ${E}`
        mEl.innerHTML = `${formatter.toBin2(M)} (${binf2decf(M)})`
    } else if (type === 'denormalized') {
        M = `0.${f}`
        E = 1 - 1023
        expEl.textContent = `1 - Bias = 1 - 1023 = ${E}`
        mEl.innerHTML = `${formatter.toBin2(M)} (${binf2decf(M)})`
    }
    if (['normalized', 'denormalized'].includes(type)) {
        // actualEl.innerHTML = `${formatter.toBin2(floatPoint(M, E))} (${binf2decf(floatPoint(M, E))})`
        actualEl.innerHTML = `${formatter.toBin2(floatPoint(M, E))}`
    }
}

function paddingTo(str, len) {
    return ('0'.repeat(len) + str).slice(-len)
}

function uint8ArrayToHex(view_uint8) {
    const result = []
    for (let i = view_uint8.length - 1; i >= 0; i--) {
        result.push(paddingTo(view_uint8[i].toString(16).toUpperCase(), 2))
    }
    return result.join('')
}

function hex2bin(hex) {
    let bin = ''
    hex.split('').forEach(digit => {
        bin += paddingTo(parseInt(digit, 16).toString(2), 4)
    })
    return bin
}

function drawDiagramCell(bitmap) {
    diagramEl.innerHTML = ''

    bitmap.split('').forEach(digit => {
        const cellEl = document.createElement('div')
        cellEl.textContent = digit
        cellEl.className = 'cell'
        diagramEl.appendChild(cellEl)
    })
}

/**
 * 二进制整数转十进制整数
 * @param bin
 * @return {number}
 */
function bin2dec(bin) {
    return parseInt(bin, 2)
}

/**
 * 二进制小数转十进制小数
 * @param bin
 */
function binf2decf(bin) {
    const parts = bin.split('.')
    // console.log(parts)

    const f = parts[1].split('').reduce((acc, cur, idx) => {
        return acc + Number(cur) * 2 ** (-idx-1)
    }, 0)
    // console.log(f)

    return Number(parts[0]) + f
}

/**
 * 浮动小数点
 * @param M 尾数
 * @param E 阶码
 */
function floatPoint(M, E) {
    // console.log(`M: ${M}`)
    // console.log(`E: ${E}`)
    let mArray = M.split('')
    if (E > 52) {
        mArray = (M + '0'.repeat(E-51)).split('')
    } else if (E < 0) {
        mArray = ('0'.repeat(-E) + M).split('')
    }
    if (E > 0) {
        // 向右移动小数点
        for (let i = 0; i < E; i++) {
            swap(mArray, i+1, i+2)
        }
        return mArray.join('')
    } else if (E < 0) {
        // 向左移动小数点
        for (let i = -E; i > 0; i--) {
            swap(mArray, i, i+1)
        }
        return mArray.join('')
    } else {
        // 不需要移动
        return M
    }
}

function swap(arr, i, j) {
    const temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
}
