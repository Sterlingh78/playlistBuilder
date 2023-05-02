import { useState, useRef } from 'react';
import SearchBar from './SearchBar';
import EditModal from './EditModal';
import Albums from './Albums';
import Artists from './Artists';
import Tracks from './Tracks';
import Album from './Album';
import Artist from './Artist';

export default function Details({ currentPlaylist, handlePlaylist }) {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [searchData, setSearchData] = useState(null);
	const [currentState, setCurrentState] = useState(null);
	const [albumData, setAlbumData] = useState(null);
	const [artistData, setArtistData] = useState(null);
	const [bannerStyle, setBannerStyle] = useState('');
	const [bannerText, setBannerText] = useState('');
	const [bannerVisible, setBannerVisible] = useState(false);
	const [hovered, setHovered] = useState(null);
	const search = useRef();
	const handleTrackMouseOver = (index) => {
		setHovered(index);
	};
	const handleTrackMouseLeave = () => {
		setHovered(null);
	};
	const timeConvert = (ms) => {
		let totalSeconds = Math.floor(ms / 1000);
		let minutes = Math.floor(totalSeconds / 60);
		let seconds = totalSeconds % 60;
		return `${minutes.toString().padStart(2, '0')}:${seconds
			.toString()
			.padStart(2, '0')}`;
	};
	const showAlert = (type, text) => {
		const style = type === 'success' ? 'alert-success' : 'alert-error';
		setBannerStyle(style);
		setBannerText(text);
		setBannerVisible(true);
		setTimeout(() => {
			setBannerVisible(false);
		}, 2000);
	};
	const handleDrawer = () => {
		if (!drawerOpen) {
			setDrawerOpen(true);
		}
	};
	const handleMouseLeave = () => {
		setDrawerOpen(false);
	};
	const passSearchData = (data) => {
		setSearchData(data);
		setCurrentState('search');
	};
	const clearSearch = () => {
		setSearchData(null);
		setCurrentState('search');
	};
	const addTrack = async (uri) => {
		const id = currentPlaylist.id;

		try {
			const response = await fetch(
				`https://api.spotify.com/v1/playlists/${id}/tracks?uris=${uri}`,
				{
					headers: {
						Authorization: 'Bearer ' + localStorage.getItem('access-token'),
					},
					method: 'POST',
				}
			);
			const string = await response.text();
			const json = string === '' ? {} : JSON.parse(string);
			//console.log('add test', json);
			handlePlaylist(currentPlaylist.id);
			showAlert('success', 'Song Added!');
		} catch (err) {
			console.log(err);
		}
	};
	const removeTrack = async (uri) => {
		const id = currentPlaylist.id;
		try {
			const response = await fetch(
				`https://api.spotify.com/v1/playlists/${id}/tracks`,
				{
					headers: {
						Authorization: 'Bearer ' + localStorage.getItem('access-token'),
					},
					method: 'DELETE',
					body: JSON.stringify({
						tracks: [{ uri: uri }],
					}),
				}
			);
			const string = await response.text();
			const json = string === '' ? {} : JSON.parse(string);
			//console.log('delete test', json);
			handlePlaylist(currentPlaylist.id);
			showAlert('success', 'Song Deleted!');
		} catch (err) {
			console.log(err);
		}
	};
	const handleAlbumClick = async (id, name, artist, imageUrl) => {
		//console.log('album id: ', id);

		try {
			const response = await fetch(
				`https://api.spotify.com/v1/albums/${id}/tracks?limit=50`,
				{
					headers: {
						Authorization: 'Bearer ' + localStorage.getItem('access-token'),
					},
				}
			);
			const data = await response.json();
			//console.log('album test', data);
			setAlbumData({
				name: name,
				artist: artist,
				imageUrl: imageUrl,
				items: data,
			});
			setCurrentState('album');
			search.current.scrollIntoView();
		} catch (err) {
			console.log(err);
		}
	};
	const getArtistData = async (id, name, imageUrl) => {
		//console.log('fired', id, name, imageUrl);
		return Promise.all([
			fetch(`https://api.spotify.com/v1/artists/${id}/top-tracks?market=ES`, {
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('access-token'),
				},
			}),
			fetch(`https://api.spotify.com/v1/artists/${id}/albums`, {
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('access-token'),
				},
			}),
		])
			.then((responses) =>
				Promise.all(responses.map((response) => response.json()))
			)
			.then((data) => {
				const [data1, data2] = data;
				//console.log('Data from URL 1:', data1);
				//console.log('Data from URL 2:', data2);
				return data;
			})
			.catch((error) => console.error(error));
	};
	const handleArtistClick = async (id, name, imageUrl) => {
		const data = await getArtistData(id, name, imageUrl);
		//console.log('combined', data);

		setArtistData({
			id: id,
			name: name,
			imageUrl: imageUrl,
			topTracks: data[0].tracks,
			albums: data[1].items,
		});
		setCurrentState('artist');
		search.current.scrollIntoView();
	};
	const handleMouseMove = (event) => {
		// Check if mouse is touching left side of screen
		if (event.clientX <= 10) {
			handleDrawer();
			//console.log('tpuched');
		}
	};

	window.addEventListener('mousemove', handleMouseMove);
	let content;
	if (currentState === null) {
		content = '';
	} else if (currentState === 'search') {
		if (searchData !== null) {
			if (
				searchData.hasOwnProperty('artists') &&
				searchData.hasOwnProperty('albums') &&
				searchData.hasOwnProperty('tracks')
			) {
				content = (
					<div className='flex w-full'>
						<div className='w-[25%] '>
							<Artists
								alone={false}
								handleArtistClick={handleArtistClick}
								searchData={searchData}
							/>
						</div>
						<div className='w-[75%] flex flex-col'>
							<Tracks
								alone={false}
								addTrack={addTrack}
								timeConvert={timeConvert}
								searchData={searchData}
							/>
							<Albums
								handleAlbumClick={handleAlbumClick}
								searchData={searchData}
							/>
						</div>
					</div>
				);
			} else if (
				searchData.hasOwnProperty('tracks') &&
				!searchData.hasOwnProperty('artists') &&
				!searchData.hasOwnProperty('albums')
			) {
				content = (
					<div className=' w-1/2 mx-auto'>
						<Tracks
							alone={true}
							addTrack={addTrack}
							timeConvert={timeConvert}
							searchData={searchData}
						/>
					</div>
				);
			} else if (
				searchData.hasOwnProperty('artists') &&
				!searchData.hasOwnProperty('albums') &&
				!searchData.hasOwnProperty('tracks')
			) {
				content = (
					<div className='mx-auto'>
						<Artists
							alone={true}
							handleArtistClick={handleArtistClick}
							searchData={searchData}
						/>
					</div>
				);
			} else if (
				searchData.hasOwnProperty('albums') &&
				!searchData.hasOwnProperty('artists') &&
				!searchData.hasOwnProperty('tracks')
			) {
				content = (
					<div className='w-3/4 mx-auto'>
						<Albums
							alone={true}
							handleAlbumClick={handleAlbumClick}
							searchData={searchData}
						/>
					</div>
				);
			} else if (
				searchData.hasOwnProperty('albums') &&
				searchData.hasOwnProperty('artists') &&
				!searchData.hasOwnProperty('tracks')
			) {
				content = (
					<div className='flex ml-8'>
						<Artists
							alone={true}
							handleArtistClick={handleArtistClick}
							searchData={searchData}
						/>
						<Albums
							alone={true}
							handleAlbumClick={handleAlbumClick}
							searchData={searchData}
						/>
					</div>
				);
			} else if (
				searchData.hasOwnProperty('tracks') &&
				searchData.hasOwnProperty('artists') &&
				!searchData.hasOwnProperty('albums')
			) {
				content = (
					<div className='flex w-full'>
						<div className='w-[25%] '>
							<Artists
								alone={false}
								handleArtistClick={handleArtistClick}
								searchData={searchData}
							/>
						</div>
						<div className='w-[75%]'>
							<Tracks
								alone={true}
								addTrack={addTrack}
								timeConvert={timeConvert}
								searchData={searchData}
							/>
						</div>
					</div>
				);
			} else if (
				searchData.hasOwnProperty('tracks') &&
				searchData.hasOwnProperty('albums') &&
				!searchData.hasOwnProperty('artists')
			) {
				content = (
					<div className='flex'>
						<div className='w-[40%] ml-8'>
							<Tracks
								alone={true}
								addTrack={addTrack}
								timeConvert={timeConvert}
								searchData={searchData}
							/>
						</div>
						<div className='w-[60%]'>
							<Albums
								alone={true}
								handleAlbumClick={handleAlbumClick}
								searchData={searchData}
							/>
						</div>
					</div>
				);
			}
		}
	} else if (currentState === 'album') {
		content = (
			<Album
				addTrack={addTrack}
				timeConvert={timeConvert}
				albumData={albumData}
			/>
		);
	} else if (currentState === 'artist') {
		content = (
			<Artist
				addTrack={addTrack}
				artistData={artistData}
				timeConvert={timeConvert}
				handleAlbumClick={handleAlbumClick}
			/>
		);
	}
	return (
		<div>
			<EditModal
				showAlert={showAlert}
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
					<div
						className={`alert ${bannerStyle} fixed top-0 z-50 shadow-lg mx-auto ${
							bannerVisible ? '' : 'hidden'
						}`}
					>
						<div>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='stroke-current flex-shrink-0 h-6 w-6'
								fill='none'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth='2'
									d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
								/>
							</svg>
							<span>{bannerText}</span>
						</div>
					</div>
					<SearchBar
						ref={search}
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
					<ul
						onMouseLeave={handleMouseLeave}
						className='menu w-80 bg-base-100 text-base-content'
					>
						<div className='p-4 bg-base-200 mb-2'>
							<div className='flex justify-between items-center mb-4'>
								<h1 className=' text-3xl text-[hsl(var(--p))] my-auto font-bold'>
									{currentPlaylist.name}
								</h1>
								<label
									htmlFor='my-modal'
									className='btn btn-outline btn-primary btn-sm'
								>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										width='17'
										height='17'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
									>
										<polygon points='16 3 21 8 8 21 3 21 3 16 16 3'></polygon>
									</svg>
								</label>
							</div>
							<p className='mb-4 font-semibold'>
								{currentPlaylist.description}
							</p>
						</div>
						<div className='p-4'>
							{currentPlaylist.tracks.map((trackObj, i) => {
								return (
									<div
										key={i}
										onMouseOver={() => handleTrackMouseOver(i)}
										onMouseLeave={handleTrackMouseLeave}
										className='flex'
									>
										<li className={` ${hovered === i ? 'w-5/6' : 'w-full'}`}>
											<a className='rounded-md'>{trackObj?.track?.name}</a>
										</li>
										<label
											onClick={() => removeTrack(trackObj?.track?.uri)}
											className={`${
												hovered === i ? 'w-1/6' : 'hidden'
											} btn btn-outline btn-secondary ml-1 my-auto`}
										>
											<svg
												xmlns='http://www.w3.org/2000/svg'
												width='24'
												height='24'
												viewBox='0 0 24 24'
												fill='none'
												stroke='hsl(var(--s))'
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
										</label>
									</div>
								);
							})}
						</div>
					</ul>
				</div>
			</div>
		</div>
	);
}
