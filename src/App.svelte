<script lang="ts">
  import WallpaperSwitcher from './components/WallpaperSwitcher.svelte';
  import BootScreen from './components/BootScreen.svelte';
  
  let isAppReady = $state(false);
  
  function handleBootComplete() {
    // Boot ist fertig, App kann angezeigt werden
    setTimeout(() => {
      isAppReady = true;
    }, 300); // Kleine Verzögerung für smooth transition
  }
</script>

<!-- Boot Screen (nur beim ersten Laden) -->
{#if !isAppReady}
  <BootScreen onBootComplete={handleBootComplete} />
{/if}

<!-- Main App Content -->
{#if isAppReady}
  <main class="app-content">
    <!-- Wallpaper Switcher -->
    <WallpaperSwitcher />
    
    <!-- Dein Content -->
    <div class="content">
      <div class="welcome-card">
        <h1>Willkommen</h1>
        <p>Deine Website ist bereit! Wähle ein Wallpaper aus dem Menü oben rechts.</p>
        
        <div class="features">
          <div class="feature">
            🖼️ Lokale Wallpapers
          </div>
          <div class="feature">
            💾 Persistente Speicherung
          </div>
          <div class="feature">
            🚀 Svelte 5 + Vite
          </div>
        </div>
      </div>
    </div>
  </main>
{/if}

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    overflow: hidden; /* Entfernt Scrollbars */
    height: 100vh;
    width: 100vw;
  }
  
  :global(html) {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
  }
  
  .app-content {
    height: 100vh;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    overflow: hidden;
  }
  
  .content {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;
    padding: 2rem;
    box-sizing: border-box;
    overflow: hidden;
  }
  
  .welcome-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    padding: 3rem;
    text-align: center;
    color: white;
    max-width: 500px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
    animation: slideUp 0.6s ease;
  }
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .welcome-card h1 {
    margin: 0 0 1rem 0;
    font-size: 2.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .welcome-card p {
    margin: 0 0 2rem 0;
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.6;
  }
  
  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-top: 2rem;
  }
  
  .feature {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    padding: 1rem;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.2s ease;
  }
  
  .feature:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }
  
  /* Mobile Anpassungen */
  @media (max-width: 640px) {
    .welcome-card {
      padding: 2rem;
      margin: 1rem;
    }
    
    .welcome-card h1 {
      font-size: 2rem;
    }
    
    .features {
      grid-template-columns: 1fr;
    }
  }
</style>