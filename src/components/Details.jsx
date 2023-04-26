import { useState } from 'react';
import SearchBar from './SearchBar';
import EditModal from './EditModal';
import Albums from './Albums';
import Artists from './Artists';
import Tracks from './Tracks';
import Album from './Album';

export default function Details({
	currentPlaylist,
	handlePlaylist,
	handleBackArrow,
}) {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [searchData, setSearchData] = useState(null);
	const [currentState, setCurrentState] = useState(null);
	const [albumData, setAlbumData] = useState(null);
	const handleDrawer = () => {
		setDrawerOpen(!drawerOpen);
	};
	const passSearchData = (data) => {
		setSearchData(data);
		setCurrentState('search');
	};
	const clearSearch = () => {
		setSearchData(null);
	};
	const handleAlbumClick = async (id, name, artist, imageUrl) => {
		console.log('album id: ', id);

		const response = await fetch(
			`https://api.spotify.com/v1/albums/${id}/tracks?limit=50`,
			{
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('access-token'),
				},
			}
		);
		const data = await response.json();
		console.log('album test', data);
		setAlbumData({
			name: name,
			artist: artist,
			imageUrl: imageUrl,
			items: data,
		});
		setCurrentState('album');
	};
	let content;
	if (currentState === null) {
		content = '';
	} else if (currentState === 'search') {
		content = (
			<div>
				<Tracks searchData={searchData} />
				<Artists searchData={searchData} />
				<Albums
					handleAlbumClick={handleAlbumClick}
					searchData={searchData}
				/>
			</div>
		);
	} else if (currentState === 'album') {
		content = <Album albumData={albumData} />;
	}
	return (
		<div>
			<EditModal
				currentPlaylist={currentPlaylist}
				handlePlaylist={handlePlaylist}
			/>
			<div className='drawer'>
				<input
					checked={drawerOpen}
					readOnly
					id='my-drawer'
					type='checkbox'
					className='drawer-toggle'
				/>
				<div className='drawer-content'>
					<SearchBar
						handleDrawer={handleDrawer}
						currentPlaylist={currentPlaylist}
						passSearchData={passSearchData}
						clearSearch={clearSearch}
					/>
					{content}
				</div>
				<div className='drawer-side'>
					<label
						onClick={handleDrawer}
						htmlFor='my-drawer'
						className='drawer-overlay'
					></label>
					<ul className='menu p-4 w-80 bg-base-100 text-base-content'>
						<div>
							<button
								onClick={handleBackArrow}
								className='btn btn-circle btn-outline mb-4'
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
									<path d='M19 12H6M12 5l-7 7 7 7' />
								</svg>
							</button>

							<h1 className='ml-2 text-xl my-auto font-bold'>
								{currentPlaylist.name}
							</h1>
							<p className='mb-4'>{currentPlaylist.description}</p>
							<label
								htmlFor='my-modal'
								className=' btn btn-sm btn-primary mb-6'
							>
								Edit
							</label>
						</div>
						{currentPlaylist.tracks.map((trackObj, i) => {
							return (
								<li key={i}>
									<a>{trackObj?.track?.name}</a>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
		</div>
	);
}
