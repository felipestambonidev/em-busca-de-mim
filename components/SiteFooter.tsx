export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <p className="site-footer__mark" aria-label="Em Busca de Mim">
        Em Busca de <span className="script">Mim</span>
      </p>
      <div className="site-footer__meta">
        <p>Uma jornada com Tay Queiroz</p>
        <p>© 2026 Em Busca de Mim. Todos os direitos reservados.</p>
        <a href="#topo" className="link-quiet">
          Voltar ao início
        </a>
      </div>
    </footer>
  );
}
