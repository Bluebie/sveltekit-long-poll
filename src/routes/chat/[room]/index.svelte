<script context="module">
  // make [room] in url available as a room property
  /** @type {import('./__types/index').Load} */
  export function load ({ params }) {
    return { props: params }
  }
</script>
<script>
  import logLoader from '$lib/long-poll/log-loader'
  import { nanoid } from 'nanoid';
  import { onMount } from 'svelte'

  let myName = `user-${nanoid()}`
  let myMessage = ''
  /** @type {string} */
  export let room
  const endpointURL = `/chat/${room}/endpoint`

  /** @type {import('$lib/long-poll/log').default}*/
  let log

  onMount(() => {
    log = logLoader(endpointURL)
    return () => log.destroy()
  })

  /**
   * handle form submit
   * @param {SubmitEvent} event
   */
  async function sendMessage (event) {
    event.preventDefault() // tell the browser to not submit the form in the normal way
    await fetch(endpointURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: myName, message: myMessage })
    })
    myMessage = ''
  }
</script>
{#if log}
  <!-- log wont exist on server side load, so it will be setup on mount -->
  <dl>
    {#each $log as value}
      <dt>{value.name}</dt>
      <dd>{value.message}</dd>
    {/each}
  </dl>
{/if}

<form on:submit={sendMessage}>
  <input type=text id=username bind:value={myName}>
  <input type=text id=message bind:value={myMessage}>
  <button type=submit>Send</button>
</form>

<style>
  dl {
    display: grid;
    grid-template-columns: max-content auto;
  }

  dl dt { grid-column: 1 }
  dl dd { grid-column: 2 }

  form {
    display: flex
  }

  input#username { width: 10em }
  input#message { flex-grow: 1 }
  button[type=submit] { width: 4em; }

</style>