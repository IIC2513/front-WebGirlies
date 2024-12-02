export default function CellButton({onClick, showImage}){
  return(
    <div>
      <button onClick={onClick}>
        {showImage ? "Show" : "Hide"}
      </button>
    </div>
  )
}