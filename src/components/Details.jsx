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
	const search = useRef();
	const timeConvert = (ms) => {
		let totalSeconds = Math.floor(ms / 1000);
		let minutes = Math.floor(totalSeconds / 60);
		let seconds = totalSeconds % 60;
		return `${minutes.toString().padStart(2, '0')}:${seconds
			.toString()
			.padStart(2, '0')}`;
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
		search.current.scrollIntoView();
	};
	const getArtistData = async (id, name, imageUrl) => {
		console.log('fired', id, name, imageUrl);
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
				console.log('Data from URL 1:', data1);
				console.log('Data from URL 2:', data2);
				return data;
			})
			.catch((error) => console.error(error));
	};
	const handleArtistClick = async (id, name, imageUrl) => {
		const data = await getArtistData(id, name, imageUrl);
		console.log('combined', data);

		setArtistData({
			id: id,
			name: name,
			imageUrl: imageUrl,
			topTracks: data[0].tracks,
			albums: data[1].items,
		});
		setCurrentState('artist');
	};
	function handleMouseMove(event) {
		if (event.clientX <= 10) {
			// Check if mouse is on the left edge of the screen
			handleDrawer();
		}
	}
	window.addEventListener('mousemove', handleMouseMove);
	let content;
	if (currentState === null) {
		content = '';
	} else if (currentState === 'search') {
		content = (
			<div>
				<Tracks
					timeConvert={timeConvert}
					searchData={searchData}
				/>
				<Artists
					handleArtistClick={handleArtistClick}
					searchData={searchData}
				/>
				<Albums
					handleAlbumClick={handleAlbumClick}
					searchData={searchData}
				/>
			</div>
		);
	} else if (currentState === 'album') {
		content = (
			<Album
				timeConvert={timeConvert}
				albumData={albumData}
			/>
		);
	} else if (currentState === 'artist') {
		content = (
			<Artist
				artistData={artistData}
				timeConvert={timeConvert}
				handleAlbumClick={handleAlbumClick}
			/>
		);
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
						ref={search}
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
					<ul
						onMouseLeave={handleMouseLeave}
						className='menu p-4 w-80 bg-base-100 text-base-content'
					>
						<div>
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
