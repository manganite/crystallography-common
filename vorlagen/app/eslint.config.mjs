// ESLint (LEITFADEN.md, Abschn. 9): npx eslint .  (in der CI der Job „lint“; Pakete in tools/common/eslint-basis.mjs)
import basis from './tools/common/eslint-basis.mjs';

// Fremdcode der App hier ergänzen, z. B. basis({ ignores: ['lib/three.bundle.js'] })
export default basis();
