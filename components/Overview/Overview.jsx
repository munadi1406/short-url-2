import Logs from './Logs'
import Link from './Link'
import Post from './Post'
import LiveView from './LiveView'
import OthersStat from '../Logs/OthersStat'

export default function Overview() {
  return (
    <div className='space-y-2'>
        <Link/>
        <Post/>
        <Logs/>
        <LiveView/>
      
    </div>
  )
}
