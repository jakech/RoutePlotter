import React from 'react'

export default ({lat, lng, onClick}) => <li onClick={onClick}>{`${lat},${lng}`}</li>
