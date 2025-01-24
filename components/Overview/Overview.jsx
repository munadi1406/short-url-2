import Logs from './Logs'
import Link from './Link'
import Post from './Post'

export default function Overview() {
  return (
    <div className='space-y-2'>
        <Link/>
        <Post/>
        <Logs/>
    </div>
  )
}
