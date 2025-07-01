<script lang="ts">
  import { currentWallpaper } from '../lib/stores/wallpaper.svelte.ts';
  
  interface Wallpaper {
    id: string;
    name: string;
    url: string;
    path: string;
  }
  
  const BACKGROUND_STYLES = {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
    margin: '0'
  } as const;
  
  const wallpaperModules = import.meta.glob('/src/assets/wallpapers/*.{jpg,jpeg,png,webp}', { 
    eager: true,
    query: '?url',
    import: 'default'
  });
  
  const formatWallpaperName = (filename: string): string => {
    return filename.charAt(0).toUpperCase() + filename.slice(1).replace(/[-_]/g, ' ');
  };
  
  const extractFilename = (path: string): string => {
    return path.split('/').pop()?.split('.')[0] || '';
  };
  
  const wallpapers: Wallpaper[] = Object.entries(wallpaperModules).map(([path, url]) => {
    const filename = extractFilename(path);
    return {
      id: filename,
      name: formatWallpaperName(filename),
      url: url as string,
      path
    };
  });
  
  let isMenuOpen = $state(false);
  
  const applyBackgroundStyles = (imageUrl: string): void => {
    if (typeof window === 'undefined') return;
    
    const bodyStyle = document.body.style;
    bodyStyle.backgroundImage = `url(${imageUrl})`;
    
    Object.entries(BACKGROUND_STYLES).forEach(([property, value]) => {
      (bodyStyle as any)[property] = value;
    });
  };
  
  let currentWallpaperUrl = $state('');
  
  currentWallpaper.subscribe(url => {
    currentWallpaperUrl = url;
    if (url) {
      applyBackgroundStyles(url);
    }
  });
  
  const selectWallpaper = (wallpaper: Wallpaper): void => {
    currentWallpaper.set(wallpaper.url);
    isMenuOpen = false;
  };
  
  const toggleMenu = (): void => {
    isMenuOpen = !isMenuOpen;
  };
  
  const closeMenu = (): void => {
    isMenuOpen = false;
  };
  
  const currentWallpaperName = $derived(
    wallpapers.find(w => w.url === currentWallpaperUrl)?.name || 'Wallpaper wählen'
  );
  
  const selectedWallpaper = $derived(currentWallpaperUrl);
</script>

<!-- Menu Button -->
<div class="wallpaper-switcher">
  <button 
    class="menu-button"
    onclick={toggleMenu}
    class:active={isMenuOpen}
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
    </svg>
    {currentWallpaperName}
    <svg 
      width="12" 
      height="12" 
      viewBox="0 0 24 24" 
      fill="currentColor"
      class="chevron"
      class:rotated={isMenuOpen}
    >
      <path d="M7 10l5 5 5-5z"/>
    </svg>
  </button>

  <!-- Dropdown Menu -->
  {#if isMenuOpen}
    <div class="dropdown-menu">
      <div class="menu-header">
        <span>Wallpapers</span>
        <span class="count">{wallpapers.length} verfügbar</span>
      </div>
      
      <div class="wallpaper-grid">
        {#each wallpapers as wallpaper (wallpaper.id)}
          <button
            class="wallpaper-option"
            class:selected={selectedWallpaper === wallpaper.url}
            onclick={() => selectWallpaper(wallpaper)}
          >
            <div class="wallpaper-preview">
              <img 
                src={wallpaper.url} 
                alt={wallpaper.name}
                loading="lazy"
              />
              
              <!-- Selected Indicator -->
              {#if selectedWallpaper === wallpaper.url}
                <div class="selected-indicator">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </div>
              {/if}
            </div>
            
            <span class="wallpaper-name">{wallpaper.name}</span>
          </button>
        {/each}
      </div>
    </div>
    
    <!-- Backdrop -->
    <button 
      class="backdrop" 
      onclick={closeMenu}
      aria-label="Menü schließen"
      type="button"
    ></button>
  {/if}
</div>

<style>
  .wallpaper-switcher {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 1000;
  }
  
  .menu-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    color: white;
    font-weight: 500;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .menu-button:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-1px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
  
  .menu-button.active {
    background: rgba(255, 255, 255, 0.2);
  }
  
  .chevron {
    transition: transform 0.2s ease;
    flex-shrink: 0;
  }
  
  .chevron.rotated {
    transform: rotate(180deg);
  }
  
  .dropdown-menu {
    position: absolute;
    top: calc(100% + 0.5rem);
    right: 0;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    min-width: 320px;
    max-width: 400px;
    max-height: 500px;
    animation: slideIn 0.2s ease;
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  .menu-header {
    padding: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .menu-header span:first-child {
    color: white;
    font-weight: 600;
    font-size: 0.875rem;
  }
  
  .count {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.75rem;
  }
  
  .wallpaper-grid {
    padding: 1rem;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.75rem;
    max-height: 350px;
    overflow-y: auto;
  }
  
  .wallpaper-option {
    background: none;
    border: none;
    cursor: pointer;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.2s ease;
    padding: 0;
  }
  
  .wallpaper-option:hover {
    transform: scale(1.02);
  }
  
  .wallpaper-option.selected {
    transform: scale(1.05);
  }
  
  .wallpaper-preview {
    position: relative;
    width: 100%;
    height: 80px;
    border-radius: 8px;
    overflow: hidden;
    border: 2px solid transparent;
    transition: border-color 0.2s ease;
  }
  
  .wallpaper-option.selected .wallpaper-preview {
    border-color: #10b981;
  }
  
  .wallpaper-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.2s ease;
  }
  
  .wallpaper-option:hover .wallpaper-preview img {
    transform: scale(1.1);
  }
  
  .selected-indicator {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: #10b981;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
  
  .wallpaper-name {
    display: block;
    padding: 0.5rem 0.25rem;
    color: white;
    font-size: 0.75rem;
    font-weight: 500;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .backdrop {
    position: fixed;
    inset: 0;
    z-index: -1;
    background: transparent;
    border: none;
    cursor: pointer;
  }
  
  /* Scrollbar für Webkit Browser */
  .wallpaper-grid::-webkit-scrollbar {
    width: 6px;
  }
  
  .wallpaper-grid::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
  
  .wallpaper-grid::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }
  
  .wallpaper-grid::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }
</style>