import Schaukasten from '../schrank/src/components/Schaukasten'

const zweig = process.env.VERCEL_GIT_COMMIT_REF
const commit = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7)

export default function Seite() {
  return <Schaukasten unterzeile={zweig ? `Zweig ${zweig} · ${commit} · Ersatzschrift` : 'lokal · Ersatzschrift'} />
}
