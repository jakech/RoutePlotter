import React from 'react'

export default ({ lat, lng, onDelete }) => (
    <li>
        {`${lat},${lng}`} <button onClick={onDelete}>&times;</button>
    </li>
)
