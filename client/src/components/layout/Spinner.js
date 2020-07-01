import React, { Fragment } from 'react'
import spinner from './spinner.png'

export const Spinner = () => {
    return (
        <Fragment>
            <img src={spinner}
            style={{ width: '200px', margin: 'auto', display: 'block'}}
            />
        </Fragment>
    )
}


export default Spinner;