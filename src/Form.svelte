<script>
    import {createEventDispatcher} from 'svelte'

    export let bit = 32
    export let value

    const bitOptions = [32, 64]

    const dispatch = createEventDispatcher()

    function inspect() {
        dispatch('inspect', {bit, value})
    }
</script>

<form>
    <label>数字位数：
        <select bind:value={bit}>
            {#each bitOptions as option}
                <option value={option}>{option}</option>
            {/each}
        </select>
    </label>
    <label>Number: <input type="text" bind:value={value}></label>
    <button on:click|preventDefault={inspect}>Inspect</button>
</form>

<style>
    form {
        display: flex;
        border: 1px solid darkcyan;
        border-radius: 4px;
        padding: 10px 20px;
        box-sizing: border-box;
        margin: 20px 0;
    }

    form label {
        flex: 1;
        display: flex;
        align-items: center;
        padding-right: 20px;
    }

    form input {
        flex: 1;
        padding: 5px 10px;
        font-size: 18px;
        margin-left: 10px;
    }

    form select {
        width: 200px;
        padding: 5px 10px;
        font-size: 18px;
    }

    form button {
        padding: 5px 20px;
        font-size: 16px;
    }
</style>
