interface Props {
  onStart: () => void;
}

export function StartScreen({ onStart }: Props) {
  return (
    <div className="start-screen">
      <h1 className="game-title">テトリス</h1>
      <div className="key-guide">
        <table>
          <tbody>
            <tr><td>← →</td><td>左右移動</td></tr>
            <tr><td>↓</td><td>ソフトドロップ</td></tr>
            <tr><td>↑ / X</td><td>右回転</td></tr>
            <tr><td>Z</td><td>左回転</td></tr>
            <tr><td>Space</td><td>ハードドロップ</td></tr>
            <tr><td>Esc / P</td><td>一時停止</td></tr>
          </tbody>
        </table>
      </div>
      <button className="btn btn--primary btn--lg" onClick={onStart}>
        スタート
      </button>
    </div>
  );
}
