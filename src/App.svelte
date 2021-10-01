<script>
    import {onMount} from 'svelte'
    import {parseQuery} from './utils'
    import Form from './Form.svelte'
    import Params from './Params.svelte'
    import Result from "./Result.svelte"

    let bit
    let value

    onMount(() => {
        const {val = 37} = parseQuery()
        value = val
    })

    function inspect(e) {
        bit = e.detail.bit
        value = e.detail.value
    }
</script>

<h1>IEEE754 Number Internal</h1>

<Form bind:value on:inspect={inspect}/>

<Params {bit}/>

<Result {value}/>

<style>
    h1 {
        text-align: center;
    }
</style>
