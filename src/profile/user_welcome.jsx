import { useState } from "react"

export default function UserWelcome() {

    const [nombre, setNombre] = useState(null)

    function handleChange(nombre) {
        setNombre(nombre);
    }

    return (
        <>
        <h2>Mi primer componente!</h2>
        <input 
            onChange={inp => handleChange(inp.target.value)}
        />
        <p>Bienvenid@, { nombre }!</p>
        </>
    )
}