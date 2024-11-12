export default function CellButton({onClick, showImage}){
  return(
    <div>
      <button onClick={onClick}>
        {showImage ? "Ocultar" : "Mostrar"}
      </button>
    </div>
  )
}