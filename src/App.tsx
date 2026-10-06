import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Bolt,
  CalendarDays,
  Camera,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  CreditCard,
  Heart,
  History,
  Home,
  ImagePlus,
  MapPin,
  MessageCircle,
  Mic,
  Navigation,
  Phone,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  ToggleLeft,
  ToggleRight,
  User,
  WalletCards,
  Wrench,
  X,
  Zap,
} from "lucide-react";

type Screen =
  | "splash" | "onboarding" | "login" | "home" | "radar" | "ai"
  | "searching" | "results" | "pro" | "request" | "sent" | "proposals"
  | "chosen" | "tracking" | "arrived" | "active" | "completed" | "payment"
  | "review" | "history" | "favorites" | "chat" | "notifications" | "profile"
  | "clientWallet"
  | "proDashboard" | "opportunities" | "opportunity" | "createProposal"
  | "accepted" | "startCode" | "proActive" | "finish" | "wallet" | "proProfile";

type IconType = typeof Home;

const pros = [
  { name: "Bruno Souza", role: "Eletricista", rating: "4,9", reviews: "328", services: "127", distance: "0,8 km", eta: "3 min", price: "R$ 120", basePrice: "R$ 80", image: "/assets/bruno.jpg", online: true, verified: true },
  { name: "Rafael Lima", role: "Eletricista", rating: "4,8", reviews: "214", services: "96", distance: "1,3 km", eta: "8 min", price: "R$ 150", basePrice: "R$ 90", image: "/assets/rafael.jpg", online: true, verified: true },
  { name: "Carlos Silva", role: "Montador", rating: "4,7", reviews: "89", services: "74", distance: "2,1 km", eta: "12 min", price: "R$ 130", basePrice: "R$ 75", image: "/assets/carlos.jpg", online: true, verified: false },
  { name: "Marcos Ferreira", role: "Pintor", rating: "4,9", reviews: "176", services: "108", distance: "2,4 km", eta: "15 min", price: "R$ 180", basePrice: "R$ 110", image: "/assets/marcos.jpg", online: false, verified: true },
];

const categories = [
  ["Eletricista", Bolt], ["Encanador", Wrench], ["Pintor", Sparkles],
  ["Montador", Wrench], ["Limpeza", Sparkles], ["Marido de aluguel", Home], ["Outros", ChevronRight],
] as const;

const screenNames: Record<Screen, string> = {
  splash: "Abertura", onboarding: "Boas-vindas", login: "Entrar", home: "Início",
  radar: "Radar", ai: "Zapt AI", searching: "Buscando", results: "Resultados",
  pro: "Perfil profissional", request: "Criar solicitação", sent: "Solicitação enviada",
  proposals: "Propostas", chosen: "Profissional escolhido", tracking: "A caminho",
  arrived: "Profissional chegou", active: "Serviço em andamento", completed: "Serviço concluído",
  payment: "Pagamento", review: "Avaliação", history: "Histórico", favorites: "Favoritos",
  chat: "Mensagens", notifications: "Notificações", profile: "Meu perfil",
  clientWallet: "Carteira Zapt",
  proDashboard: "Modo profissional", opportunities: "Radar de oportunidades",
  opportunity: "Nova oportunidade", createProposal: "Criar proposta", accepted: "Serviço aceito",
  startCode: "Código de início", proActive: "Serviço em andamento", finish: "Finalizar serviço",
  wallet: "Carteira e ganhos", proProfile: "Perfil profissional",
};

function Action({ children, onClick, variant = "primary", icon }: { children: ReactNode; onClick?: () => void; variant?: "primary" | "secondary" | "ghost" | "danger"; icon?: ReactNode }) {
  return (
    <div className={`action action-${variant}`} role="button" tabIndex={0} onClick={onClick} onKeyDown={(event) => event.key === "Enter" && onClick?.()}>
      <span>{children}</span>{icon}
    </div>
  );
}

function IconAction({ icon: Icon, onClick, label }: { icon: IconType; onClick?: () => void; label: string }) {
  return <div className="icon-action" role="button" aria-label={label} tabIndex={0} onClick={onClick}><Icon size={20} /></div>;
}

function Field({ label, value, icon: Icon }: { label: string; value: string; icon?: IconType }) {
  return <div className="field">{Icon && <Icon size={18} />}<div><span className="field-label">{label}</span><span className="field-value">{value}</span></div></div>;
}

function Avatar({ person = pros[0], size = "md" }: { person?: typeof pros[number]; size?: "sm" | "md" | "lg" }) {
  return <div className={`avatar avatar-${size}`}><img src={person.image} alt={person.name} />{person.online && <span className="online-dot" />}</div>;
}

function Logo({ light = false }: { light?: boolean }) {
  return <div className={`logo ${light ? "logo-light" : ""}`}><span className="logo-mark"><Zap size={24} fill="currentColor" /></span><span>Zapt</span></div>;
}

function Header({ title, back, right }: { title: string; back?: () => void; right?: ReactNode }) {
  return <div className="topbar">{back ? <IconAction icon={ArrowLeft} onClick={back} label="Voltar" /> : <Logo />}<div className="topbar-title">{title}</div>{right || <div className="topbar-spacer" />}</div>;
}

function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return <div className="section-title"><span>{children}</span>{action && <span className="section-action">{action}</span>}</div>;
}

function ProCard({ person, onClick, compact = false }: { person: typeof pros[number]; onClick?: () => void; compact?: boolean }) {
  return (
    <div className={`pro-card ${compact ? "compact" : ""}`} role="button" tabIndex={0} onClick={onClick}>
      <Avatar person={person} />
      <div className="pro-info">
        <div className="row-between"><strong>{person.name} {person.verified && <ShieldCheck className="verified-inline" size={14} />}</strong><Heart size={17} /></div>
        <span className="muted">{person.role}</span>
        <div className="meta-row"><span><Star size={13} fill="currentColor" /> {person.rating} ({person.reviews})</span><span>{person.distance}</span><span>{person.eta}</span></div>
        {!compact && <div className="row-between"><strong>A partir de {person.basePrice}</strong><span className="available">Disponível agora</span></div>}
      </div>
      <ChevronRight size={18} />
    </div>
  );
}

function BottomNav({ mode, current, go }: { mode: "client" | "pro"; current: Screen; go: (screen: Screen) => void }) {
  const client = [
    ["Início", Home, "home"], ["Serviços", Wrench, "history"], ["Solicitações", History, "proposals"],
    ["Mensagens", MessageCircle, "chat"], ["Perfil", User, "profile"],
  ] as const;
  const professional = [
    ["Início", Home, "proDashboard"], ["Radar", Navigation, "opportunities"], ["Serviços", Wrench, "proActive"],
    ["Ganhos", WalletCards, "wallet"], ["Perfil", User, "proProfile"],
  ] as const;
  const items = mode === "client" ? client : professional;
  const clientRequestFlow: Screen[] = ["proposals", "chosen", "tracking", "arrived", "active", "completed", "payment", "review"];
  const proServiceFlow: Screen[] = ["accepted", "startCode", "proActive", "finish"];
  const activeScreen = mode === "client" && clientRequestFlow.includes(current)
    ? "proposals"
    : mode === "pro" && proServiceFlow.includes(current)
      ? "proActive"
      : current;
  return <div className={`bottom-nav floating-bottom-nav ${mode}-bottom-nav`}>{items.map(([label, Icon, screen]) => <div key={label} className={`nav-item ${activeScreen === screen ? "active" : ""}`} role="button" onClick={() => go(screen)}><i className="nav-glow" /><Icon size={20} /><span>{label}</span></div>)}</div>;
}

function MapRadar({ mode = "idle", route = false, opportunities = false, onSelect }: { mode?: "idle" | "searching" | "found"; route?: boolean; opportunities?: boolean; onSelect?: (index: number) => void }) {
  return (
    <div className={`map-radar map-${mode}`}>
      <div className="street street-a" /><div className="street street-b" /><div className="street street-c" />
      {!route && <><div className="ring ring-1" /><div className="ring ring-2" /><div className="ring ring-3" /><div className="ring ring-4" /></>}
      {route && <div className="route-line"><span /><span /><span /><span /></div>}
      <div className="user-pin"><span /></div>
      {(mode === "found" || mode === "searching" || opportunities) && pros.map((person, index) => (
        <div key={person.name} className={`map-avatar map-avatar-${index + 1}`} role={onSelect ? "button" : undefined} onClick={() => onSelect?.(index)}><Avatar person={person} size="sm" /><span>{opportunities ? `${index + 1},${index + 2} km` : person.distance}</span></div>
      ))}
      {route && <div className="driver-pin"><Avatar person={pros[0]} size="sm" /></div>}
      <div className="map-location"><MapPin size={13} /> Barueri, SP</div>
    </div>
  );
}

function ScreenShell({ children, nav, current, go, className = "" }: { children: ReactNode; nav?: "client" | "pro"; current: Screen; go: (s: Screen) => void; className?: string }) {
  return <main className={`app-shell ${className}`}><div className="screen-content">{children}</div>{nav && <BottomNav mode={nav} current={current} go={go} />}</main>;
}

function HomeScreen({ go }: { go: (s: Screen) => void }) {
  return <ScreenShell nav="client" current="home" go={go}>
    <div className="home-head"><div><span className="eyebrow">Bom dia,</span><div className="display-title">Olá, Diego!</div><span className="home-location"><MapPin size={13} /> Barueri, SP <ChevronRight size={13} /></span></div><IconAction icon={Bell} onClick={() => go("notifications")} label="Notificações" /></div>
    <div className="search-box" role="button" onClick={() => go("ai")}><Search size={20} /><span>Qual serviço você precisa?</span><div className="search-go"><ArrowRight size={18} /></div></div>
    <div className="ai-banner" role="button" onClick={() => go("ai")}><div className="ai-orb"><Sparkles size={25} /></div><div><strong>Converse com a Zapt AI</strong><span>Descreva, fale ou tire uma foto</span></div><ChevronRight size={20} /></div>
    <SectionTitle action={<span onClick={() => go("radar")}>Ver no mapa</span>}>Categorias</SectionTitle>
    <div className="category-grid">{categories.map(([name, Icon], index) => <div className="category" key={name} role="button" onClick={() => go(index === 0 ? "radar" : "results")}><span className={`category-icon tone-${index % 4}`}><Icon size={21} /></span><span>{name}</span></div>)}</div>
    <SectionTitle action={<span onClick={() => go("results")}>Explorar mapa</span>}>7 profissionais disponíveis</SectionTitle>
    <div className="home-map" role="button" onClick={() => go("results")}><MapRadar mode="found" /><div className="home-map-caption"><span className="pulse-dot" /><strong>Profissionais disponíveis perto de você</strong><ChevronRight size={17} /></div></div>
  </ScreenShell>;
}

function Splash({ go }: { go: (s: Screen) => void }) {
  useEffect(() => { const timer = window.setTimeout(() => go("onboarding"), 1600); return () => window.clearTimeout(timer); }, [go]);
  return <ScreenShell current="splash" go={go} className="splash"><div className="splash-glow" /><div className="splash-logo"><Logo light /><span>Serviços perto de você</span></div><div className="splash-radar"><div /><div /><div /><MapPin size={27} /></div><span className="splash-caption">Conectando você a quem resolve.</span></ScreenShell>;
}

function Onboarding({ go }: { go: (s: Screen) => void }) {
  return <ScreenShell current="onboarding" go={go} className="intro"><div className="intro-art"><MapRadar mode="found" /></div><div className="intro-copy"><span className="pill">Rápido. Local. Seguro.</span><div className="hero-title">O profissional certo, <span>perto de você.</span></div><p>Do problema à solução em poucos toques. Acompanhe tudo em tempo real.</p><div className="dots"><i /><i className="active" /><i /></div><Action onClick={() => go("login")} icon={<ArrowRight size={19} />}>Começar agora</Action></div></ScreenShell>;
}

function Login({ go }: { go: (s: Screen) => void }) {
  return <ScreenShell current="login" go={go}><div className="auth-brand"><Logo /><div className="hero-title">Que bom ter você aqui.</div><p>Entre para encontrar profissionais de confiança perto de você.</p></div><div className="auth-card"><Field label="Celular" value="(11) 99999-9999" icon={Phone} /><Action onClick={() => go("home")}>Continuar</Action><div className="divider"><span>ou</span></div><Action variant="secondary" onClick={() => go("home")}>Continuar com Google</Action><p className="legal">Ao continuar, você concorda com nossos Termos e Política de Privacidade.</p></div></ScreenShell>;
}

function AI({ go, back }: { go: (s: Screen) => void; back: () => void }) {
  return <ScreenShell current="ai" go={go}><Header title="Zapt AI" back={back} right={<span className="beta">Beta</span>} /><div className="ai-stage"><div className="robot"><Sparkles size={36} /></div><div className="hero-title small">Como posso te ajudar hoje?</div><p>Conte o que aconteceu. Eu identifico o profissional ideal.</p></div><div className="input-modes"><div><Mic size={19} /><span>Falar</span></div><div><Camera size={19} /><span>Foto</span></div><div className="selected"><MessageCircle size={19} /><span>Digitar</span></div></div><div className="chat-bubble user">Meu chuveiro parou de funcionar e está saindo cheiro de queimado.</div><div className="ai-result"><div className="mini-orb"><Sparkles size={17} /></div><div><strong>Entendi! Parece um problema elétrico.</strong><p>Vou encontrar eletricistas disponíveis perto de você.</p><ul><li><Check size={15} /> Serviço: Eletricista</li><li><Check size={15} /> Prioridade: Alta</li><li><Check size={15} /> Localização atual</li></ul></div></div><Action onClick={() => go("searching")} icon={<Search size={18} />}>Buscar profissionais</Action></ScreenShell>;
}

function RadarScreen({ go, back, searching = false }: { go: (s: Screen) => void; back: () => void; searching?: boolean }) {
  const [radius, setRadius] = useState(1);
  useEffect(() => {
    if (!searching) return;
    const timer = window.setInterval(() => setRadius((value) => value >= 10 ? 10 : value === 1 ? 3 : value === 3 ? 5 : 10), 900);
    return () => window.clearInterval(timer);
  }, [searching]);
  return <ScreenShell current={searching ? "searching" : "radar"} go={go} className="radar-screen"><Header title={searching ? "Buscando profissionais" : "Radar Zapt"} back={back} /><div className="map-filter-overlay"><span className="active"><span className="pulse-dot" /> Disponíveis agora</span><span>Até 5 km</span><span>Melhor avaliação</span></div><MapRadar mode={searching ? "searching" : "found"} onSelect={() => go("results")} /><div className="radar-sheet"><span className="pill">{searching ? "Radar ativo" : "4 profissionais por perto"}</span><div className="display-title">{searching ? `Procurando em até ${radius} km` : "Tem gente pronta para ajudar."}</div><p>{searching ? "Estamos ampliando o raio de busca para encontrar as melhores opções." : "Toque em um profissional no mapa para ver preço e disponibilidade."}</p><div className="radius-track">{[1, 3, 5, 10].map((item) => <span key={item} className={radius >= item ? "active" : ""}>{item} km</span>)}</div><Action onClick={() => go(searching ? "results" : "searching")}>{searching ? "Ver profissionais encontrados" : "Iniciar busca"}</Action></div></ScreenShell>;
}

function Results({ go, back }: { go: (s: Screen) => void; back: () => void }) {
  const [selected, setSelected] = useState(0);
  const [listOpen, setListOpen] = useState(false);
  const person = pros[selected];
  return <ScreenShell current="results" go={go} className="explore-results"><Header title="Eletricistas perto de você" back={back} right={<IconAction icon={Search} label="Buscar" />} /><div className="map-filter-overlay"><span className="active"><span className="pulse-dot" /> Disponíveis agora</span><span>Até 5 km</span><span>Avaliação</span></div><MapRadar mode="found" onSelect={setSelected} /><div className={`professional-drawer ${listOpen ? "drawer-open" : ""}`}><div className="drawer-handle" role="button" onClick={() => setListOpen(!listOpen)} /><div className="drawer-summary"><Avatar person={person} size="lg" /><div><div className="row-between"><strong>{person.name}</strong>{person.verified && <span className="verified-badge"><ShieldCheck size={13} /> Verificado</span>}</div><span>{person.role} residencial</span><div className="drawer-rating"><Star size={14} fill="currentColor" /> <strong>{person.rating}</strong><span>{person.reviews} avaliações</span></div></div><Heart size={20} /></div><div className="drawer-trust"><span><MapPin size={15} /><strong>{person.distance}</strong></span><span><Clock3 size={15} /><strong>{person.eta}</strong></span><span className="available"><span className="pulse-dot" /> Disponível agora</span></div><div className="visit-price"><CircleDollarSign size={18} /><span>Visita a partir de <strong>{person.basePrice}</strong></span></div>{listOpen && <div className="drawer-list">{pros.map((item, index) => <ProCard key={item.name} person={item} compact onClick={() => { setSelected(index); setListOpen(false); }} />)}</div>}<div className="dual-actions"><Action variant="secondary" onClick={() => go("pro")}>Ver perfil</Action><Action onClick={() => go("request")}>Solicitar</Action></div></div></ScreenShell>;
}

function Professional({ go, back }: { go: (s: Screen) => void; back: () => void }) {
  return <ScreenShell current="pro" go={go}><div className="profile-hero"><img src={pros[0].image} alt="Bruno Souza" /><div className="profile-overlay"><IconAction icon={ArrowLeft} onClick={back} label="Voltar" /><IconAction icon={Heart} label="Favoritar" /></div></div><div className="profile-sheet"><span className="available">Disponível agora</span><div className="row-between"><div><div className="display-title">Bruno Souza <ShieldCheck className="verified-inline" size={19} /></div><span className="muted">Eletricista residencial • Profissional verificado</span></div><div className="rating-box"><Star size={16} fill="currentColor" /><strong>4,9</strong></div></div><div className="stats"><div><strong>0,8 km</strong><span>Distância</span></div><div><strong>3 min</strong><span>Chegada</span></div><div><strong>127</strong><span>Serviços</span></div></div><div className="profile-price"><CircleDollarSign size={18} /><span>Visita a partir de <strong>R$ 80</strong></span><span>328 avaliações</span></div><SectionTitle>Sobre</SectionTitle><p>Especialista em instalações elétricas residenciais e comerciais. Atendimento rápido, cuidadoso e com garantia.</p><div className="tag-row"><span>Chuveiro</span><span>Tomadas</span><span>Iluminação</span><span>Quadro elétrico</span></div><SectionTitle action="Ver tudo">Trabalhos realizados</SectionTitle><div className="gallery"><img src="/assets/work-1.jpg" alt="Trabalho elétrico" /><img src="/assets/work-2.jpg" alt="Instalação elétrica" /></div><div className="dual-actions"><Action variant="secondary" onClick={() => go("chat")}><MessageCircle size={18} /> Mensagem</Action><Action onClick={() => go("request")}>Solicitar serviço</Action></div></div></ScreenShell>;
}

function Request({ go, back }: { go: (s: Screen) => void; back: () => void }) {
  return <ScreenShell current="request" go={go}><Header title="Criar solicitação" back={back} /><div className="step-label"><span>Detalhes do serviço</span><strong>1 de 2</strong></div><Field label="O que está acontecendo?" value="Meu chuveiro parou de funcionar e há cheiro de queimado." icon={MessageCircle} /><div className="upload-card"><ImagePlus size={24} /><div><strong>Adicionar fotos</strong><span>Ajude o profissional a entender melhor</span></div><ChevronRight size={18} /></div><Field label="Localização" value="Al. Rio Negro, 585 • Barueri" icon={MapPin} /><div className="two-fields"><Field label="Data" value="Hoje" icon={CalendarDays} /><Field label="Horário" value="Agora" icon={Clock3} /></div><SectionTitle>Qual é a urgência?</SectionTitle><div className="urgency"><span>Posso esperar</span><span>Hoje</span><span className="active">Urgente</span></div><Field label="Observações" value="Interfone 42. Tenho estacionamento." icon={MessageCircle} /><div className="request-total"><span>Estimativa</span><strong>R$ 90–180</strong></div><Action onClick={() => go("sent")} icon={<Send size={18} />}>Enviar solicitação</Action></ScreenShell>;
}

function Sent({ go }: { go: (s: Screen) => void }) {
  return <ScreenShell current="sent" go={go}><div className="success-stage"><div className="notify-animation"><Send size={32} /><i /><i /><i /></div><div className="hero-title small">Solicitação enviada!</div><p>Estamos informando os profissionais mais próximos. Você receberá propostas em instantes.</p></div><div className="notified-card"><div className="avatar-stack">{pros.map((p) => <Avatar key={p.name} person={p} size="sm" />)}</div><strong>4 profissionais notificados</strong><span>Tempo médio de resposta: 2 minutos</span></div><Action onClick={() => go("proposals")}>Ver propostas</Action><Action variant="ghost" onClick={() => go("home")}>Voltar ao início</Action></ScreenShell>;
}

function Proposals({ go, back }: { go: (s: Screen) => void; back: () => void }) {
  return <ScreenShell nav="client" current="proposals" go={go}><Header title="Propostas recebidas" back={back} right={<span className="count-badge">3</span>} /><div className="live-note"><span className="pulse-dot" /> Novas propostas em tempo real</div>{pros.slice(0, 3).map((person, index) => <div className="proposal-card" key={person.name}><div className="proposal-head"><Avatar person={person} /><div><strong>{person.name}</strong><span><Star size={13} fill="currentColor" /> {person.rating} • {index + 3} min</span></div><strong className="price">{person.price}</strong></div><p>{index === 0 ? "Posso chegar agora. Material básico e garantia inclusos." : "Atendimento completo com diagnóstico no local."}</p><div className="dual-actions"><Action variant="ghost">Recusar</Action><Action onClick={() => go("chosen")}>Aceitar</Action></div></div>)}</ScreenShell>;
}

function Chosen({ go }: { go: (s: Screen) => void }) {
  return <ScreenShell current="chosen" go={go}><div className="success-stage compact"><div className="check-orb"><Check size={30} /></div><div className="hero-title small">Bruno foi escolhido!</div><p>Ele confirmou o serviço e já está se preparando para ir até você.</p></div><div className="chosen-card"><ProCard person={pros[0]} compact /><div className="receipt-row"><span>Serviço</span><strong>Reparo elétrico</strong></div><div className="receipt-row"><span>Valor combinado</span><strong>R$ 120,00</strong></div><div className="receipt-row"><span>Previsão de chegada</span><strong>3 minutos</strong></div></div><Action onClick={() => go("tracking")} icon={<Navigation size={18} />}>Acompanhar no mapa</Action><Action variant="ghost" onClick={() => go("chat")}>Enviar mensagem</Action></ScreenShell>;
}

function Tracking({ go, back, professional = false }: { go: (s: Screen) => void; back: () => void; professional?: boolean }) {
  return <ScreenShell nav={professional ? "pro" : "client"} current={professional ? "accepted" : "tracking"} go={go} className="tracking"><Header title={professional ? "Rota até o cliente" : "Bruno está a caminho"} back={back} /><MapRadar mode="found" route /><div className="tracking-card"><div className="eta-badge"><span>Chegada em</span><strong>3 min</strong></div><ProCard person={pros[0]} compact /><div className="dual-actions"><Action variant="secondary" onClick={() => go("chat")}><MessageCircle size={18} /> Mensagem</Action><Action onClick={() => go(professional ? "startCode" : "arrived")}><Phone size={18} /> {professional ? "Cheguei" : "Ligação"}</Action></div>{!professional && <div className="tracking-code"><ShieldCheck size={19} /><div><span>Código do serviço</span><strong>482 731</strong><small>Compartilhe apenas quando Bruno chegar</small></div></div>}</div></ScreenShell>;
}

function SecurityCode({ go, professional = false }: { go: (s: Screen) => void; professional?: boolean }) {
  return <ScreenShell current={professional ? "startCode" : "arrived"} go={go}><div className="security-hero"><ShieldCheck size={38} /><div className="hero-title small">{professional ? "Insira o código de início" : "O profissional chegou"}</div><p>{professional ? "Peça ao cliente o código de 6 dígitos para iniciar com segurança." : "Informe este código ao profissional para iniciar o serviço."}</p></div><div className="code-box">{["7", "4", "2", "1", "9", "0"].map((n) => <span key={n}>{n}</span>)}</div><div className="security-note"><ShieldCheck size={18} /><span>Nunca compartilhe este código antes do profissional chegar ao local.</span></div><Action onClick={() => go(professional ? "proActive" : "active")}>{professional ? "Confirmar e iniciar" : "Código informado"}</Action></ScreenShell>;
}

function ActiveService({ go, professional = false }: { go: (s: Screen) => void; professional?: boolean }) {
  return <ScreenShell nav={professional ? "pro" : undefined} current={professional ? "proActive" : "active"} go={go}><Header title="Serviço em andamento" /><div className="active-visual"><div className="progress-ring"><Wrench size={31} /><span>Em andamento</span></div></div><div className="service-card"><ProCard person={pros[0]} compact /><div className="timeline"><div className="done"><i><Check size={13} /></i><div><strong>Serviço iniciado</strong><span>Hoje, às 14:32</span></div></div><div className="current"><i /><div><strong>Reparo do chuveiro</strong><span>Em andamento há 24 min</span></div></div><div><i /><div><strong>Conclusão e pagamento</strong><span>Próxima etapa</span></div></div></div><div className="receipt-row"><span>Valor combinado</span><strong>R$ 120,00</strong></div></div><Action onClick={() => go(professional ? "finish" : "completed")}>{professional ? "Finalizar serviço" : "Simular conclusão"}</Action></ScreenShell>;
}

function Completed({ go }: { go: (s: Screen) => void }) {
  return <ScreenShell current="completed" go={go}><div className="success-stage compact"><div className="check-orb"><Check size={30} /></div><div className="hero-title small">Serviço concluído!</div><p>Bruno finalizou o reparo e adicionou as fotos do serviço.</p></div><div className="gallery large"><img src="/assets/work-1.jpg" alt="Antes do serviço" /><img src="/assets/work-2.jpg" alt="Depois do serviço" /></div><div className="summary-card"><div className="receipt-row"><span>Serviço</span><strong>Reparo elétrico</strong></div><div className="receipt-row"><span>Profissional</span><strong>Bruno Souza</strong></div><div className="receipt-row total"><span>Valor total</span><strong>R$ 120,00</strong></div></div><Action onClick={() => go("payment")}>Ir para pagamento</Action></ScreenShell>;
}

function Payment({ go, back }: { go: (s: Screen) => void; back: () => void }) {
  const [method, setMethod] = useState<"wallet" | "pix" | "card">("wallet");
  return <ScreenShell current="payment" go={go}><Header title="Pagamento" back={back} /><div className="payment-total"><span>Total a pagar</span><strong>R$ 120,00</strong><small>Reparo elétrico com Bruno Souza</small></div><SectionTitle action={<span onClick={() => go("clientWallet")}>Gerenciar</span>}>Escolha como pagar</SectionTitle><div className="payment-options"><div className={method === "wallet" ? "selected" : ""} role="button" onClick={() => setMethod("wallet")}><span className="payment-icon wallet-tone"><WalletCards size={20} /></span><div><strong>Saldo Zapt</strong><span>R$ 186,40 disponível</span></div>{method === "wallet" ? <Check size={19} /> : <ChevronRight size={19} />}</div><div className={method === "pix" ? "selected" : ""} role="button" onClick={() => setMethod("pix")}><span className="payment-icon"><Zap size={20} /></span><div><strong>Pix</strong><span>Aprovação imediata</span></div>{method === "pix" ? <Check size={19} /> : <ChevronRight size={19} />}</div><div className={method === "card" ? "selected" : ""} role="button" onClick={() => setMethod("card")}><span className="payment-icon"><CreditCard size={20} /></span><div><strong>Mastercard • 4242</strong><span>Crédito • método de segurança</span></div>{method === "card" ? <Check size={19} /> : <ChevronRight size={19} />}</div></div>{method === "wallet" && <div className="wallet-discount"><Sparkles size={18} /><div><strong>Você economiza R$ 6,00</strong><span>5% de cashback pagando com Saldo Zapt</span></div></div>}<div className="payment-breakdown"><div className="receipt-row"><span>Serviço</span><strong>R$ 120,00</strong></div>{method === "wallet" && <div className="receipt-row"><span>Cashback após pagamento</span><strong className="positive">+ R$ 6,00</strong></div>}<div className="receipt-row total"><span>Total</span><strong>R$ 120,00</strong></div></div><div className="secure-pay"><ShieldCheck size={17} /> Pagamento protegido. Você só paga após a conclusão.</div><Action onClick={() => go("review")}>Pagar com {method === "wallet" ? "Saldo Zapt" : method === "pix" ? "Pix" : "Mastercard"}</Action></ScreenShell>;
}

function ClientWallet({ go, back }: { go: (s: Screen) => void; back: () => void }) {
  const [adding, setAdding] = useState(false);
  const [amount, setAmount] = useState("100");
  const [added, setAdded] = useState(false);
  const recharge = () => { setAdded(true); window.setTimeout(() => { setAdded(false); setAdding(false); }, 1200); };
  return <ScreenShell current="clientWallet" go={go}><Header title="Carteira Zapt" back={back} right={<IconAction icon={History} label="Extrato" />} /><div className="client-wallet-card"><div className="wallet-card-top"><Logo light /><span>Saldo disponível</span></div><strong>{added ? "R$ 286,40" : "R$ 186,40"}</strong><small>Use em qualquer serviço Zapt</small><div className="wallet-quick-actions"><div role="button" onClick={() => setAdding(true)}><CircleDollarSign size={20} /><span>Adicionar</span></div><div role="button"><Send size={20} /><span>Enviar</span></div><div role="button"><History size={20} /><span>Extrato</span></div></div></div><div className="cashback-banner"><div className="cashback-icon"><Sparkles size={23} /></div><div><strong>R$ 24,80 em cashback</strong><span>Economia acumulada usando a carteira</span></div><ChevronRight size={18} /></div>{adding ? <div className="recharge-panel"><div className="row-between"><div><div className="display-title">Adicionar saldo</div><span className="muted">Escolha um valor para recarregar</span></div><IconAction icon={X} onClick={() => setAdding(false)} label="Fechar" /></div><div className="recharge-value"><span>R$</span><strong>{amount},00</strong></div><div className="amount-chips">{["50", "100", "150", "200"].map((value) => <span key={value} className={amount === value ? "active" : ""} role="button" onClick={() => setAmount(value)}>R$ {value}</span>)}</div><SectionTitle>Forma de recarga</SectionTitle><div className="payment-options compact-options"><div className="selected"><span className="payment-icon"><Zap size={20} /></span><div><strong>Pix</strong><span>Saldo disponível na hora</span></div><Check size={19} /></div><div><span className="payment-icon"><CreditCard size={20} /></span><div><strong>Mastercard • 4242</strong><span>Cartão de crédito</span></div><ChevronRight size={19} /></div></div><Action onClick={recharge}>{added ? <><Check size={18} /> Saldo adicionado</> : `Adicionar R$ ${amount},00`}</Action></div> : <><SectionTitle>Métodos de pagamento</SectionTitle><div className="wallet-methods"><div><span className="payment-icon"><CreditCard size={20} /></span><div><strong>Mastercard • 4242</strong><span>Método de recarga padrão</span></div><span className="default-badge">Padrão</span></div><div><span className="payment-icon"><Zap size={20} /></span><div><strong>Pix</strong><span>Adicione saldo instantaneamente</span></div><ChevronRight size={18} /></div><div className="add-method"><span className="payment-icon"><CircleDollarSign size={20} /></span><div><strong>Adicionar forma de pagamento</strong><span>Cartão de crédito ou débito</span></div><ChevronRight size={18} /></div></div><div className="auto-recharge"><div><span className="payment-icon wallet-tone"><Bolt size={20} /></span><div><strong>Recarga automática</strong><span>Recarregar R$ 100 quando o saldo ficar abaixo de R$ 30</span></div></div><ToggleRight size={32} /></div><SectionTitle action="Ver tudo">Atividade recente</SectionTitle>{[["Pagamento • Bruno Souza", "− R$ 120,00", "Hoje, 15:20"], ["Cashback recebido", "+ R$ 6,00", "Hoje, 15:20"], ["Recarga via Pix", "+ R$ 150,00", "08 jun, 10:42"]].map(([title, value, date]) => <div className="transaction" key={title}><span className="note-icon"><WalletCards size={19} /></span><div><strong>{title}</strong><span>{date}</span></div><strong className={value.startsWith("+") ? "positive" : ""}>{value}</strong></div>)}</>}</ScreenShell>;
}

function Review({ go }: { go: (s: Screen) => void }) {
  return <ScreenShell current="review" go={go}><div className="review-head"><Avatar person={pros[0]} size="lg" /><div className="hero-title small">Como foi o atendimento?</div><p>Sua avaliação ajuda Bruno e toda a comunidade Zapt.</p></div><div className="stars">{[1, 2, 3, 4, 5].map((n) => <Star key={n} size={35} fill="currentColor" />)}</div><Field label="Comentário" value="Ótimo atendimento! Rápido e muito cuidadoso." icon={MessageCircle} /><div className="upload-card"><ImagePlus size={24} /><div><strong>Adicionar fotos</strong><span>Opcional</span></div><ChevronRight size={18} /></div><div className="tag-row centered"><span>Educado</span><span>Pontual</span><span>Caprichoso</span></div><Action onClick={() => go("history")}>Enviar avaliação</Action></ScreenShell>;
}

function HistoryScreen({ go }: { go: (s: Screen) => void }) {
  const items = [
    ["Eletricista", "Bruno Souza", "12 jun 2025", "R$ 120,00", pros[0]],
    ["Encanador", "Rafael Lima", "28 mai 2025", "R$ 180,00", pros[1]],
    ["Montador", "Carlos Silva", "10 abr 2025", "R$ 150,00", pros[2]],
  ] as const;
  return <ScreenShell nav="client" current="history" go={go}><Header title="Meus serviços" /><div className="tabs"><span className="active">Concluídos</span><span>Em andamento</span><span>Cancelados</span></div>{items.map(([service, name, date, price, person]) => <div className="history-card" key={service}><Avatar person={person} /><div><strong>{service}</strong><span>{name} • {date}</span><span className="completed-label"><Check size={12} /> Concluído</span></div><strong>{price}</strong></div>)}</ScreenShell>;
}

function Favorites({ go, back }: { go: (s: Screen) => void; back: () => void }) {
  return <ScreenShell nav="client" current="favorites" go={go}><Header title="Favoritos" back={back} /><p className="page-intro">Seus profissionais de confiança, sempre por perto.</p>{pros.slice(0, 3).map((person) => <ProCard key={person.name} person={person} onClick={() => go("pro")} />)}</ScreenShell>;
}

function Chat({ go, back }: { go: (s: Screen) => void; back: () => void }) {
  return <ScreenShell nav="client" current="chat" go={go}><Header title="Mensagens" back={back} right={<IconAction icon={Search} label="Buscar" />} /><div className="chat-list">{pros.slice(0, 3).map((person, index) => <div className="conversation" key={person.name}><Avatar person={person} /><div><div className="row-between"><strong>{person.name}</strong><small>{index === 0 ? "14:58" : "Ontem"}</small></div><span>{index === 0 ? "Estou chegando, Diego!" : "Obrigado pela preferência."}</span></div>{index === 0 && <i>2</i>}</div>)}</div></ScreenShell>;
}

function Notifications({ go, back }: { go: (s: Screen) => void; back: () => void }) {
  const notes = [
    [CircleDollarSign, "Nova proposta recebida", "Bruno enviou uma proposta de R$ 120.", "Agora"],
    [Navigation, "Profissional a caminho", "Bruno chega em aproximadamente 3 minutos.", "Há 4 min"],
    [MessageCircle, "Nova mensagem", "Rafael respondeu à sua solicitação.", "Há 12 min"],
    [Sparkles, "10% de desconto", "Use ZAPT10 no seu próximo serviço.", "Ontem"],
  ] as const;
  return <ScreenShell current="notifications" go={go}><Header title="Notificações" back={back} /><div className="stack">{notes.map(([Icon, title, text, time]) => <div className="notification" key={title}><span className="note-icon"><Icon size={20} /></span><div><strong>{title}</strong><p>{text}</p><small>{time}</small></div><span className="unread" /></div>)}</div></ScreenShell>;
}

function Profile({ go }: { go: (s: Screen) => void }) {
  const options = [
    [MapPin, "Meus endereços", "Casa e trabalho"], [CreditCard, "Pagamentos", "Carteira, cartões e Pix"],
    [ShieldCheck, "Segurança", "Senha e privacidade"], [Heart, "Favoritos", "3 profissionais"],
    [Settings, "Configurações", "Notificações e aparência"],
  ] as const;
  return <ScreenShell nav="client" current="profile" go={go}><Header title="Meu perfil" /><div className="client-profile"><div className="avatar-initial">DS</div><div><div className="display-title">Diego Santos</div><span>(11) 99999-9999</span></div></div><div className="profile-wallet-shortcut" role="button" onClick={() => go("clientWallet")}><div><span>Saldo Zapt</span><strong>R$ 186,40</strong><small>R$ 24,80 recebidos em cashback</small></div><WalletCards size={27} /><ChevronRight size={18} /></div><div className="mode-switch" role="button" onClick={() => go("proDashboard")}><div><span className="mode-icon"><Wrench size={22} /></span><div><strong>Mudar para modo profissional</strong><span>Gerencie serviços e ganhos</span></div></div><ToggleRight size={30} /></div><div className="menu-list">{options.map(([Icon, title, sub]) => <div key={title} role="button" onClick={() => title === "Favoritos" ? go("favorites") : title === "Pagamentos" ? go("clientWallet") : undefined}><Icon size={20} /><div><strong>{title}</strong><span>{sub}</span></div><ChevronRight size={18} /></div>)}</div></ScreenShell>;
}

function ProDashboard({ go }: { go: (s: Screen) => void }) {
  const [online, setOnline] = useState(true);
  return <ScreenShell nav="pro" current="proDashboard" go={go}><div className="pro-dash-head"><div><span className="eyebrow">Modo profissional</span><div className="display-title">Olá, Bruno!</div></div><IconAction icon={Bell} onClick={() => go("notifications")} label="Notificações" /></div><div className={`online-control ${online ? "is-online" : ""}`} role="button" onClick={() => setOnline(!online)}><div><span className="pulse-dot" /><div><strong>{online ? "Você está online" : "Você está offline"}</strong><span>{online ? "Recebendo oportunidades próximas" : "Ative para receber solicitações"}</span></div></div>{online ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}</div><div className="earnings-card"><div><span>Ganhos hoje</span><strong>R$ 380,00</strong><small>+18% comparado a ontem</small></div><CircleDollarSign size={34} /></div><div className="metric-grid"><div><strong>3</strong><span>Serviços hoje</span></div><div><strong>4,9</strong><span>Avaliação</span></div><div><strong>127</strong><span>Total serviços</span></div></div><SectionTitle action={<span onClick={() => go("opportunities")}>Ver no radar</span>}>Solicitações próximas</SectionTitle><div className="opportunity-mini" role="button" onClick={() => go("opportunity")}><span className="job-icon"><Bolt size={23} /></span><div><strong>Chuveiro sem funcionar</strong><span>Eletricista • 0,8 km</span><small>Publicado agora</small></div><span className="price">R$ 90–180</span></div></ScreenShell>;
}

function Opportunities({ go, back }: { go: (s: Screen) => void; back: () => void }) {
  const [receiving, setReceiving] = useState(true);
  const [orderVisible, setOrderVisible] = useState(true);
  return <ScreenShell nav="pro" current="opportunities" go={go} className="radar-screen professional-radar"><Header title="Radar de serviços" back={back} /><div className="pro-radar-controls"><div className="balance-button" role="button" onClick={() => go("wallet")}><WalletCards size={17} /><div><span>Saldo</span><strong>R$ 1.248,60</strong></div><ChevronRight size={15} /></div><div className={`radar-power ${receiving ? "running" : ""}`} role="button" onClick={() => setReceiving(!receiving)}>{receiving ? <ToggleRight size={26} /> : <ToggleLeft size={26} />}<div><strong>{receiving ? "Radar ativo" : "Radar pausado"}</strong><span>{receiving ? "Recebendo ordens" : "Toque para iniciar"}</span></div></div></div><MapRadar mode={receiving ? "found" : "idle"} opportunities={receiving} />{receiving && orderVisible && <div className="incoming-order"><div className="order-alert"><span className="pulse-dot" /><strong>Nova ordem de serviço</strong><small>Expira em 00:42</small></div><div className="order-main"><span className="job-icon"><Bolt size={22} /></span><div><strong>Chuveiro sem funcionar</strong><span>Elétrica residencial • Urgente</span></div><strong className="price">R$ 120</strong></div><div className="order-details"><span><MapPin size={14} /> 0,8 km</span><span><Clock3 size={14} /> Hoje, agora</span><span><ShieldCheck size={14} /> Cliente verificado</span></div><div className="order-description">Cheiro de queimado e chuveiro sem aquecer. Disjuntor já foi desligado.</div><div className="order-timer"><i /></div><div className="dual-actions"><Action variant="ghost" onClick={() => setOrderVisible(false)}><X size={18} /> Recusar</Action><Action onClick={() => go("accepted")}><Check size={18} /> Aceitar ordem</Action></div></div>}<div className="radar-sheet"><div className="row-between"><div><span className="pill">{receiving ? "4 pedidos próximos" : "Radar pausado"}</span><div className="display-title">{receiving ? "Serviços na sua região" : "Você não receberá novas ordens"}</div></div><span className={`live-note ${!receiving ? "paused" : ""}`}><span className="pulse-dot" /> {receiving ? "Ao vivo" : "Pausado"}</span></div><p>{receiving ? "As melhores oportunidades aparecem primeiro. Você pode aceitar ou recusar sem afetar sua conta." : "Inicie o radar quando estiver disponível para trabalhar."}</p>{receiving && <div className="service-order-list"><div className="opportunity-mini" role="button" onClick={() => go("opportunity")}><span className="job-icon"><Bolt size={23} /></span><div><strong>Instalar duas tomadas</strong><span>1,4 km • Alphaville</span><small>R$ 100–160</small></div><span className="order-status">Nova</span></div><div className="opportunity-mini" role="button" onClick={() => go("opportunity")}><span className="job-icon plumbing"><Wrench size={23} /></span><div><strong>Reparo em torneira</strong><span>2,1 km • Barueri</span><small>R$ 80–130</small></div><ChevronRight size={19} /></div></div>}<Action variant={receiving ? "danger" : "primary"} onClick={() => setReceiving(!receiving)}>{receiving ? "Parar de receber ordens" : "Iniciar radar de serviços"}</Action></div></ScreenShell>;
}

function Opportunity({ go, back }: { go: (s: Screen) => void; back: () => void }) {
  return <ScreenShell current="opportunity" go={go}><Header title="Nova oportunidade" back={back} /><div className="job-hero"><span className="job-icon large"><Bolt size={27} /></span><div><span className="pill">Urgente</span><div className="display-title">Chuveiro sem funcionar</div><span>Eletricista residencial</span></div></div><div className="job-meta"><div><MapPin size={18} /><span><strong>0,8 km</strong> de distância</span></div><div><Clock3 size={18} /><span>Publicado <strong>agora</strong></span></div><div><CircleDollarSign size={18} /><span>Estimativa <strong>R$ 90–180</strong></span></div></div><SectionTitle>Descrição do cliente</SectionTitle><p className="description-card">Meu chuveiro parou de funcionar e começou a sair cheiro de queimado. Desliguei o disjuntor por segurança.</p><div className="gallery large"><img src="/assets/work-2.jpg" alt="Problema elétrico enviado pelo cliente" /></div><div className="approx-map"><MapRadar mode="idle" /></div><p className="privacy-note"><ShieldCheck size={16} /> Local aproximado. O endereço exato aparece após o aceite.</p><div className="dual-actions"><Action variant="ghost" onClick={() => go("opportunities")}>Ignorar</Action><Action onClick={() => go("createProposal")}>Enviar proposta</Action></div></ScreenShell>;
}

function CreateProposal({ go, back }: { go: (s: Screen) => void; back: () => void }) {
  return <ScreenShell current="createProposal" go={go}><Header title="Criar proposta" back={back} /><div className="proposal-context"><span className="job-icon"><Bolt size={21} /></span><div><strong>Chuveiro sem funcionar</strong><span>Diego • 0,8 km</span></div></div><Field label="Valor do serviço" value="R$ 120,00" icon={CircleDollarSign} /><Field label="Tempo para chegar" value="15 minutos" icon={Clock3} /><Field label="Mensagem para o cliente" value="Olá, Diego! Posso chegar em 15 minutos. Levo as ferramentas e peças básicas." icon={MessageCircle} /><Field label="Condições" value="Valor inclui diagnóstico e mão de obra. Peças serão combinadas no local." icon={ShieldCheck} /><div className="fee-card"><div className="receipt-row"><span>Valor da proposta</span><strong>R$ 120,00</strong></div><div className="receipt-row"><span>Taxa Zapt (10%)</span><strong>− R$ 12,00</strong></div><div className="receipt-row total"><span>Você recebe</span><strong>R$ 108,00</strong></div></div><Action onClick={() => go("accepted")} icon={<Send size={18} />}>Enviar proposta</Action></ScreenShell>;
}

function FinishService({ go, back }: { go: (s: Screen) => void; back: () => void }) {
  return <ScreenShell current="finish" go={go}><Header title="Finalizar serviço" back={back} /><div className="before-after"><div><span>Antes</span><img src="/assets/work-2.jpg" alt="Antes do serviço" /></div><div><span>Depois</span><div className="add-photo"><Camera size={24} /><small>Adicionar</small></div></div></div><Field label="Observações finais" value="Resistência substituída e instalação testada. Tudo funcionando normalmente." icon={MessageCircle} /><Field label="Valor final" value="R$ 120,00" icon={CircleDollarSign} /><div className="security-note"><ShieldCheck size={18} /><span>O cliente receberá o resumo e poderá fazer o pagamento pelo app.</span></div><Action onClick={() => go("wallet")}>Concluir serviço</Action></ScreenShell>;
}

function Wallet({ go }: { go: (s: Screen) => void }) {
  return <ScreenShell nav="pro" current="wallet" go={go}><Header title="Carteira" /><div className="wallet-card"><span>Saldo disponível</span><strong>R$ 1.248,60</strong><small>Atualizado agora</small><Action variant="secondary">Solicitar saque</Action></div><div className="metric-grid"><div><strong>R$ 2.840</strong><span>Este mês</span></div><div><strong>24</strong><span>Serviços</span></div><div><strong>R$ 284</strong><span>Comissões</span></div></div><SectionTitle action="Ver extrato">Movimentações</SectionTitle>{[["Reparo elétrico", "+ R$ 108,00", "Hoje, 15:20"], ["Instalação de tomadas", "+ R$ 162,00", "Ontem, 18:42"], ["Saque via Pix", "− R$ 500,00", "10 jun, 09:15"]].map(([title, value, date]) => <div className="transaction" key={title}><span className="note-icon"><CircleDollarSign size={19} /></span><div><strong>{title}</strong><span>{date}</span></div><strong className={value.startsWith("+") ? "positive" : ""}>{value}</strong></div>)}</ScreenShell>;
}

function ProProfile({ go }: { go: (s: Screen) => void }) {
  const options = [["Especialidades", "Elétrica residencial, instalações"], ["Área de atendimento", "Até 10 km de Barueri"], ["Agenda", "Seg–Sáb, 8h às 19h"], ["Portfólio", "18 fotos publicadas"], ["Avaliações", "4,9 • 128 avaliações"]] as const;
  return <ScreenShell nav="pro" current="proProfile" go={go}><Header title="Perfil profissional" right={<IconAction icon={Settings} label="Configurações" />} /><div className="pro-profile-head"><Avatar person={pros[0]} size="lg" /><div><div className="display-title">Bruno Souza</div><span>Eletricista • Verificado</span><div className="meta-row"><span><Star size={13} fill="currentColor" /> 4,9</span><span>127 serviços</span></div></div></div><div className="profile-completion"><div className="row-between"><strong>Perfil completo</strong><span>92%</span></div><div><i /></div><small>Adicione mais trabalhos ao portfólio</small></div><div className="menu-list">{options.map(([title, sub]) => <div key={title}><div><strong>{title}</strong><span>{sub}</span></div><ChevronRight size={18} /></div>)}</div><Action variant="secondary" onClick={() => go("profile")}>Mudar para modo cliente</Action></ScreenShell>;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [historyStack, setHistoryStack] = useState<Screen[]>([]);
  const go = (next: Screen) => { setHistoryStack((items) => [...items, screen]); setScreen(next); window.scrollTo(0, 0); };
  const back = () => { const previous = historyStack.at(-1) || "home"; setHistoryStack((items) => items.slice(0, -1)); setScreen(previous); window.scrollTo(0, 0); };
  const props = { go, back };
  const rendered = useMemo(() => {
    switch (screen) {
      case "splash": return <Splash go={go} />;
      case "onboarding": return <Onboarding go={go} />;
      case "login": return <Login go={go} />;
      case "home": return <HomeScreen go={go} />;
      case "radar": return <RadarScreen {...props} />;
      case "ai": return <AI {...props} />;
      case "searching": return <RadarScreen {...props} searching />;
      case "results": return <Results {...props} />;
      case "pro": return <Professional {...props} />;
      case "request": return <Request {...props} />;
      case "sent": return <Sent go={go} />;
      case "proposals": return <Proposals {...props} />;
      case "chosen": return <Chosen go={go} />;
      case "tracking": return <Tracking {...props} />;
      case "arrived": return <SecurityCode go={go} />;
      case "active": return <ActiveService go={go} />;
      case "completed": return <Completed go={go} />;
      case "payment": return <Payment {...props} />;
      case "review": return <Review go={go} />;
      case "history": return <HistoryScreen go={go} />;
      case "favorites": return <Favorites {...props} />;
      case "chat": return <Chat {...props} />;
      case "notifications": return <Notifications {...props} />;
      case "profile": return <Profile go={go} />;
      case "clientWallet": return <ClientWallet {...props} />;
      case "proDashboard": return <ProDashboard go={go} />;
      case "opportunities": return <Opportunities {...props} />;
      case "opportunity": return <Opportunity {...props} />;
      case "createProposal": return <CreateProposal {...props} />;
      case "accepted": return <Tracking {...props} professional />;
      case "startCode": return <SecurityCode go={go} professional />;
      case "proActive": return <ActiveService go={go} professional />;
      case "finish": return <FinishService {...props} />;
      case "wallet": return <Wallet go={go} />;
      case "proProfile": return <ProProfile go={go} />;
    }
  }, [screen, historyStack]);
  return <div className="viewport"><div className="prototype-label">{screenNames[screen]}</div>{rendered}</div>;
}
