export default function handler(req, res) {
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

    res.status(200).json(recommendations)
}