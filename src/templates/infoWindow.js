export default ({ lat, lng, address }) => `
    <div>
        <h5>${address}</h5>
        <dl class="cf">
            <dt>Lat</dt>
            <dd>${lat}</dd>
            <dt>Lng</dt>
            <dd>${lng}</dd>
        </dl>
        <button class="js-addToRoute">Add to route</button>
    </div>
`
