<script lang="ts">
  import { onMount } from 'svelte';
  import { quintInOut } from 'svelte/easing';
  import { tweened } from 'svelte/motion';
  
  const TIMING = {
    INITIAL_DELAY: 300,
    PROGRESS_DURATION: 2500,
    FADE_DELAY: 200
  } as const;
  
  const PROGRESS_CONFIG = {
    duration: TIMING.PROGRESS_DURATION,
    easing: quintInOut
  } as const;
  
  interface Props {
    onBootComplete?: () => void;
  }
  
  let { onBootComplete }: Props = $props();
  
  let isBootComplete = $state(false);
  let showContent = $state(false);
  
  let progress = tweened(100, PROGRESS_CONFIG);
  
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  const startBootSequence = async () => {
    await sleep(TIMING.INITIAL_DELAY);
    progress.set(0);
    await sleep(TIMING.PROGRESS_DURATION);
    isBootComplete = true;
    await sleep(TIMING.FADE_DELAY);
    showContent = true;
    onBootComplete?.();
  };
  
  onMount(() => {
    startBootSequence();
  });
  

</script>

<!-- Boot Screen -->
{#if !showContent}
  <div 
    class="bootscreen"
    class:fade-out={isBootComplete}
  >
    <!-- Logo Text -->
    <div class="logo">
      <h1>AA98.net</h1>
    </div>
    
    <!-- Progress Bar -->
    <div 
      class="progress"
      role="progressbar"
      aria-valuenow={100 - $progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="System wird geladen"
    >
      <div 
        class="progress-fill" 
        style="transform: translateX(-{$progress}%)"
      ></div>
    </div>
    
    <!-- Loading Text (optional) -->
    <div class="loading-text">
      Loading...
    </div>
  </div>
{/if}

<style>
  .bootscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: #000;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 3rem;
    z-index: 9999;
    cursor: none;
    user-select: none;
    transition: opacity 0.5s ease;
  }
  
  .bootscreen.fade-out {
    opacity: 0;
    pointer-events: none;
  }
  
  .logo {
    color: white;
    animation: pulse 2s ease-in-out infinite;
  }
  
  .logo h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 300;
    letter-spacing: 0.2em;
    background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-transform: uppercase;
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 0.8;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.05);
    }
  }
  
  .progress {
    width: 200px;
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    overflow: hidden;
    position: relative;
  }
  
  .progress-fill {
    width: 100%;
    height: 100%;
    background: white;
    border-radius: 2px;
    transition: transform 0.1s ease;
  }
  
  .loading-text {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.875rem;
    font-weight: 400;
    letter-spacing: 0.05em;
    animation: fadeInOut 2s ease-in-out infinite;
  }
  
  @keyframes fadeInOut {
    0%, 100% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
  }
  
  /* Mobile Anpassungen */
  @media (max-width: 640px) {
    .logo h1 {
      font-size: 2.5rem;
      letter-spacing: 0.1em;
    }
    
    .progress {
      width: 150px;
    }
    
    .loading-text {
      font-size: 0.75rem;
    }
  }
</style>