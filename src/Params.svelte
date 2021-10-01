<script>
    export let bit = 32
    let k
    let n

    $: {
        if (bit === 32) {
            k = 8
            n = 23
        } else if (bit === 64) {
            k = 11
            n = 52
        }
    }
</script>

<div class="box">
    <p>
        <span>阶码位 k = </span>
        <span>{k}</span>
    </p>
    <p>
        <span>尾数位 n = </span>
        <span>{n}</span>
    </p>
    <p>
        <span>Bias = </span>
        <span>2<sup>k-1</sup>-1 = 2<sup>{k}-1</sup> = {2**(k-1) - 1}</span>
    </p>
    <p>
        <span>formula：</span>
        <span class="formula">V = (-1)<sup>s</sup> * M * 2<sup>E</sup></span>
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
        content: "parameter(64bit)";
        position: absolute;
        right: 20px;
        color: brown;
    }
    .formula {
        color: blue;
        font-weight: bold;
    }
</style>
