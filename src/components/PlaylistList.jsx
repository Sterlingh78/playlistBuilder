export default function PlaylistList({ handlePlaylist, ownedPlaylists, user }) {
	return (
		<div className='hero min-h-screen bg-base-200'>
			<div className='hero-content flex-col'>
				<div className='text-center'>
					<h1 className='text-5xl font-bold'>Welcome {user.display_name}!</h1>
					<p className='py-6'>Select a playlist below to view or edit.</p>
				</div>
				<div className='card flex-shrink-0 w-full max-w-md shadow-2xl bg-base-100'>
					<div className='card-body'>
						{ownedPlaylists.map((playlist, i) => {
							return (
								<button
									key={i}
									onClick={() => handlePlaylist(i)}
									className='btn btn-secondary'
								>
									{playlist.name}
								</button>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
