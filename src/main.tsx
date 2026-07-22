import React, { FormEvent, useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const tasks = [
  ['Ресерч', '12 источников собрано', 'done'],
  ['Письма', '3 ответа ждут подтверждения', 'review'],
  ['Расписание', 'Фокус-блок перенесён на 14:00', 'done'],
]

function Logo(){ return <a className="logo" href="#top" aria-label="Клубок, на главную"><span>клубок</span><i>.ai</i></a> }

function ProductPanel(){
  const [active,setActive]=useState(1)
  return <div className="product-window" aria-label="Концепт рабочего центра Клубок">
    <div className="window-bar"><span/><span/><span/><b>Сегодня · рабочий центр</b><em>Онлайн</em></div>
    <div className="workspace">
      <aside><Logo/><button className="new-agent">＋ Новый агент</button><small>МОЯ КОМАНДА</small>{['Куратор','Исследователь','Редактор'].map((x,i)=><button key={x} className={active===i?'agent active':'agent'} onClick={()=>setActive(i)}><span>{x[0]}</span>{x}<i>{i===1?'работает':'готов'}</i></button>)}</aside>
      <main className="activity"><div className="activity-head"><div><small>ИССЛЕДОВАТЕЛЬ</small><h3>Собираю материалы для презентации</h3></div><button>Пауза</button></div>
        <div className="thread-line"><i/><i/><i/></div>
        <div className="steps"><article><b>01</b><div><strong>Понял задачу</strong><p>Сравнить 8 сервисов и выделить продуктовые паттерны</p></div><span>готово</span></article><article><b>02</b><div><strong>Изучаю источники</strong><p>Документация, обзоры и пользовательские сценарии</p></div><span className="working">сейчас</span></article><article className="muted"><b>03</b><div><strong>Соберу выводы</strong><p>Краткий документ со ссылками и рекомендациями</p></div><span>далее</span></article></div>
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

function AutonomyControl(){
  const [level,setLevel]=useState(2)
  return <div className="autonomy-box"><div className="autonomy-head"><span>Уровень самостоятельности</span><b>{autonomyModes[level].name}</b></div><div className="autonomy-options">{autonomyModes.map((m,i)=><button key={m.name} className={level===i?'active':''} onClick={()=>setLevel(i)}><i>{i+1}</i><span>{m.name}</span></button>)}</div><p>{autonomyModes[level].copy}</p><small>{level<2?'Все изменения останутся черновиками.':level===2?'Письма, публикации и платежи потребуют подтверждения.':'Действия ограничены заданными сервисами и правилами.'}</small></div>
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
        <img className="hero-art" src="/assets/agent-network-hero.png" alt="Связанные цифровые потоки, метафора команды AI-агентов"/>
        <div className="hero-copy reveal"><p className="eyebrow">АВТОНОМНЫЕ AI-АГЕНТЫ</p><h1>Делегируйте<br/><em>не задачу, а результат</em></h1><p className="hero-sub">Клубок сам планирует работу, подключает инструменты и возвращается с готовым результатом.</p><div className="hero-actions"><a className="primary" href="#waitlist">Попробовать</a><a className="text-link" href="#how">Посмотреть, как это работает ↓</a></div></div>
        <div className="hero-status"><span><i/>3 агента работают</span><b>вы контролируете важное</b></div>
      </section>

      <section className="proof reveal"><p>Одна команда вместо цифрового шума</p><div>{['исследует','пишет','планирует','отвечает','связывает сервисы'].map(x=><span key={x}>{x}</span>)}</div></section>

      <LiveDemo/>

      <section id="how" className="product-section"><div className="section-copy reveal"><h2>Видно, кто что делает.<br/>И зачем.</h2><p>Каждый агент показывает план, источники и ход работы. Можно уточнить задачу, поставить на паузу или забрать управление.</p></div><div className="reveal"><ProductPanel/></div></section>

      <section className="setup reveal"><div className="setup-copy"><span className="plain-label">СОЗДАНИЕ АГЕНТА</span><h2>Объясните задачу<br/>как коллеге</h2><p>Без схем и сложных настроек. Клубок сам предложит роль, инструменты и безопасные границы.</p></div><div className="chat-card"><div className="chat-top"><span>Новый агент</span><i>Настройка</i></div><div className="bubble">Хочу, чтобы каждое утро агент собирал новые материалы по моим проектам и оставлял короткую сводку.</div><div className="agent-reply"><b>Клубок предлагает</b><h3>Утренний исследователь</h3><div className="chips"><span>Будни, 08:30</span><span>Web + Drive</span><span>Только черновики</span></div><button>Создать агента →</button></div></div></section>

      <section id="cases" className="cases"><div className="cases-title reveal"><h2>Освободите внимание<br/>для сложного</h2><p>Не ещё один чат, а исполнители для повторяющейся цифровой работы.</p></div><div className="case-grid reveal">{tasks.map((t,i)=><article key={t[0]} className={'case c'+i}><span>0{i+1}</span><h3>{t[0]}</h3><p>{t[1]}</p><div className="mini-flow"><i/><b/><i/></div></article>)}</div></section>

      <section id="control" className="control reveal"><div className="phone"><div className="phone-top"><Logo/><span>09:41</span></div><small>НУЖНО РЕШЕНИЕ</small><h3>Отправить письмо клиенту?</h3><p>Редактор подготовил ответ и сверил факты по проекту.</p><div className="mail"><span>Кому: Анна, Studio Forma</span><p>Анна, добрый день! Подтверждаю, что материалы будут готовы…</p></div><button>Подтвердить отправку</button><a>Открыть и изменить</a></div><div className="control-copy"><h2>Автономность<br/>с вашим уровнем контроля</h2><p>Клубок действует сам в безопасных задачах и запрашивает подтверждение там, где цена ошибки выше.</p><AutonomyControl/></div></section>

      <section className="manifest reveal"><p>Вы не должны становиться оператором AI.</p><h2>Скажите, чего хотите.<br/><em>Клубок распутает остальное.</em></h2></section>
      <section id="waitlist" className="cta reveal"><div><span>РАННИЙ ДОСТУП</span><h2>Верните себе<br/>внимание.</h2></div><WaitlistForm/></section>
    </main>
    <footer><Logo/><p>Автономные AI-агенты для цифровой работы.</p><span>© 2026 Клубок.ai</span></footer>
  </div>
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>)
