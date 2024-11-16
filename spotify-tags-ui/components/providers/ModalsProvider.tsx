import { FC, PropsWithChildren } from 'react'
import AddMoreTagsModal from '../modals/AddMoreTagsModal'

const ModalsProvider: FC<PropsWithChildren> = ({ children }) => (
  <>
    {children}
    <AddMoreTagsModal />
  </>
)


export default ModalsProvider