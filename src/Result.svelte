<script>
    import {uint8ArrayToHex, hex2bin, bin2dec, binf2decf, formatter, floatPoint} from './utils'
    export let value

    const buffer = new ArrayBuffer(8)
    const view_uint8 = new Uint8Array(buffer)
    const view_float64 = new Float64Array(buffer)

    let bitmap
    let hex, bin
    let type
    let s, e, f
    let MContent, EContent, AContent

    $: {
        view_float64[0] = value

        hex = uint8ArrayToHex(view_uint8)
        bin = hex2bin(hex)
        bitmap = bin.split('').map(i => Number(i))
        console.log(bin, bitmap)

        s = bin.slice(0, 1)
        e = bin.slice(1, 12)
        f = bin.slice(12)

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

        let M, E
        if (type === 'normalized') {
            M = `1.${f}`
            E = bin2dec(e) - 1023
            EContent = `e - Bias = ${bin2dec(e)} - 1023 = ${E}`
            MContent = `${formatter.toBin2(M)} (${binf2decf(M)})`
        } else if (type === 'denormalized') {
            M = `0.${f}`
            E = 1 - 1023
            EContent = `1 - Bias = 1 - 1023 = ${E}`
            MContent = `${formatter.toBin2(M)} (${binf2decf(M)})`
        }
        if (['normalized', 'denormalized'].includes(type)) {
            // AContent = `${formatter.toBin2(floatPoint(M, E))} (${binf2decf(floatPoint(M, E))})`
            AContent = `${formatter.toBin2(floatPoint(M, E))}`
        }
    }
</script>

<div class="box">
    <p>
        <span>Buffer View:</span>
        <span>{formatter.toHex(hex)}</span>
    </p>
    <p>
        <span>Bitmap:</span>
        <span>{formatter.toBin(bin)}</span>
    </p>

    <div class="diagram">
        {#each bitmap as bit}
            <div class="cell">{bit}</div>
        {/each}
    </div>

    <p>
        <span>category:</span>
        <span>{type}</span>
        {#if type === 'NaN'}
            <span style="color:red;">(NaN并不对应唯一的位模式，当前这个位模式取决于具体实现)</span>
        {/if}
    </p>
    <p>
        <span>s:</span>
        <span>{s + (s === '0' ? ' (+)' : ' (-)')}</span>
    </p>
    <p>
        <span>e:</span>
        <span>{@html `${formatter.toBin2(e)} = ${bin2dec(e)}`}</span>
    </p>
    <p>
        <span>f:</span>
        <span>{@html formatter.toBin2(f)}</span>
    </p>
    <p>
        <span>E:</span>
        <span>{EContent}</span>
    </p>
    <p>
        <span>M:</span>
        <span>{@html MContent}</span>
    </p>
    <p>
        <span>Actual Number:</span>
        <span id="actual">{@html AContent}</span>
    </p>
</div>


<style>
    .box {
        border: 1px solid darkcyan;
        border-radius: 4px;
        padding: 10px 20px;
        box-sizing: border-box;
        margin: 20px 0;
        position: relative;
    }

    .box::before {
        content: "result";
        position: absolute;
        right: 20px;
        color: brown;
    }

    #actual {
        word-break: break-all;
    }

    .diagram {
        display: flex;
        flex-wrap: wrap;
    }

    .diagram .cell {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 20px;
        box-sizing: border-box;
        font-size: 18px;
        padding: 5px;
        border: 1px solid #757575;
        margin-right: 5px;
        margin-top: 30px;
        margin-bottom: 20px;
    }

    .diagram > .cell:nth-child(1) {
        background-color: brown;
        color: white;
    }

    .diagram > .cell:nth-child(n+2):nth-child(-n+12) {
        background-color: darkcyan;
        color: white;
    }

    .diagram > .cell:nth-child(1)::before {
        content: "63";
        position: absolute;
        top: -25px;
        color: blue;
        font-size: 14px;
    }

    .diagram > .cell:nth-child(16)::before {
        content: "48";
        position: absolute;
        top: -25px;
        color: blue;
        font-size: 14px;
    }

    .diagram > .cell:nth-child(17)::before {
        content: "47";
        position: absolute;
        top: -25px;
        color: blue;
        font-size: 14px;
    }

    .diagram > .cell:nth-child(32)::before {
        content: "32";
        position: absolute;
        top: -25px;
        color: blue;
        font-size: 14px;
    }

    .diagram > .cell:nth-child(33)::before {
        content: "31";
        position: absolute;
        top: -25px;
        color: blue;
        font-size: 14px;
    }

    .diagram > .cell:nth-child(48)::before {
        content: "16";
        position: absolute;
        top: -25px;
        color: blue;
        font-size: 14px;
    }

    .diagram > .cell:nth-child(49)::before {
        content: "15";
        position: absolute;
        top: -25px;
        color: blue;
        font-size: 14px;
    }

    .diagram > .cell:nth-child(64)::before {
        content: "0";
        position: absolute;
        top: -25px;
        color: blue;
        font-size: 14px;
    }

    .diagram > .cell:nth-child(1)::after {
        content: "";
        display: block;
        position: absolute;
        z-index: 10;
        left: -4px;
        width: 198px;
        height: 135%;
        background-color: transparent;
        border: 1px dashed brown;
    }

    .diagram > .cell:nth-child(9)::after {
        content: "";
        display: block;
        position: absolute;
        z-index: 10;
        left: -4px;
        width: 198px;
        height: 135%;
        background-color: transparent;
        border: 1px dashed brown;
    }

    .diagram > .cell:nth-child(17)::after {
        content: "";
        display: block;
        position: absolute;
        z-index: 10;
        left: -4px;
        width: 198px;
        height: 135%;
        background-color: transparent;
        border: 1px dashed brown;
    }

    .diagram > .cell:nth-child(25)::after {
        content: "";
        display: block;
        position: absolute;
        z-index: 10;
        left: -4px;
        width: 198px;
        height: 135%;
        background-color: transparent;
        border: 1px dashed brown;
    }

    .diagram > .cell:nth-child(33)::after {
        content: "";
        display: block;
        position: absolute;
        z-index: 10;
        left: -4px;
        width: 198px;
        height: 135%;
        background-color: transparent;
        border: 1px dashed brown;
    }

    .diagram > .cell:nth-child(41)::after {
        content: "";
        display: block;
        position: absolute;
        z-index: 10;
        left: -4px;
        width: 198px;
        height: 135%;
        background-color: transparent;
        border: 1px dashed brown;
    }

    .diagram > .cell:nth-child(49)::after {
        content: "";
        display: block;
        position: absolute;
        z-index: 10;
        left: -4px;
        width: 198px;
        height: 135%;
        background-color: transparent;
        border: 1px dashed brown;
    }

    .diagram > .cell:nth-child(57)::after {
        content: "";
        display: block;
        position: absolute;
        z-index: 10;
        left: -4px;
        width: 198px;
        height: 135%;
        background-color: transparent;
        border: 1px dashed brown;
    }
</style>
