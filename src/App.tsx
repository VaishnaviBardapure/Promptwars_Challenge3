import { useEffect, useMemo, useState } from 'react'

type FormState = {
  transport: number
  electricity: number
  diet: 'meat' | 'balanced' | 'vegetarian' | 'vegan'
  waste: number
  digital: number
  name: string
}

type Recommendation = {
  id: number
  title: string
  description: string
  category: string
}

type Entry = FormState & {
  score: number
  createdAt: string
}

const initialState: FormState = {
  transport: 30,
  electricity: 220,
  diet: 'balanced',
  waste: 6,
  digital: 35,
  name: ''
}

const dietFactor: Record<FormState['diet'], number> = {
  meat: 2.0,
  balanced: 1.3,
  vegetarian: 1.05,
  vegan: 0.8
}

const categories = [
  {
    key: 'transport',
    label: 'Transport (km/week)',
    min: 0,
    max: 200,
    step: 5,
    unit: 'km',
    help: 'Private car, rideshare and short flights'
  },
  {
    key: 'electricity',
    label: 'Electricity Use (kWh/month)',
    min: 50,
    max: 600,
    step: 10,
    unit: 'kWh',
    help: 'Home appliances, heating, cooling, lighting'
  },
  {
    key: 'waste',
    label: 'Waste generation (kg/week)',
    min: 0,
    max: 15,
    step: 1,
    unit: 'kg',
    help: 'Recycling, composting, and landfill waste'
  },
  {
    key: 'digital',
    label: 'Digital usage (hours/day)',
    min: 0,
    max: 72,
    step: 1,
    unit: 'hrs',
    help: 'Streaming, devices and cloud service use'
  }
]

const getTier = (score: number) => {
  if (score < 120) return ['Green', 'Excellent. You are leading by example.']
  if (score < 185) return ['Amber', 'Good progress, keep refining daily habits.']
  return ['Red', 'High footprint. Focus on high-impact reductions now.']
}

const deriveAdvice = (score: number) => {
  if (score < 120) return 'Keep the momentum. Share your habits and aim for zero-waste routines.'
  if (score < 185) return 'Swap one medium-impact habit for a lower-impact choice this week.'
  return 'Cut the biggest emissions first: travel, electricity, and diet changes.'
}

const formatNumber = (value: number) => value.toFixed(1)

export default function App() {
  const [form, setForm] = useState<FormState>(initialState)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [history, setHistory] = useState<Entry[]>([])
  const [saved, setSaved] = useState(false)

  const score = useMemo(() => {
    return (
      Math.round(
        form.transport * 0.14 +
          form.electricity * 0.28 +
          dietFactor[form.diet] * 80 +
          form.waste * 3.1 +
          form.digital * 0.9
      )
    )
  }, [form])

  const [tier, advice] = useMemo(() => [getTier(score), deriveAdvice(score)], [score])

  useEffect(() => {
    const savedHistory = window.localStorage.getItem('carbon-history')
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem('carbon-history', JSON.stringify(history))
  }, [history])

  useEffect(() => {
    async function loadRecommendations() {
      try {
        const response = await fetch('/api/actions')
        if (response.ok) {
          const data = await response.json()
          setRecommendations(data)
        }
      } catch (error) {
        console.warn('Recommendation service unavailable', error)
      }
    }
    loadRecommendations()
  }, [])

  const handleChange = (field: string, value: string | number) => {
    setForm((current) => ({
      ...current,
      [field]: value
    }))
    setSaved(false)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const entry: Entry = {
      ...form,
      score,
      createdAt: new Date().toISOString()
    }
    setHistory((current) => [entry, ...current].slice(0, 6))
    setSaved(true)
  }

  const historyTotal = history.reduce((sum, entry) => sum + entry.score, 0)
  const average = history.length ? Math.round(historyTotal / history.length) : 0

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <span className="eyebrow">PromptWars Challenge 3</span>
          <h1>Carbon Footprint Awareness Platform</h1>
          <p>
            Understand your daily footprint, track improvements, and get actionable guidance with a crafted climate dashboard.
          </p>
        </div>
        <div className="hero-card">
          <p className="hero-card-title">Your Insight Score</p>
          <p className="hero-card-value">{score}</p>
          <p className="hero-card-label">{tier[0]} tier</p>
        </div>
      </header>

      <main>
        <section className="grid-2">
          <article className="panel">
            <div className="panel-head">
              <h2>Calculate your footprint</h2>
              <p>Enter habits from transport, home energy, lifestyle, and waste to see your impact.</p>
            </div>
            <form className="survey" onSubmit={handleSubmit}>
              <label className="field-group">
                <span>Your name</span>
                <input
                  value={form.name}
                  onChange={(event) => handleChange('name', event.target.value)}
                  placeholder="Enter your name"
                />
              </label>

              {categories.map((category) => (
                <label key={category.key} className="field-group range-group">
                  <div className="field-header">
                    <span>{category.label}</span>
                    <small>{form[category.key as keyof FormState]} {category.unit}</small>
                  </div>
                  <input
                    type="range"
                    min={category.min}
                    max={category.max}
                    step={category.step}
                    value={form[category.key as keyof FormState] as number}
                    onChange={(event) => handleChange(category.key, Number(event.target.value))}
                  />
                  <small className="field-help">{category.help}</small>
                </label>
              ))}

              <label className="field-group">
                <span>Diet profile</span>
                <select
                  value={form.diet}
                  onChange={(event) => handleChange('diet', event.target.value)}
                >
                  <option value="meat">Meat-forward</option>
                  <option value="balanced">Balanced</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                </select>
                <small className="field-help">Food choices are a powerful way to reduce emissions.</small>
              </label>

              <div className="summary-card">
                <div>
                  <span>Estimated monthly CO₂ equivalent</span>
                  <strong>{formatNumber(score * 0.45)} kg</strong>
                </div>
                <div className="badge">{tier[0]}</div>
              </div>

              <button type="submit" className="cta">Save footprint</button>
              {saved && <p className="toast">Saved to local history. Review your progress below.</p>}
            </form>
          </article>

          <aside className="panel panel-glow">
            <h2>Personalized insights</h2>
            <p>{tier[1]}</p>
            <div className="metrics-grid">
              <div>
                <span>Weekly transport</span>
                <strong>{form.transport} km</strong>
              </div>
              <div>
                <span>Energy use</span>
                <strong>{form.electricity} kWh</strong>
              </div>
              <div>
                <span>Waste output</span>
                <strong>{form.waste} kg</strong>
              </div>
              <div>
                <span>Digital time</span>
                <strong>{form.digital} hrs</strong>
              </div>
            </div>

            <div className="advice-box">
              <h3>Quick action</h3>
              <p>{advice}</p>
            </div>
          </aside>
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>Recommended climate actions</h2>
            <p>Actionable steps selected for the habits that drive your current footprint.</p>
          </div>
          <div className="action-grid">
            {(recommendations.length ? recommendations : [
              {
                id: 1,
                title: 'Choose cleaner travel',
                description: 'Replace one weekly car trip with a bike, e-scooter, or transit ride.',
                category: 'Transport'
              },
              {
                id: 2,
                title: 'Optimize home energy',
                description: 'Switch to LED lighting and unplug devices when not in use.',
                category: 'Electricity'
              }
            ]).map((item) => (
              <article key={item.id} className="action-card">
                <strong>{item.title}</strong>
                <p>{item.description}</p>
                <span>{item.category}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="panel grid-2">
          <article>
            <h2>Progress history</h2>
            {history.length ? (
              <ul className="log-list">
                {history.map((entry) => (
                  <li key={entry.createdAt}>
                    <div>
                      <strong>{entry.name || 'Anonymous'}</strong>
                      <span>{new Date(entry.createdAt).toLocaleString()}</span>
                    </div>
                    <p>Score: {entry.score} • Diet: {entry.diet} • Electricity: {entry.electricity} kWh</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-state">Complete the form and save measurements to build your footprint history.</p>
            )}
          </article>
          <article className="insight-card">
            <h2>Monthly benchmark</h2>
            <p>Compare your average footprint over saved entries.</p>
            <div className="benchmark">
              <span>Average score</span>
              <strong>{average || '—'}</strong>
            </div>
            <p>
              This dashboard stores your measurements locally so you can revisit the insights and improve over time.
            </p>
          </article>
        </section>
      </main>
    </div>
  )
}
