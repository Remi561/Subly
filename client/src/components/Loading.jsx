
import {Spinner} from '@/components/ui/spinner'

const Loading = () => {
  return (
    <div className={'h-screen w-full flex items-center justify-center'}>
    <Spinner className={'size-10'} />
    </div>
  )
}

export default Loading