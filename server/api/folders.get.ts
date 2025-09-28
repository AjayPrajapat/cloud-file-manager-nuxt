import { listFolders } from '../utils/db'

export default defineEventHandler(() => {
  return listFolders()
})
