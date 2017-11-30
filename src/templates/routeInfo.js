import humanFormat from 'human-format'

const timeScale = new humanFormat.Scale({
    seconds: 1,
    minutes: 60,
    hours: 3600
})

const formatDistance = meters => humanFormat(meters, { unit: 'm', prefix: 'k' })
const formatTime = seconds => humanFormat(seconds, { scale: timeScale })

export default ({ distance, time }) => `
    <div class="panel cf">
        <dl class="ma cf">
            <dt>Distance</dt>
            <dd>${formatDistance(distance)}</dd>
            <dt>Time</dt>
            <dd>${formatTime(time)}</dd>
        </dl>
        <a class="btn btn-restart db" href="#">Restart</a>
    </div>
`
