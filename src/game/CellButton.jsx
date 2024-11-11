

export default function CellButton({onClick, label}){
  return(
    <div>
      <button onClick={onClick}>
        {showImage ? "Ocultar" : "Mostrar"}
      </button>
    </div>
  )
}