import { useState } from 'react';
import AddModal from './AddModal';
import '../App.css';
export default function PlaylistList({
	handlePlaylist,
	ownedPlaylists,
	user,
	getPlaylists,
}) {
	const [hovered, setHovered] = useState(null);
	const handleMouseOver = (index) => {
		setHovered(index);
	};
	const handleMouseLeave = () => {
		setHovered(null);
	};
	const handleUnfollow = async (index) => {
		console.log(ownedPlaylists[index]);

		try {
			const response = await fetch(
				`https://api.spotify.com/v1/playlists/${ownedPlaylists[index].id}/followers`,
				{
					headers: {
						Authorization: 'Bearer ' + localStorage.getItem('access-token'),
					},
					method: 'DELETE',
				}
			);
			const string = await response.text();
			const json = string === '' ? {} : JSON.parse(string);
			console.log('delete test', json);
			getPlaylists(user);
		} catch (err) {
			console.log(err);
		}
	};
	console.log('hovered', hovered);
	return (
		<div>
			<AddModal
				getPlaylists={getPlaylists}
				user={user}
			/>
			<div className='hero min-h-screen bg-base-200'>
				<div className='hero-content flex-col'>
					<div className='text-center'>
						<h1 className='text-5xl font-bold'>Welcome {user.display_name}!</h1>
						<p className='py-6'>Select a playlist below to view or edit.</p>
					</div>
					<div className='card flex-shrink-0 w-full max-w-md shadow-2xl bg-base-100'>
						<div className='card-body'>
							<label
								htmlFor='my-modal'
								className='btn btn-primary w-36'
							>
								New Playlist
							</label>
							{ownedPlaylists.map((playlist, i) => {
								return (
									<div
										key={i}
										className=' flex'
										onMouseOver={() => handleMouseOver(i)}
										onMouseLeave={handleMouseLeave}
									>
										<button
											onClick={() => handlePlaylist(i)}
											className={`btn btn-secondary ${
												hovered === i ? 'w-5/6' : 'w-full'
											}`}
										>
											{playlist.name}
										</button>
										<button
											onClick={() => handleUnfollow(i)}
											className={`${
												hovered === i ? 'w-1/6' : 'hidden'
											} btn btn-primary ml-1`}
										>
											<svg
												xmlns='http://www.w3.org/2000/svg'
												width='24'
												height='24'
												viewBox='0 0 24 24'
												fill='none'
												stroke='#000000'
												strokeWidth='2'
												strokeLinecap='round'
												strokeLinejoin='round'
											>
												<line
													x1='5'
													y1='12'
													x2='19'
													y2='12'
												></line>
											</svg>
										</button>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
