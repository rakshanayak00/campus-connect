
import { useEffect, useState } from 'react'
import {
  CalendarDays,
  Compass,
  GraduationCap,
  Heart,
  Home,
  MessageCircle,
  Search,
  Users,
  Bell,
  Plus,
  ArrowUpRight,
  MapPin,
  Clock3,
  Sparkles,
  Menu,
  X,
  Bookmark,
} from 'lucide-react'
import './App.css'

type EventItem = {
  id: number
  title: string
  category: string
  date: string
  time: string
  location: string
  attendees: number
  color: string
}

const initialEvents: EventItem[] = [
  {
    id: 1,
    title: 'Design Beyond Boundaries',
    category: 'DESIGN',
    date: '24 OCT',
    time: '10:00 AM',
    location: 'Innovation Hub',
    attendees: 84,
    color: 'lavender',
  },
  {
    id: 2,
    title: 'Buildathon 2026',
    category: 'TECHNOLOGY',
    date: '27 OCT',
    time: '09:30 AM',
    location: 'Computer Science Block',
    attendees: 126,
    color: 'peach',
  },
  {
    id: 3,
    title: 'Campus Open Mic',
    category: 'CULTURE',
    date: '30 OCT',
    time: '04:00 PM',
    location: 'Open Air Theatre',
    attendees: 58,
    color: 'mint',
  },
]

const initialPosts = [
  {
    id: 1,
    name: 'Ananya Rao',
    initials: 'AR',
    role: 'Design Club · 2h ago',
    text: 'We are hosting a design jam this weekend! Bring your ideas, meet fellow creatives, and make something meaningful together.',
    likes: 24,
    comments: 8,
    liked: false,
    color: 'avatar-purple',
  },
  {
    id: 2,
    name: 'Rohan Shetty',
    initials: 'RS',
    role: 'Computer Science · 5h ago',
    text: 'Looking for teammates for Buildathon 2026. Interested in frontend, AI, or solving real campus problems? Let’s connect!',
    likes: 17,
    comments: 5,
    liked: false,
    color: 'avatar-orange',
  },
]

const initialClubs = [
  { id: 1, name: 'CodeCraft', category: 'Technology', members: 248, icon: '⌘', color: 'club-lilac' },
  { id: 2, name: 'Frame by Frame', category: 'Photography', members: 126, icon: '◉', color: 'club-peach' },
  { id: 3, name: 'The Green Circle', category: 'Sustainability', members: 184, icon: '✳', color: 'club-green' },
]

type CampusPost = (typeof initialPosts)[number]
type CampusClub = (typeof initialClubs)[number]

function initialPostsTypeSafe(): CampusPost[] {
  try { return JSON.parse(localStorage.getItem('campus-connect-posts') || 'null') ?? initialPosts }
  catch { return initialPosts }
}

function initialClubsTypeSafe(): CampusClub[] {
  try { return JSON.parse(localStorage.getItem('campus-connect-clubs') || 'null') ?? initialClubs }
  catch { return initialClubs }
}


function App() {
  const [activeTab, setActiveTab] = useState('Overview')
  const [search, setSearch] = useState('')
  const [eventFilter, setEventFilter] = useState('All')
  const [events, setEvents] = useState<EventItem[]>(() => {
    try { return JSON.parse(localStorage.getItem('campus-connect-events') || 'null') ?? initialEvents }
    catch { return initialEvents }
  })
  const [registered, setRegistered] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem('campus-connect-registered') || 'null') ?? [] }
    catch { return [] }
  })
  const [posts, setPosts] = useState(initialPostsTypeSafe())
  const [clubs] = useState(initialClubsTypeSafe())
  const [joinedClubs, setJoinedClubs] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem('campus-connect-joined-clubs') || 'null') ?? [] }
    catch { return [] }
  })
  const [savedEvents, setSavedEvents] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem('campus-connect-saved-events') || 'null') ?? [] }
    catch { return [] }
  })
  const [newPost, setNewPost] = useState('')
  const [showPostForm, setShowPostForm] = useState(false)
  const [showEventForm, setShowEventForm] = useState(false)
  const [eventTitle, setEventTitle] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [eventLocation, setEventLocation] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)
  const [notice, setNotice] = useState('')

  // Keep user changes after a browser refresh. Data is stored locally in this browser.
  useEffect(() => { localStorage.setItem('campus-connect-events', JSON.stringify(events)) }, [events])
  useEffect(() => { localStorage.setItem('campus-connect-registered', JSON.stringify(registered)) }, [registered])
  useEffect(() => { localStorage.setItem('campus-connect-posts', JSON.stringify(posts)) }, [posts])
  useEffect(() => { localStorage.setItem('campus-connect-clubs', JSON.stringify(clubs)) }, [clubs])
  useEffect(() => { localStorage.setItem('campus-connect-joined-clubs', JSON.stringify(joinedClubs)) }, [joinedClubs])
  useEffect(() => { localStorage.setItem('campus-connect-saved-events', JSON.stringify(savedEvents)) }, [savedEvents])

  const filteredEvents = events.filter((event) => {
    const matchesSearch = `${event.title} ${event.category} ${event.location}`
      .toLowerCase()
      .includes(search.toLowerCase())
    const matchesCategory = eventFilter === 'All' || event.category === eventFilter
    return matchesSearch && matchesCategory
  })

  const filteredClubs = clubs.filter((club) =>
    `${club.name} ${club.category}`.toLowerCase().includes(search.toLowerCase()),
  )

  const filteredPosts = posts.filter((post) =>
    `${post.name} ${post.text}`.toLowerCase().includes(search.toLowerCase()),
  )

  function notify(message: string) {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2800)
  }

  function toggleRegistration(id: number) {
    const alreadyRegistered = registered.includes(id)
    setRegistered((current) =>
      alreadyRegistered ? current.filter((item) => item !== id) : [...current, id],
    )
    notify(alreadyRegistered ? 'Registration cancelled.' : 'You’re registered! See you there.')
  }

  function toggleLike(id: number) {
    setPosts((current) =>
      current.map((post) =>
        post.id === id
          ? {
              ...post,
              liked: !post.liked,
              likes: post.likes + (post.liked ? -1 : 1),
            }
          : post,
      ),
    )
  }

  function addPost() {
    if (!newPost.trim()) return
    setPosts((current) => [
      {
        id: Date.now(),
        name: 'You',
        initials: 'YO',
        role: 'Campus member · just now',
        text: newPost.trim(),
        likes: 0,
        comments: 0,
        liked: false,
        color: 'avatar-blue',
      },
      ...current,
    ])
    setNewPost('')
    setShowPostForm(false)
    notify('Your post has been published.')
  }

  function addEvent() {
    if (!eventTitle.trim() || !eventDate || !eventLocation.trim()) {
      notify('Please complete all event fields.')
      return
    }
    const date = new Date(`${eventDate}T12:00:00`)
    const newItem: EventItem = {
      id: Date.now(),
      title: eventTitle.trim(),
      category: 'CAMPUS',
      date: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase(),
      time: 'Time to be announced',
      location: eventLocation.trim(),
      attendees: 1,
      color: 'blue',
    }
    setEvents((current) => [...current, newItem])
    setEventTitle('')
    setEventDate('')
    setEventLocation('')
    setShowEventForm(false)
    setActiveTab('Events')
    notify('Your event has been added.')
  }

  function toggleClub(id: number) {
    const joined = joinedClubs.includes(id)
    setJoinedClubs((current) =>
      joined ? current.filter((item) => item !== id) : [...current, id],
    )
    notify(joined ? 'You left the club.' : 'Welcome to the club!')
  }

  const navItems = [
    { label: 'Overview', icon: Home },
    { label: 'Events', icon: CalendarDays },
    { label: 'Community', icon: MessageCircle },
    { label: 'Clubs', icon: Users },
    { label: 'Discover', icon: Compass },
  ]

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
        <a className="brand" href="#home" onClick={() => setActiveTab('Overview')}>
          <span className="brand-mark"><GraduationCap size={24} /></span>
          <span>campus<span className="brand-light">connect</span><small>YOUR CAMPUS, TOGETHER.</small></span>
          <button
            className="mobile-close icon-button"
            aria-label="Close menu"
            onClick={(e) => {
              e.preventDefault()
              setMobileMenu(false)
            }}
          >
            <X size={19} />
          </button>
        </a>

        <div className="workspace-label">YOUR SPACE</div>
        <nav className="main-nav" aria-label="Main navigation">
          {navItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-item ${activeTab === label ? 'nav-active' : ''}`}
              onClick={() => {
                setActiveTab(label)
                setMobileMenu(false)
              }}
            >
              <Icon size={19} strokeWidth={1.8} />
              <span>{label}</span>
              {label === 'Events' && <span className="nav-count">{events.length}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-divider" />
        <div className="workspace-label">YOUR COMMUNITY</div>
        <button className="nav-item" onClick={() => setActiveTab('Clubs')}>
          <Heart size={19} strokeWidth={1.8} /><span>My clubs</span>
        </button>
        <button className="nav-item" onClick={() => setActiveTab('Events')}>
          <Bookmark size={19} strokeWidth={1.8} /><span>Saved events</span>
          {savedEvents.length > 0 && <span className="nav-count">{savedEvents.length}</span>}
        </button>

        <div className="sidebar-bottom">
          <div className="sidebar-promo">
            <span className="promo-icon"><Sparkles size={18} /></span>
            <strong>Make campus yours.</strong>
            <p>Find your people. Discover your next thing.</p>
            <button onClick={() => setActiveTab('Discover')}>Explore campus <ArrowUpRight size={15} /></button>
          </div>
          <div className="profile-row">
            <div className="profile-avatar">YO</div>
            <div className="profile-copy"><strong>Your profile</strong><span>Campus member</span></div>
            <span className="online-dot" />
          </div>
        </div>
      </aside>

      {mobileMenu && <button className="mobile-overlay" aria-label="Close navigation" onClick={() => setMobileMenu(false)} />}

      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu-button icon-button" aria-label="Open menu" onClick={() => setMobileMenu(true)}><Menu size={21} /></button>
          <div className="breadcrumb"><span>Campus</span><span className="breadcrumb-slash">/</span><strong>{activeTab}</strong></div>
          <div className="topbar-right">
            <label className="search-box">
              <Search size={17} />
              <input
                aria-label="Search campus"
                placeholder="Search anything..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <kbd>⌘ K</kbd>
            </label>
            <button className="icon-button notification-button" aria-label="Notifications" onClick={() => notify('You’re all caught up!')}><Bell size={19} /><span /></button>
            <div className="top-avatar">YO</div>
          </div>
        </header>

        <div className="page-content">
          {activeTab === 'Overview' && (
            <>
              <section className="welcome-row">
                <div>
                  <div className="eyebrow"><span className="eyebrow-dot" /> YOUR CAMPUS COMMUNITY</div>
                  <h1>A little more <span>connected.</span></h1>
                  <p className="welcome-subtitle">Your campus life, all in one place. Find events, meet people, and make every day count.</p>
                </div>
                <button className="primary-button" onClick={() => setShowEventForm(true)}><Plus size={18} /> Create an event</button>
              </section>

              <section className="hero-banner">
                <div className="hero-copy">
                  <span className="hero-kicker"><Sparkles size={14} /> THERE’S MORE HAPPENING HERE</span>
                  <h2>Your next great<br />campus moment<br /><em>starts here.</em></h2>
                  <p>Discover the people, passions, and possibilities waiting just around the corner.</p>
                  <button className="hero-button" onClick={() => setActiveTab('Events')}>Explore upcoming events <ArrowUpRight size={16} /></button>
                </div>
                <div className="hero-art" aria-hidden="true">
                  <div className="art-orbit orbit-one" />
                  <div className="art-orbit orbit-two" />
                  <div className="art-star star-one">✳</div>
                  <div className="art-star star-two">✦</div>
                  <div className="art-circle circle-one" />
                  <div className="art-circle circle-two" />
                  <div className="art-circle circle-three" />
                  <div className="art-card card-one"><CalendarDays size={22} /><span>Good things<br />are happening</span></div>
                  <div className="art-card card-two"><Users size={21} /><span>Find your<br />people</span></div>
                  <div className="art-center"><GraduationCap size={54} strokeWidth={1.4} /></div>
                </div>
                <div className="hero-index">01 — CAMPUS LIFE, REIMAGINED</div>
              </section>

              <section className="stats-grid" aria-label="Campus overview">
                <div className="stat-card"><span className="stat-icon stat-lilac"><CalendarDays size={19} /></span><div className="stat-label">UPCOMING EVENTS</div><div className="stat-bottom"><strong>{events.length}</strong><span>to discover <ArrowUpRight size={13} /></span></div></div>
                <div className="stat-card"><span className="stat-icon stat-peach"><Users size={19} /></span><div className="stat-label">CLUBS TO EXPLORE</div><div className="stat-bottom"><strong>{clubs.length}</strong><span>find your people <ArrowUpRight size={13} /></span></div></div>
                <div className="stat-card"><span className="stat-icon stat-green"><Heart size={19} /></span><div className="stat-label">YOUR CLUBS</div><div className="stat-bottom"><strong>{joinedClubs.length}</strong><span>joined by you</span></div></div>
                <div className="stat-card"><span className="stat-icon stat-blue"><Bookmark size={19} /></span><div className="stat-label">SAVED EVENTS</div><div className="stat-bottom"><strong>{savedEvents.length}</strong><span>for later</span></div></div>
              </section>

              <section className="content-section">
                <div className="section-heading"><div><div className="eyebrow">MARK YOUR CALENDAR</div><h2>Coming up on campus <span className="heading-period">.</span></h2></div><button className="text-button" onClick={() => setActiveTab('Events')}>All events <ArrowUpRight size={16} /></button></div>
                <div className="events-grid">
                  {events.slice(0, 3).map((event) => <EventCard key={event.id} event={event} registered={registered.includes(event.id)} saved={savedEvents.includes(event.id)} onRegister={() => toggleRegistration(event.id)} onSave={() => setSavedEvents((current) => current.includes(event.id) ? current.filter((id) => id !== event.id) : [...current, event.id])} />)}
                </div>
              </section>

              <section className="content-section community-preview">
                <div className="section-heading"><div><div className="eyebrow">THE CAMPUS CONVERSATION</div><h2>From your community <span className="heading-period">.</span></h2></div><button className="text-button" onClick={() => setActiveTab('Community')}>View community <ArrowUpRight size={16} /></button></div>
                <div className="posts-grid">
                  {posts.slice(0, 2).map((post) => <PostCard key={post.id} post={post} onLike={() => toggleLike(post.id)} />)}
                </div>
              </section>
            </>
          )}

          {activeTab === 'Events' && (
            <section className="inner-page">
              <div className="page-title-row"><div><div className="eyebrow">MAKE IT HAPPEN</div><h1>Campus <span>events.</span></h1><p>Find your next favourite memory.</p></div><button className="primary-button" onClick={() => setShowEventForm(true)}><Plus size={18} /> Create event</button></div>
              <div className="filter-row">{['All', 'DESIGN', 'TECHNOLOGY', 'CULTURE', 'CAMPUS'].map((filter) => <button key={filter} className={`filter-chip ${eventFilter === filter ? 'filter-active' : ''}`} onClick={() => setEventFilter(filter)}>{filter}</button>)}</div>
              <div className="events-grid event-list">{filteredEvents.length ? filteredEvents.map((event) => <EventCard key={event.id} event={event} registered={registered.includes(event.id)} saved={savedEvents.includes(event.id)} onRegister={() => toggleRegistration(event.id)} onSave={() => setSavedEvents((current) => current.includes(event.id) ? current.filter((id) => id !== event.id) : [...current, event.id])} />) : <EmptyState title="No events found" description="Try a different search or category." />}</div>
              <div className="registered-note"><CalendarDays size={18} /> You’re registered for <strong>{registered.length}</strong> event{registered.length === 1 ? '' : 's'}.</div>
            </section>
          )}

          {activeTab === 'Community' && (
            <section className="inner-page">
              <div className="page-title-row"><div><div className="eyebrow">BETTER TOGETHER</div><h1>The campus <span>conversation.</span></h1><p>Ideas, opportunities, and little moments worth sharing.</p></div><button className="primary-button" onClick={() => setShowPostForm(true)}><Plus size={18} /> Write a post</button></div>
              {showPostForm && <div className="composer panel"><div className="profile-avatar">YO</div><div className="composer-main"><textarea value={newPost} onChange={(e) => setNewPost(e.target.value)} placeholder="What's happening on your campus?" rows={3} /><div className="composer-actions"><button className="text-button" onClick={() => setShowPostForm(false)}>Cancel</button><button className="primary-button" onClick={addPost}>Publish post <ArrowUpRight size={15} /></button></div></div></div>}
              <div className="posts-grid community-list">{filteredPosts.map((post) => <PostCard key={post.id} post={post} onLike={() => toggleLike(post.id)} />)}</div>
              {!filteredPosts.length && <EmptyState title="No posts found" description="Try another search, or start a conversation." />}
            </section>
          )}

          {activeTab === 'Clubs' && (
            <section className="inner-page">
              <div className="page-title-row"><div><div className="eyebrow">FIND YOUR PEOPLE</div><h1>Belong to <span>something.</span></h1><p>Explore communities that share what you love.</p></div><div className="club-count">{joinedClubs.length} joined</div></div>
              <div className="clubs-grid">{filteredClubs.map((club) => <article className="club-card" key={club.id}><div className={`club-art ${club.color}`}><span>{club.icon}</span><span className="club-art-orbit" /></div><div className="club-info"><span className="club-category">{club.category}</span><h3>{club.name}</h3><p>{club.members + (joinedClubs.includes(club.id) ? 1 : 0)} campus members</p><button className={`club-join ${joinedClubs.includes(club.id) ? 'club-joined' : ''}`} onClick={() => toggleClub(club.id)}>{joinedClubs.includes(club.id) ? 'Joined ✓' : 'Join community'}</button></div></article>)}</div>
              {!filteredClubs.length && <EmptyState title="No clubs found" description="Try another search." />}
            </section>
          )}

          {activeTab === 'Discover' && (
            <section className="inner-page">
              <div className="eyebrow">YOUR NEXT CHAPTER</div><h1>There’s more to <span>discover.</span></h1><p className="discover-intro">Campus life is full of possibilities. Start with something that interests you.</p>
              <div className="discover-grid">
                <button className="discover-card discover-events" onClick={() => setActiveTab('Events')}><CalendarDays size={26} /><span>01 / GET INVOLVED</span><h2>Show up<br />for something.</h2><p>Workshops, meetups, and moments worth remembering.</p><ArrowUpRight size={20} /></button>
                <button className="discover-card discover-clubs" onClick={() => setActiveTab('Clubs')}><Users size={26} /><span>02 / FIND YOUR PEOPLE</span><h2>Good things<br />grow together.</h2><p>Meet your community and find a place to belong.</p><ArrowUpRight size={20} /></button>
                <button className="discover-card discover-community" onClick={() => setActiveTab('Community')}><MessageCircle size={26} /><span>03 / JOIN THE CONVERSATION</span><h2>Your voice<br />belongs here.</h2><p>Share an idea, find collaborators, start something.</p><ArrowUpRight size={20} /></button>
              </div>
              <section className="content-section"><div className="section-heading"><div><div className="eyebrow">DON'T MISS OUT</div><h2>Events worth a look <span className="heading-period">.</span></h2></div><button className="text-button" onClick={() => setActiveTab('Events')}>All events <ArrowUpRight size={16} /></button></div><div className="events-grid">{events.slice(0, 3).map((event) => <EventCard key={event.id} event={event} registered={registered.includes(event.id)} saved={savedEvents.includes(event.id)} onRegister={() => toggleRegistration(event.id)} onSave={() => setSavedEvents((current) => current.includes(event.id) ? current.filter((id) => id !== event.id) : [...current, event.id])} />)}</div></section>
            </section>
          )}

          <footer className="footer"><span>campusconnect<span className="footer-dot">.</span></span><span>Made for campus life, and everyone in it.</span><span>© 2026 CampusConnect</span></footer>
        </div>
      </main>

      {showEventForm && <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowEventForm(false) }}><form className="modal" onSubmit={(e) => { e.preventDefault(); addEvent() }}><button type="button" className="modal-close icon-button" aria-label="Close" onClick={() => setShowEventForm(false)}><X size={20} /></button><div className="eyebrow">BRING PEOPLE TOGETHER</div><h2>Create a campus event</h2><p>Have something worth sharing? Put it on the calendar.</p><label>Event name<input required value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} placeholder="e.g. Weekend design jam" /></label><label>Date<input required type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} /></label><label>Location<input required value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} placeholder="e.g. Innovation Hub" /></label><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setShowEventForm(false)}>Cancel</button><button type="submit" className="primary-button">Create event <ArrowUpRight size={16} /></button></div></form></div>}

      {notice && <div className="toast" role="status"><span className="toast-check">✓</span>{notice}</div>}
    </div>
  )
}

type Post = (typeof initialPosts)[number]

function EventCard({ event, registered, saved, onRegister, onSave }: { event: EventItem; registered: boolean; saved: boolean; onRegister: () => void; onSave: () => void }) {
  return (
    <article className="event-card">
      <div className={`event-art art-${event.color}`}>
        <div className="event-date"><strong>{event.date.split(' ')[0]}</strong><span>{event.date.split(' ').slice(1).join(' ')}</span></div>
        <span className="event-art-symbol">{event.category === 'TECHNOLOGY' ? '⌘' : event.category === 'CULTURE' ? '✳' : event.category === 'DESIGN' ? '✦' : '◌'}</span>
        <button className={`save-button ${saved ? 'is-saved' : ''}`} aria-label={saved ? 'Remove saved event' : 'Save event'} onClick={onSave}><Bookmark size={17} fill={saved ? 'currentColor' : 'none'} /></button>
      </div>
      <div className="event-info"><span className="event-category">{event.category}</span><h3>{event.title}</h3><div className="event-meta"><span><Clock3 size={14} />{event.time}</span><span><MapPin size={14} />{event.location}</span></div><div className="event-card-bottom"><span className="attendee-count"><Users size={14} />{event.attendees + (registered ? 1 : 0)} going</span><button className={`event-register ${registered ? 'registered' : ''}`} onClick={onRegister}>{registered ? 'Registered ✓' : 'Join event'} <ArrowUpRight size={14} /></button></div></div>
    </article>
  )
}

function PostCard({ post, onLike }: { post: Post; onLike: () => void }) {
  return (
    <article className="post-card"><div className="post-author"><div className={`post-avatar ${post.color}`}>{post.initials}</div><div className="post-author-copy"><strong>{post.name}</strong><span>{post.role}</span></div><button className="post-more icon-button" aria-label="More post options">···</button></div><p className="post-text">{post.text}</p><div className="post-actions"><button className={post.liked ? 'liked' : ''} onClick={onLike}><Heart size={17} fill={post.liked ? 'currentColor' : 'none'} />{post.likes} likes</button><button><MessageCircle size={17} />{post.comments} comments</button></div></article>
  )
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="empty-state"><Search size={25} /><h3>{title}</h3><p>{description}</p></div>
}

export default App
