// ESLint (LEITFADEN.md, Abschn. 9): npx eslint .  (in der CI der Job „lint“; Pakete siehe tools/eslint-basis.mjs)
import basis from './tools/eslint-basis.mjs';

// Die Vorlage wird mit ihrer eigenen eslint.config.mjs geprüft (CI, nach node tools/sync.mjs vorlagen/app).
export default basis({ ignores: ['vorlagen/app/**'] });
