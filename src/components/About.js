import React, {useContext} from 'react'
import noteContext from '../context/notes/noteContext'
import { useEffect } from 'react'

function About() {
    const a = useContext(noteContext)
    useEffect(() => {
        a.update()
    }, [])
    return (
        <div>
            This is about {a.state.name} studying in {a.state.class}
        </div>
    )
}

export default About
