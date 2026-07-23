import React, { FormEvent, useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const tasks = [
  {title:'Ресерч',copy:'Находит источники, проверяет факты и собирает вывод, с которым можно работать.',result:'12 источников собрано',image:'/assets/usecase-research-v2.png'},
  {title:'Письма',copy:'Разбирает входящие, учитывает контекст проекта и готовит ответы в вашем тоне.',result:'3 ответа готовы',image:'/assets/usecase-messages-v2.png'},
  {title:'Расписание',copy:'Перестраивает день при изменении приоритетов и защищает время для фокусной работы.',result:'План дня обновлён',image:'/assets/usecase-schedule-v2.png'},
]

function Logo(){ return <a className="logo" href="#top" aria-label="Клубок, на главную"><span>клубок</span><i>.ai</i></a> }

function ProductPanel(){
  const [active,setActive]=useState(1)
  const [paused,setPaused]=useState(false)
  const agentData=[
    {role:'КУРАТОР',title:'Распределяю задачи команды',steps:['Уточнил приоритеты','Назначил исполнителей','Проверяю результаты']},
    {role:'ИССЛЕДОВАТЕЛЬ',title:'Собираю материалы для презентации',steps:['Понял задачу','Изучаю источники','Соберу выводы']},
    {role:'РЕДАКТОР',title:'Готовлю черновики ответов',steps:['Изучил переписку','Собрал контекст','Проверяю тон']},
  ]
  const current=agentData[active]
  return <div className="product-window" aria-label="Концепт рабочего центра Клубок">
    <div className="window-bar"><span/><span/><span/><b>Сегодня · рабочий центр</b><em>Онлайн</em></div>
    <div className="workspace">
      <aside><Logo/><button className="new-agent">＋ Новый агент</button><small>МОЯ КОМАНДА</small>{['Куратор','Исследователь','Редактор'].map((x,i)=><button key={x} className={active===i?'agent active':'agent'} onClick={()=>setActive(i)}><span>{x[0]}</span>{x}<i>{i===1?'работает':'готов'}</i></button>)}</aside>
      <main className="activity"><div className="activity-head"><div><small>{current.role}</small><h3>{current.title}</h3></div><button onClick={()=>setPaused(!paused)}>{paused?'Продолжить':'Пауза'}</button></div>
        <div className="thread-line"><i/><i/><i/></div>
        <div className={'steps '+(paused?'is-paused':'')}><article><b>01</b><div><strong>{current.steps[0]}</strong><p>Контекст задачи сохранён в рабочем пространстве</p></div><span>готово</span></article><article><b>02</b><div><strong>{current.steps[1]}</strong><p>{paused?'Работа остановлена, прогресс сохранён':'Агент использует подключённые источники и сервисы'}</p></div><span className="working">{paused?'пауза':'сейчас'}</span></article><article className="muted"><b>03</b><div><strong>{current.steps[2]}</strong><p>Результат появится здесь вместе с источниками</p></div><span>далее</span></article></div>
      </main>
    </div>
  </div>
}

const demoPresets = [
  'Собери референсы для лендинга и сделай краткий вывод',
  'Разбери входящие письма и подготовь черновики ответов',
  'Собери новости рынка и обнови утреннюю сводку',
]

function LiveDemo(){
  const [task,setTask]=useState(demoPresets[0])
  const [phase,setPhase]=useState<'idle'|'running'|'done'>('idle')
  const timers=useRef<number[]>([])
  const run=()=>{
    timers.current.forEach(clearTimeout)
    setPhase('running')
    timers.current=[window.setTimeout(()=>setPhase('done'),3600)]
  }
  useEffect(()=>()=>timers.current.forEach(clearTimeout),[])
  const agents=phase==='idle'?[]:phase==='running'?['Куратор распределяет задачу','Исследователь изучает источники','Редактор готовит вывод']:['Источники проверены','Материалы сгруппированы','Сводка готова']
  return <section className="live-demo reveal" aria-label="Интерактивная демонстрация продукта">
    <div className="demo-intro"><span className="plain-label">ПОПРОБУЙТЕ НА СТРАНИЦЕ</span><h2>Одна задача.<br/>Команда уже в работе.</h2><p>Выберите пример или сформулируйте свой. Демонстрация покажет, как Клубок распределяет работу между агентами.</p></div>
    <div className="demo-console">
      <div className="demo-presets">{demoPresets.map(x=><button key={x} className={task===x?'selected':''} onClick={()=>{setTask(x);setPhase('idle')}}>{x.split(' и ')[0]}</button>)}</div>
      <label htmlFor="demo-task">Задача для Клубка</label>
      <textarea id="demo-task" value={task} onChange={e=>{setTask(e.target.value);setPhase('idle')}}/>
      <button className="demo-run" onClick={run} disabled={!task.trim()||phase==='running'}>{phase==='running'?'Агенты работают...':phase==='done'?'Запустить ещё раз':'Делегировать задачу'}</button>
      <div className={'agent-run '+phase} aria-live="polite">
        {phase==='idle'?<div className="demo-empty"><b>Здесь появится план работы</b><span>Клубок выберет агентов и покажет каждый шаг.</span></div>:agents.map((x,i)=><div className="run-row" key={x} style={{'--delay':`${i*240}ms`} as React.CSSProperties}><i>{phase==='done'?'✓':i+1}</i><span>{x}</span><em>{phase==='done'?'готово':'в работе'}</em></div>)}
        {phase==='done'&&<article className="demo-result"><small>РЕЗУЛЬТАТ</small><h3>Подборка готова</h3><p>12 источников, 4 визуальных направления и краткая рекомендация по каждому.</p><button>Открыть результат</button></article>}
      </div>
    </div>
  </section>
}

const autonomyModes=[
  {name:'Наблюдает',copy:'Агент анализирует контекст и ничего не меняет.'},
  {name:'Предлагает',copy:'Готовит решения, но не выполняет действия.'},
  {name:'Подтверждает',copy:'Работает сам, важные действия согласует с вами.'},
  {name:'Автономно',copy:'Выполняет разрешённые сценарии без ожидания.'},
]

function AutonomyControl({level,setLevel}:{level:number,setLevel:(value:number)=>void}){
  return <div className="autonomy-box"><div className="autonomy-head"><span>Уровень самостоятельности</span><b>{autonomyModes[level].name}</b></div><div className="autonomy-options">{autonomyModes.map((m,i)=><button key={m.name} className={level===i?'active':''} onClick={()=>setLevel(i)}><i>{i+1}</i><span>{m.name}</span></button>)}</div><p>{autonomyModes[level].copy}</p><small>{level<2?'Все изменения останутся черновиками.':level===2?'Письма, публикации и платежи потребуют подтверждения.':'Действия ограничены заданными сервисами и правилами.'}</small></div>
}

function UseCases(){
  const [active,setActive]=useState(0)
  return <section id="cases" className="cases"><div className="cases-title reveal"><h2>Освободите внимание<br/>для сложного</h2><p>Не ещё один чат, а исполнители для повторяющейся цифровой работы.</p></div><div className="case-grid reveal">{tasks.map((task,i)=><button key={task.title} className={'case '+(active===i?'active':'')} onClick={()=>setActive(i)} aria-expanded={active===i}><img src={task.image} alt=""/><span className="case-shade"/><span className="case-number">0{i+1}</span><div className="case-copy"><h3>{task.title}</h3><p>{task.copy}</p><b>{task.result}</b></div></button>)}</div></section>
}

function ControlSection(){
  const [level,setLevel]=useState(2)
  const phoneState=[
    {label:'ТОЛЬКО НАБЛЮДЕНИЕ',title:'Письмо требует внимания',copy:'Клубок нашёл важное сообщение и добавил его в обзор.',button:'Открыть письмо',secondary:'Никаких действий не выполнено'},
    {label:'ГОТОВ ЧЕРНОВИК',title:'Ответ подготовлен',copy:'Редактор собрал контекст и написал черновик в вашем тоне.',button:'Открыть черновик',secondary:'Письмо не будет отправлено'},
    {label:'НУЖНО РЕШЕНИЕ',title:'Отправить письмо клиенту?',copy:'Редактор подготовил ответ и сверил факты по проекту.',button:'Подтвердить отправку',secondary:'Открыть и изменить'},
    {label:'ВЫПОЛНЕНО АВТОНОМНО',title:'Письмо отправлено',copy:'Действие соответствовало разрешённому сценарию.',button:'Посмотреть в журнале',secondary:'Отменить автоматизацию'},
  ][level]
  return <section id="control" className="control reveal"><div className={'phone autonomy-'+level}><div className="phone-top"><Logo/><span>09:41</span></div><small>{phoneState.label}</small><h3>{phoneState.title}</h3><p>{phoneState.copy}</p><div className="mail"><span>Анна, Studio Forma</span><p>Анна, добрый день! Подтверждаю, что материалы будут готовы…</p></div><button>{phoneState.button}</button><a>{phoneState.secondary}</a></div><div className="control-copy"><h2>Автономность,<br/>которую выбираете вы</h2><p>Переключите режим и посмотрите, как изменится поведение агента в одной и той же ситуации.</p><AutonomyControl level={level} setLevel={setLevel}/></div></section>
}

function AgentBuilder(){
  const [step,setStep]=useState(0)
  const [tools,setTools]=useState(['Web','Drive'])
  const [permission,setPermission]=useState('Черновики')
  const toggleTool=(tool:string)=>setTools(current=>current.includes(tool)?current.filter(item=>item!==tool):[...current,tool])
  if(step===3) return <div className="builder builder-success"><span className="builder-pulse">И</span><small>АГЕНТ СОЗДАН</small><h3>Утренний исследователь</h3><p>Первая сводка появится завтра в 08:30. До этого момента можно изменить сценарий.</p><div className="builder-success-meta"><span>{tools.join(' + ')}</span><span>{permission}</span></div><button onClick={()=>setStep(0)}>Изменить настройки</button></div>
  const panels=[
    <div className="builder-panel" key="task"><span className="builder-label">Клубок понял задачу</span><h3>Утренний исследователь</h3><p>Собирает новые материалы по активным проектам и оставляет короткую сводку.</p><div className="builder-fields"><label><span>Когда запускать</span><b>Будни, 08:30</b></label><label><span>Формат результата</span><b>Сводка со ссылками</b></label></div></div>,
    <div className="builder-panel" key="tools"><span className="builder-label">Подключённые источники</span><h3>Где агент будет искать</h3><p>Выберите рабочие пространства. Доступ можно отозвать в любой момент.</p><div className="tool-picker">{['Web','Drive','Notion','Slack'].map(tool=><button key={tool} className={tools.includes(tool)?'selected':''} onClick={()=>toggleTool(tool)}><i>{tools.includes(tool)?'✓':'+'}</i><span>{tool}</span><small>{tool==='Web'?'Открытые источники':tool==='Drive'?'Файлы проектов':tool==='Notion'?'База знаний':'Командные каналы'}</small></button>)}</div></div>,
    <div className="builder-panel" key="rules"><span className="builder-label">Безопасные границы</span><h3>Что агент может делать сам</h3><p>Для первого запуска рекомендуем сохранять всё в черновики.</p><div className="permission-picker">{['Только наблюдать','Черновики','Автономно'].map((item,i)=><button key={item} className={permission===item?'selected':''} onClick={()=>setPermission(item)}><i>{i+1}</i><span><b>{item}</b><small>{i===0?'Ничего не меняет':i===1?'Готовит результат для проверки':'Работает в заданных границах'}</small></span></button>)}</div></div>,
  ]
  return <div className="builder"><div className="builder-top"><span>Новый агент</span><em>Черновик сохранён</em></div><div className="builder-progress">{['Задача','Инструменты','Границы'].map((name,i)=><button key={name} className={step===i?'active':step>i?'done':''} onClick={()=>setStep(i)}><i>{step>i?'✓':i+1}</i><span>{name}</span></button>)}</div><div className="builder-request">Хочу, чтобы каждое утро агент собирал новые материалы по моим проектам и оставлял короткую сводку.</div>{panels[step]}<div className="builder-actions">{step>0&&<button className="builder-back" onClick={()=>setStep(step-1)}>Назад</button>}<button className="builder-next" onClick={()=>setStep(step===2?3:step+1)}>{step===2?'Создать агента':'Продолжить'}</button></div></div>
}

function WaitlistForm(){
  const [email,setEmail]=useState('')
  const [status,setStatus]=useState<'idle'|'loading'|'success'|'error'>('idle')
  const submit=(e:FormEvent)=>{e.preventDefault();if(!/^\S+@\S+\.\S+$/.test(email)){setStatus('error');return}setStatus('loading');window.setTimeout(()=>{localStorage.setItem('klubok-waitlist-email',email);setStatus('success')},700)}
  if(status==='success')return <div className="form-success" role="status"><b>Заявка принята</b><p>Напишем на {email}, когда откроем следующую группу.</p><button onClick={()=>setStatus('idle')}>Изменить адрес</button></div>
  return <form onSubmit={submit} noValidate><label htmlFor="email">Рабочая почта</label><div><input id="email" type="email" value={email} onChange={e=>{setEmail(e.target.value);setStatus('idle')}} placeholder="you@company.com" aria-describedby="email-help"/><button disabled={status==='loading'}>{status==='loading'?'Отправляем...':'В список ожидания'}</button></div><small id="email-help" className={status==='error'?'error':''}>{status==='error'?'Проверьте адрес почты. Например: name@company.ru':'Приглашения будем отправлять небольшими группами.'}</small></form>
}

function App(){
  const [menu,setMenu]=useState(false)
  useEffect(()=>{const items=document.querySelectorAll('.reveal');const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('in')),{threshold:.14});items.forEach(x=>io.observe(x));return()=>io.disconnect()},[])
  return <div id="top">
    <header><Logo/><nav className={menu?'open':''}><a href="#how">Как работает</a><a href="#cases">Сценарии</a><a href="#control">Контроль</a></nav><a className="nav-cta" href="#waitlist">Попробовать</a><button className="menu" onClick={()=>setMenu(!menu)} aria-label="Открыть меню">{menu?'×':'≡'}</button></header>
    <main>
      <section className="hero">
        <img className="hero-art" src="/assets/hero-orbit-v2.webp" alt="Сеть цифровых потоков вокруг Клубка AI-агентов"/>
        <div className="hero-copy reveal"><p className="eyebrow">КОМАНДА АВТОНОМНЫХ AI-АГЕНТОВ</p><h1><span>Делегируйте рутину,</span><em>получайте результат</em></h1><p className="hero-sub">Клубок планирует работу, подключает инструменты и доводит задачу до конца.</p><div className="hero-actions"><a className="primary" href="#waitlist">Попробовать</a><a className="text-link" href="#how">Демо продукта</a></div></div>
      </section>

      <section className="proof reveal"><p>Одна команда вместо цифрового шума</p><div>{['исследует','пишет','планирует','отвечает','связывает сервисы'].map(x=><span key={x}>{x}</span>)}</div></section>

      <LiveDemo/>

      <section id="how" className="product-section"><div className="section-copy reveal"><h2>Видно, кто что делает.<br/>И зачем.</h2><p>Каждый агент показывает план, источники и ход работы. Можно уточнить задачу, поставить на паузу или забрать управление.</p></div><div className="reveal"><ProductPanel/></div></section>

      <section className="setup reveal"><div className="setup-copy"><span className="plain-label">СОЗДАНИЕ АГЕНТА</span><h2>Объясните задачу<br/>как коллеге</h2><p>Клубок сам разложит запрос на роль, источники и правила. Пройдите три шага в интерактивном прототипе.</p></div><AgentBuilder/></section>

      <UseCases/>

      <ControlSection/>

      <section className="manifest reveal"><p>Вы не должны становиться оператором AI.</p><h2>Скажите, чего хотите.<br/><em>Клубок распутает остальное.</em></h2></section>
      <section id="waitlist" className="cta reveal"><div><span>РАННИЙ ДОСТУП</span><h2>Верните себе<br/>внимание.</h2></div><WaitlistForm/></section>
    </main>
    <footer><Logo/><p>Автономные AI-агенты для цифровой работы.</p><span>© 2026 Клубок.ai</span></footer>
  </div>
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>)
