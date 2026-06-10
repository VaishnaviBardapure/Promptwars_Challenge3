import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(
    import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()
const port = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

const recommendations = [{
        id: 1,
        title: 'Ride share or bike more often',
        description: 'Reduce car mileage by choosing public transit, biking, or walking for short trips.',
        category: 'Transport'
    },
    {
        id: 2,
        title: 'Make energy-efficient swaps',
        description: 'Install LEDs, set thermostats 2°C lower in winter, and unplug idle electronics.',
        category: 'Electricity'
    },
    {
        id: 3,
        title: 'Reduce food waste and meat intake',
        description: 'Plan meals, eat plant-forward dishes, and compost food scraps where possible.',
        category: 'Diet'
    },
    {
        id: 4,
        title: 'Cut digital footprint',
        description: 'Stream in standard resolution, delete old files, and switch off unused cloud backups.',
        category: 'Digital'
    }
]

app.get('/api/actions', (req, res) => {
    res.json(recommendations)
})

const staticDist = path.join(__dirname, '..', 'dist')
const shouldServeClient = process.env.NODE_ENV === 'production' || process.env.SERVE_DIST === 'true'

if (shouldServeClient) {
    app.use(express.static(staticDist))
    app.get('*', (req, res) => {
        res.sendFile(path.join(staticDist, 'index.html'))
    })
}

app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend API running on http://localhost:${port}`)
})