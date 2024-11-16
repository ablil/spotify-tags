import { store } from '@/lib/store'
import { FC, PropsWithChildren } from 'react'
import { Provider } from 'react-redux'

const StoreProvider: FC<PropsWithChildren> = ({children}) => ( <Provider store={store}> {children} </Provider>)


export default StoreProvider