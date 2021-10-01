export const formatter = {
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

export function paddingTo(str, len) {
    return ('0'.repeat(len) + str).slice(-len)
}

export function uint8ArrayToHex(view_uint8) {
    const result = []
    for (let i = view_uint8.length - 1; i >= 0; i--) {
        result.push(paddingTo(view_uint8[i].toString(16).toUpperCase(), 2))
    }
    return result.join('')
}

export function hex2bin(hex) {
    let bin = ''
    hex.split('').forEach(digit => {
        bin += paddingTo(parseInt(digit, 16).toString(2), 4)
    })
    return bin
}

/**
 * 二进制整数转十进制整数
 * @param bin
 * @return {number}
 */
export function bin2dec(bin) {
    return parseInt(bin, 2)
}

/**
 * 二进制小数转十进制小数
 * @param bin
 */
export function binf2decf(bin) {
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
export function floatPoint(M, E) {
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

export function parseQuery() {
    const queries = window.location.search.replace(/^\?/, '').split('&').filter(q => q !== '').reduce((o, q) => {
        const parts = q.split('=')
        o[parts[0]] = parts[1]
        return o
    }, Object.create(null))
    return queries
}
