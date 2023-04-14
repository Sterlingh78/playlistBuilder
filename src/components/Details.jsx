import Navbar from './Navbar';

export default function Details({ user, currentPlaylist }) {
	return (
		<div className='drawer'>
			<input
				id='my-drawer'
				type='checkbox'
				className='drawer-toggle'
			/>
			<div className='drawer-content'>
				<Navbar />
				<div>
					<label
						htmlFor='my-drawer'
						className='btn btn-primary drawer-button'
					>
						Open drawer
					</label>
				</div>
			</div>
			<div className='drawer-side'>
				<label
					htmlFor='my-drawer'
					className='drawer-overlay'
				></label>
				<ul className='menu p-4 w-80 bg-base-100 text-base-content'>
					<div>
						<h1 className='ml-2 text-xl my-auto font-bold'>
							{currentPlaylist.name}
						</h1>
						<p className='mb-4'>{currentPlaylist.description}</p>
						<button className=' btn btn-sm btn-primary mb-6'>Edit</button>
					</div>
					{currentPlaylist.tracks.map((trackObj, i) => {
						return (
							<li key={i}>
								<a>{trackObj.track.name}</a>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
}
