import 'dotenv/config'
import { app } from './app'

const PORT = process.env.API_PORT || 3001

app.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log(`AlgebraQuest API :${PORT}`)
  }
})

