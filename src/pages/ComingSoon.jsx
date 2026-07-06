// Tela temporária das abas que ainda vamos construir juntos.
export default function ComingSoon({ title }) {
  return (
    <div className="card soon">
      <div className="ic">🚧</div>
      <b>{title} em breve</b>
      <p>Esta aba ainda não foi construída. Vamos montá-la juntos no próximo passo — você me diz o que ela precisa ter.</p>
    </div>
  )
}
