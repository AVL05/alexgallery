const languageBootstrap = `(()=>{const locale=location.pathname.split('/')[1];if(locale==='es'||locale==='en')document.documentElement.lang=locale})()`;

export function DocumentLanguageBootstrap() {
  return <script dangerouslySetInnerHTML={{ __html: languageBootstrap }} />;
}
