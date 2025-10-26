import Logs from './Logs'
import Link from './Link'
import Post from './Post'
import LiveView from './LiveView'
import OthersStat from '../Logs/OthersStat'
import StatAverage from './StatAverage'

export default function Overview() {
  return (
    <div className='space-y-2'>
        <Link/>
        <StatAverage/>
        <Post/>
        <Logs/>
        <LiveView/>
      
    </div>
  )
}
