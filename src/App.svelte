<script>
    import Form from './Form.svelte'
    import Params from './Params.svelte'
    import Result from "./Result.svelte"
    // let size = 64
    // let sizeOptions = [32, 64]
    // let number = 12
    let bit
    let value


    function inspect(e) {
        console.log(e.detail)
        bit = e.detail.bit
        value = e.detail.value
    }
</script>

<h1>IEEE754 Number Internal</h1>

<Form on:inspect={inspect}/>

<Params bind:bit/>

<Result {value}/>

<style>
    h1 {
        text-align: center;
    }
</style>
