import './styles/global.css'
import typescriptLogo from '/typescript.svg'
import viteLogo from '/vite.svg'


document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="container logos">
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo vite" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
  </div>
`

